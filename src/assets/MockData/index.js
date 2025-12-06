// Мок-данные проектов
export const mockProjects = [
  {
    id: 1,
    tittle: "Тестовый проект",
    description: "Описание тестового проекта",
    owner_id: 1,
    created_at: "2025-12-05T20:31:47.000Z",
    updated_at: "2025-12-05T20:31:47.000Z",
    progress: 75,
    members: 5,
    tasks: 23,
    status: "active",
  },
  {
    id: 2,
    tittle: "123",
    description: "123",
    owner_id: 1,
    created_at: "2025-12-05T20:45:03.000Z",
    updated_at: "2025-12-05T20:45:03.000Z",
    progress: 45,
    members: 3,
    tasks: 12,
    status: "review",
  },
  {
    id: 3,
    tittle: "Веб-приложение",
    description: "Разработка современного веб-приложения",
    owner_id: 1,
    created_at: "2025-12-04T10:15:22.000Z",
    updated_at: "2025-12-04T10:15:22.000Z",
    progress: 90,
    members: 8,
    tasks: 45,
    status: "active",
  },
  {
    id: 4,
    tittle: "Мобильное приложение",
    description: "iOS и Android приложение",
    owner_id: 1,
    created_at: "2025-12-03T14:30:10.000Z",
    updated_at: "2025-12-03T14:30:10.000Z",
    progress: 25,
    members: 4,
    tasks: 18,
    status: "active",
  },
  {
    id: 5,
    tittle: "Дизайн система",
    description: "Создание дизайн-системы для компании",
    owner_id: 1,
    created_at: "2025-12-02T09:20:15.000Z",
    updated_at: "2025-12-02T09:20:15.000Z",
    progress: 100,
    members: 6,
    tasks: 32,
    status: "completed",
  },
];

// Мок-сервис для работы с проектами
export const ProjectService = {
  // Получить проекты пользователя (мок версия)
  getUserProjects: async (userId) => {
    console.log(`[Mock API] Получение проектов пользователя ${userId}`);

    // Эмуляция задержки сети
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Фильтруем проекты по owner_id
    const userProjects = mockProjects.filter(
      (project) => project.owner_id === userId
    );

    return userProjects;
  },

  // Получить все проекты (мок версия)
  getAllProjects: async () => {
    console.log("[Mock API] Получение всех проектов");

    await new Promise((resolve) => setTimeout(resolve, 500));

    return [...mockProjects];
  },

  // Создать проект (мок версия)
  createProject: async (projectData) => {
    console.log("[Mock API] Создание проекта:", projectData);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const newProject = {
      id: mockProjects.length + 1,
      ...projectData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      progress: 0,
      members: 1,
      tasks: 0,
      status: "active",
    };

    mockProjects.unshift(newProject); // Добавляем в начало массива

    return newProject;
  },
};

// Хелпер функции
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "#05df72";
    case "review":
      return "#fdc700";
    case "completed":
      return "#667eea";
    default:
      return "#667eea";
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case "active":
      return "Активный";
    case "review":
      return "На проверке";
    case "completed":
      return "Завершен";
    default:
      return "В работе";
  }
};
