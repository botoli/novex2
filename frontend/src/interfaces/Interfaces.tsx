export interface ProjectInterface {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  project_id: number;
  created_by: number;
  assigned_to: [{ id: number; name: string }];
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
  status: "in_progress" | "done" | "blocked" | "todo";
  projectId: number;
  priority: "low" | "medium" | "high";
  priorityId: number;
  createdAt: Date | string;
  deadline: Date | string;
  assigned_to?: number[];
  tags: string[]; // Для фильтрации
}
export interface HeaderInterface {
  id: number;
  name: string;
  active: boolean;
}
export interface CreateTaskDto {
  // Обязательные поля
  title: string; // заголовок задачи
  project_id: number; // в каком проекте
  // Опциональные (может быть null или undefined)
  description?: string | null; // описание
  status?: "todo"; // статус (по умолчанию 'todo')
  priority: string; // приоритет (по умолчанию 'medium')
  assignee_id?: number | null; // кому назначена
  parent_task_id?: number | null; // если это подзадача
  estimated_hours?: number | null; // планируемое время
  due_date?: string | null; // дедлайн
  position?: number; // порядок в канбане
}
