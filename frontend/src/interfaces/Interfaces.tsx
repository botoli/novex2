export interface ProjectInterface {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  project_id: number;
  created_by: number;
  assigned_to: number;
  tags: string[];
}
export interface HeaderInterface {
  id: number;
  name: string;
  active: boolean;
}

export interface UserInterface {
  userid: number;
  email: string;
  password: string;
  name: string;
  online: boolean;
  role: string;
  avatar: boolean;
}
export interface TaskInterface {
  id: number;
  name: string;
  status: 'active' | 'completed' | 'blocked' | 'overdue';
  projectId: number; // Ссылка на проект
  priority: 'low' | 'medium' | 'high'; // Вместо risk
  createdAt: Date | string;
  deadline: Date | string; // Исправлено dedline → deadline
  assigneeId?: number; // Кому назначена
  tags: string[]; // Для фильтрации
}
export interface HeaderInterface {
  id: number;
  name: string;
  active: boolean;
}
