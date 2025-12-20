import { httpClient } from './httpClient';

export interface Project {
  id: number;
  title: string;
  description: string;
  owner_id: number;
  created_at: string;
  updated_at: string;
  progress?: number;
  members?: number;
  tasks?: number;
  status?: string;
  owner?: User;
  users?: User[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  avatar?: string;
  position?: string;
  department?: string;
  online?: boolean;
}

class ProjectService {
  // Создать проект
  async createProject(projectData: {
    title: string;
    description: string;
    owner_id: number;
  }): Promise<Project> {
    return httpClient.post<Project>('/projects/create', projectData);
  }

  // Получить проекты пользователя
  async getUserProjects(userId: number): Promise<Project[]> {
    return httpClient.get<Project[]>(`/projects`, { params: { user_id: userId } });
  }

  // Получить проект по ID
  async getProjectById(projectId: number): Promise<Project> {
    return httpClient.get<Project>(`/projects/${projectId}`);
  }

  // Обновить проект
  async updateProject(projectId: number, data: Partial<Project>): Promise<Project> {
    return httpClient.put<Project>(`/projects/${projectId}`, data);
  }

  // Удалить проект
  async deleteProject(projectId: number): Promise<void> {
    return httpClient.delete(`/projects/${projectId}`);
  }

  // Получить участников проекта
  async getProjectMembers(projectId: number): Promise<User[]> {
    return httpClient.get<User[]>(`/projects/${projectId}/members`);
  }

  // Добавить участника в проект
  async addMember(projectId: number, userId: number): Promise<void> {
    return httpClient.post(`/projects/${projectId}/members`, { user_id: userId });
  }

  // Удалить участника из проекта
  async removeMember(projectId: number, userId: number): Promise<void> {
    return httpClient.delete(`/projects/${projectId}/members/${userId}`);
  }
}

export const projectService = new ProjectService();
export default projectService;