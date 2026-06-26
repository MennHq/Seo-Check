import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Plus, 
  ChevronDown, 
  ChevronRight,
  GripVertical,
  Calendar,
  Clock,
  Archive,
  CheckCircle
} from 'lucide-react';
import { MainTask, SubTask } from '../types';
import { cn } from '../lib/utils';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: MainTask;
  isEditMode: boolean;
  onToggleSubTask: (taskId: string, subTaskId: string) => void;
  onAddSubTask: (taskId: string, title: string) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteSubTask: (taskId: string, subTaskId: string) => void;
  onReorderSubTasks: (taskId: string, subTasks: SubTask[]) => void;
  onUpdateStatus: (status: 'active' | 'completed' | 'reserve') => void;
}

const SortableSubTask = ({ 
  subTask, 
  taskId, 
  isEditMode, 
  onToggle, 
  onDelete 
}: { 
  subTask: SubTask; 
  taskId: string; 
  isEditMode: boolean;
  onToggle: (taskId: string, subTaskId: string) => void;
  onDelete: (taskId: string, subTaskId: string) => void;
  key?: string;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: subTask.id, disabled: !isEditMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-3 py-2 px-3 rounded-lg transition-colors",
        isDragging ? "bg-muted/50" : "hover:bg-muted/30"
      )}
    >
      {isEditMode && (
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-muted-foreground group-hover:opacity-100 opacity-0 transition-opacity">
          <GripVertical size={14} />
        </button>
      )}
      <button 
        onClick={() => onToggle(taskId, subTask.id)}
        className="text-muted-foreground hover:text-white transition-colors"
      >
        {subTask.completed ? (
          <CheckCircle2 size={18} className="text-white" />
        ) : (
          <Circle size={18} />
        )}
      </button>
      <span className={cn(
        "text-sm flex-1",
        subTask.completed ? "text-muted-foreground line-through" : "text-white"
      )}>
        {subTask.title}
      </span>
      {isEditMode && (
        <button 
          onClick={() => onDelete(taskId, subTask.id)}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 hover:text-red-500 rounded transition-all"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
};

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  isEditMode, 
  onToggleSubTask, 
  onAddSubTask, 
  onDeleteTask,
  onDeleteSubTask,
  onReorderSubTasks,
  onUpdateStatus
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = task.subTasks.findIndex((t) => t.id === active.id);
      const newIndex = task.subTasks.findIndex((t) => t.id === over.id);
      onReorderSubTasks(task.id, arrayMove(task.subTasks, oldIndex, newIndex));
    }
  };

  const handleAddSubTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newSubTaskTitle.trim()) {
      onAddSubTask(task.id, newSubTaskTitle.trim());
      setNewSubTaskTitle('');
    }
  };

  const completedCount = task.subTasks.filter(st => st.completed).length;
  const progress = task.subTasks.length > 0 ? (completedCount / task.subTasks.length) * 100 : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass premium-shadow studio-shadow rounded-3xl overflow-hidden border-white/10 mb-6"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-white/5 rounded-xl transition-colors text-muted-foreground"
            >
              {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            <h3 className={cn(
              "font-syne font-bold text-xl tracking-tight transition-all uppercase italic",
              task.status === 'completed' ? "text-muted-foreground line-through" : "text-white"
            )}>
              {task.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-2">
            {isEditMode && (
              <div className="flex items-center bg-white/5 p-1 rounded-full border border-white/5 mr-2 studio-shadow">
                <button
                  onClick={() => onUpdateStatus('active')}
                  className={cn(
                    "p-2 rounded-full transition-all",
                    task.status === 'active' ? "premium-gradient text-black shadow-lg" : "text-muted-foreground hover:text-white"
                  )}
                  title="Active"
                >
                  <Clock size={14} />
                </button>
                <button
                  onClick={() => onUpdateStatus('completed')}
                  className={cn(
                    "p-2 rounded-full transition-all",
                    task.status === 'completed' ? "premium-gradient text-black shadow-lg" : "text-muted-foreground hover:text-white"
                  )}
                  title="Complete"
                >
                  <CheckCircle size={14} />
                </button>
                <button
                  onClick={() => onUpdateStatus('reserve')}
                  className={cn(
                    "p-2 rounded-full transition-all",
                    task.status === 'reserve' ? "premium-gradient text-black shadow-lg" : "text-muted-foreground hover:text-white"
                  )}
                  title="Reserve"
                >
                  <Archive size={14} />
                </button>
              </div>
            )}
            
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              <Calendar size={12} />
              {task.date}
            </div>

            {isEditMode && (
              <button 
                onClick={() => onDeleteTask(task.id)}
                className="p-2.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {task.subTasks.length > 0 && (
          <div className="mb-6 px-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Progress</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-white">{Math.round(progress)}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full premium-gradient"
              />
            </div>
          </div>
        )}

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-1 mb-6">
                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext 
                    items={task.subTasks.map(st => st.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {task.subTasks.map((subTask) => (
                      <SortableSubTask 
                        key={subTask.id}
                        subTask={subTask}
                        taskId={task.id}
                        isEditMode={isEditMode}
                        onToggle={onToggleSubTask}
                        onDelete={onDeleteSubTask}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>

              {isEditMode && (
                <form onSubmit={handleAddSubTask} className="flex gap-2">
                  <div className="relative flex-1">
                    <Plus size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Add a step..."
                      value={newSubTaskTitle}
                      onChange={(e) => setNewSubTaskTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddSubTask();
                        }
                      }}
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-white/10 transition-all placeholder:text-muted-foreground/30"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-white text-black rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/90 transition-colors shadow-lg studio-shadow"
                  >
                    Add
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
