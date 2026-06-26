import { useState, useEffect } from 'react';
import { MainTask, UserStats, SubTask } from '../types';
import { format, isYesterday, isToday, parseISO } from 'date-fns';
import { supabase } from '../lib/supabase';

export function useTasks() {
  const [tasks, setTasks] = useState<MainTask[]>([]);
  const [stats, setStats] = useState<UserStats>({ streak: 0, lastCompletedDate: null, totalCompletedTasks: 0 });
  const [loading, setLoading] = useState(true);

  // Load stats from LocalStorage (Stats are usually light and better kept local or in a separate profile table)
  useEffect(() => {
    const savedStats = localStorage.getItem('menn_stats');
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  useEffect(() => {
    localStorage.setItem('menn_stats', JSON.stringify(stats));
  }, [stats]);

  // Fetch Tasks from Supabase or LocalStorage
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      if (supabase) {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching tasks:', error);
          const saved = localStorage.getItem('menn_tasks');
          if (saved) setTasks(JSON.parse(saved));
        } else if (data) {
          const mappedTasks: MainTask[] = data.map(t => ({
            id: t.id,
            title: t.title,
            date: t.date,
            completed: t.completed,
            status: t.status || (t.completed ? 'completed' : 'active'),
            subTasks: t.sub_tasks || [],
            createdAt: new Date(t.created_at).getTime()
          }));
          setTasks(mappedTasks);
          localStorage.setItem('menn_tasks', JSON.stringify(mappedTasks));
        }
      } else {
        const saved = localStorage.getItem('menn_tasks');
        if (saved) setTasks(JSON.parse(saved));
      }
      setLoading(false);
    };

    fetchTasks();

    // Realtime subscription
    if (supabase) {
      const subscription = supabase
        .channel('tasks_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
          fetchTasks();
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  // Sync tasks to LocalStorage as a backup
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('menn_tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = async (title: string, date: Date = new Date()) => {
    const tempId = crypto.randomUUID();
    const newTaskData = {
      title,
      date: format(date, 'yyyy-MM-dd'),
      completed: false,
      status: 'active' as const,
      sub_tasks: []
    };

    // Optimistic task for immediate UI update
    const optimisticTask: MainTask = {
      id: tempId,
      title: newTaskData.title,
      date: newTaskData.date,
      completed: newTaskData.completed,
      status: newTaskData.status,
      subTasks: [],
      createdAt: Date.now()
    };

    // Update UI immediately
    setTasks(prev => [optimisticTask, ...prev]);

    if (supabase) {
      try {
        const { data, error } = await supabase.from('tasks').insert([newTaskData]).select();
        if (error) throw error;
        
        if (data && data[0]) {
          const t = data[0];
          const mapped: MainTask = {
            id: t.id,
            title: t.title,
            date: t.date,
            completed: t.completed,
            status: t.status,
            subTasks: t.sub_tasks || [],
            createdAt: new Date(t.created_at).getTime()
          };
          // Replace optimistic task with real task from server to get the correct ID
          setTasks(prev => prev.map(task => task.id === tempId ? mapped : task));
        }
      } catch (error) {
        console.error('Error adding task:', error);
        // If it fails, we keep the optimistic one but maybe show an error? 
        // Or remove it if we want to be strict. 
        // For now, let's keep it so it doesn't "disappear" and frustrate the user.
      }
    }
  };

  const updateTask = async (taskId: string, updates: Partial<MainTask>) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));

    if (supabase) {
      const supabaseUpdates: any = {};
      if (updates.title !== undefined) supabaseUpdates.title = updates.title;
      if (updates.completed !== undefined) supabaseUpdates.completed = updates.completed;
      if (updates.status !== undefined) supabaseUpdates.status = updates.status;
      if (updates.subTasks !== undefined) supabaseUpdates.sub_tasks = updates.subTasks;

      const { error } = await supabase.from('tasks').update(supabaseUpdates).eq('id', taskId);
      if (error) {
        console.error('Error updating task:', error);
        // Revert or handle error? For now just log.
      }
    }
  };

  const deleteTask = async (taskId: string) => {
    // Optimistic update
    setTasks(prev => prev.filter(t => t.id !== taskId));

    if (supabase) {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const addSubTask = async (taskId: string, title: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newSub: SubTask = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: Date.now()
    };

    const updatedSubTasks = [...task.subTasks, newSub];
    await updateTask(taskId, { subTasks: updatedSubTasks, completed: false });
  };

  const toggleSubTask = async (taskId: string, subTaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedSubTasks = task.subTasks.map(st =>
      st.id === subTaskId ? { ...st, completed: !st.completed } : st
    );
    
    const allDone = updatedSubTasks.length > 0 && updatedSubTasks.every(st => st.completed);
    const newStatus = allDone ? 'completed' : 'active';
    
    if (allDone && !task.completed) {
      updateStreak();
    }

    await updateTask(taskId, { subTasks: updatedSubTasks, completed: allDone, status: newStatus });
  };

  const deleteSubTask = async (taskId: string, subTaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedSubTasks = task.subTasks.filter(st => st.id !== subTaskId);
    const allDone = updatedSubTasks.length > 0 && updatedSubTasks.every(st => st.completed);
    const newStatus = allDone ? 'completed' : 'active';
    await updateTask(taskId, { subTasks: updatedSubTasks, completed: allDone, status: newStatus });
  };

  const updateStreak = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setStats(prev => {
      if (prev.lastCompletedDate === today) return prev;
      
      let newStreak = prev.streak;
      if (!prev.lastCompletedDate || isYesterday(parseISO(prev.lastCompletedDate))) {
        newStreak += 1;
      } else if (!isToday(parseISO(prev.lastCompletedDate))) {
        newStreak = 1;
      }

      return {
        ...prev,
        streak: newStreak,
        lastCompletedDate: today,
        totalCompletedTasks: prev.totalCompletedTasks + 1,
      };
    });
  };

  const reorderSubTasks = async (taskId: string, newSubTasks: SubTask[]) => {
    await updateTask(taskId, { subTasks: newSubTasks });
  };

  return {
    tasks,
    stats,
    loading,
    addTask,
    updateTask,
    deleteTask,
    addSubTask,
    toggleSubTask,
    deleteSubTask,
    reorderSubTasks,
  };
}
