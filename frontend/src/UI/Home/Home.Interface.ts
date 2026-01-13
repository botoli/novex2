export interface HeaderInterface {
  id: number;
  name: string;
  active: boolean;
}

export interface TaskInterface {
  id: number;
  name: string;
  active: boolean;
  project: string;
  risk: string;
  createdAt: string;
  dedline: string;
}
