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

// Хелпер для форматирования даты дедлайна
export const formatDeadlineDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Сегодня";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Завтра";
  } else {
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
    });
  }
};

// Хелпер для получения цвета приоритета
export const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "#FF6467";
    case "medium":
      return "#FDC700";
    case "low":
      return "#667EEA";
    default:
      return "#667EEA";
  }
};

// Реальный сервис для работы с проектами
export const ProjectService = {
  // Получить проекты пользователя (реальная версия)
  getUserProjects: async (userId) => {
    console.log(`[API] Получение проектов пользователя ${userId}`);
    try {
      const response = await fetch(
        `http://localhost:8000/api/projects?user_id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Ошибка загрузки проектов");
      }

      return data.projects || [];
    } catch (error) {
      console.error("Ошибка загрузки проектов:", error);
      throw error;
    }
  },

  // Получить все проекты (реальная версия)
  getAllProjects: async () => {
    console.log("[API] Получение всех проектов");
    try {
      // Пока используем getUserProjects с ID 1 как временное решение
      const response = await fetch(
        "http://localhost:8000/api/projects?user_id=1",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Ошибка загрузки проектов");
      }

      return data.projects || [];
    } catch (error) {
      console.error("Ошибка загрузки всех проектов:", error);
      throw error;
    }
  },

  // Создать проект (реальная версия)
  createProject: async (projectData) => {
    console.log("[API] Создание проекта:", projectData);
    try {
      const response = await fetch("http://localhost:8000/api/createProj", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(projectData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Ошибка создания проекта");
      }

      return data.project;
    } catch (error) {
      console.error("Ошибка создания проекта:", error);
      throw error;
    }
  },

  // Получить проект по ID (реальная версия)
  getProjectById: async (projectId) => {
    console.log(`[API] Получение проекта ${projectId}`);
    try {
      // Пока используем getAllProjects и фильтруем
      const allProjects = await ProjectService.getAllProjects();
      const project = allProjects.find((p) => p.id === projectId);

      if (!project) {
        throw new Error("Проект не найден");
      }

      return project;
    } catch (error) {
      console.error("Ошибка загрузки проекта:", error);
      throw error;
    }
  },
};
