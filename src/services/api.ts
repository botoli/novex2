const API_BASE_URL = "http://localhost:8000/api";

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

interface Project {
  id: number;
  tittle: string;
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

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  avatar?: string;
  position?: string;
  department?: string;
  online?: boolean;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Ошибка запроса");
    }

    return data.data as T;
  }

  // Auth methods
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    status: string;
  }) {
    return this.request("/create", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async checkUser(email: string, name: string) {
    return this.request(`/check-user?email=${email}&name=${name}`, {
      method: "GET",
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  // Project methods
  async createProject(projectData: {
    tittle: string;
    description: string;
    owner_id: number;
  }) {
    return this.request<Project>("/createProj", {
      method: "POST",
      body: JSON.stringify(projectData),
    });
  }

  async getUserProjects(userId: number) {
    return this.request<Project[]>(`/projects?user_id=${userId}`, {
      method: "GET",
    });
  }

  async getAllProjects() {
    // Note: This endpoint might not exist yet, we'll need to create it
    return this.request<Project[]>("/projects/all", {
      method: "GET",
    });
  }

  async getProjectById(projectId: number) {
    // Note: This endpoint might not exist yet, we'll need to create it
    return this.request<Project>(`/projects/${projectId}`, {
      method: "GET",
    });
  }
}

export const apiService = new ApiService();
export type { Project, User };
