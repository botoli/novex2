import type { ProjectInterface } from './Projects.interface';

export const Projects: ProjectInterface[] = [
  {
    title: 'Разработать главную страницу',
    description: 'Создать дизайн и верстку главной страницы',
    status: 'pending',
    priority: 'high',
    due_date: '2024-12-31',
    project_id: 1,
    created_by: 1,
    assigned_to: 2,
    tags: ['дизайн', 'срочно'],
  },
  {
    title: 'Добавить функционал поиска',
    description: 'Разработать функционал поиска по задачам',
    status: 'pending',
    priority: 'medium',
    due_date: '2024-12-31',
    project_id: 1,
    created_by: 1,
    assigned_to: 2,
    tags: ['функционал', 'срочно'],
  },
];
