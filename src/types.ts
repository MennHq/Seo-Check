export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export interface MainTask {
  id: string;
  title: string;
  description?: string;
  subTasks: SubTask[];
  date: string; // ISO date string (YYYY-MM-DD)
  completed: boolean;
  status: 'active' | 'completed' | 'reserve';
  createdAt: number;
}

export interface UserStats {
  streak: number;
  lastCompletedDate: string | null;
  totalCompletedTasks: number;
}
