export interface ProjectInterface {
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
