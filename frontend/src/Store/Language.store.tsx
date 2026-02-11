import { makeAutoObservable } from "mobx";

export type Lang = "ru" | "en";

const translations = {
  ru: {
    welcome: "Добро пожаловать в Novex",
    heroDesc:
      "Менеджер задач для эффективной и организованной командной работы, созданный для продуктивности.",
    loginAsUser: "Войти как пользователь",
    loginAsUserSub: "Для постоянных пользователей приложения",
    loginAsTest: "Войти как тестовый пользователь",
    loginAsTestSub: "Для быстрого ознакомления (HR и другие)",
    login: "Войти",
    or: "или",
    manageTasks: "Управляйте задачами",
    manageTasksDesc: "Организуйте и отслеживайте задачи своей команды",
    followTeam: "Следите за командой",
    followTeamDesc: "Просмотривайте активность и производительность",
    analyzeProgress: "Анализируйте прогресс",
    analyzeProgressDesc: "Отслеживайте метрики и эффективность",
    activeUsers: "Активных пользователей",
    completedTasks: "Завершённых задач",
    uptime: "Uptime",
    support: "Поддержка",
    platformFeatures: "Возможности платформы",
    kanban: "Канбан-доски",
    kanbanDesc:
      "Визуализируйте рабочий процесс с помощью гибких досок задач. Перетаскивайте карточки между колонками.",
    deadlines: "Дедлайны и приоритеты",
    deadlinesDesc:
      "Устанавливайте сроки, назначайте приоритеты и получайте уведомления о приближающихся дедлайнах.",
    analytics: "Аналитика и отчёты",
    analyticsDesc:
      "Детальная статистика по задачам, проектам и производительности каждого члена команды.",
    teamChat: "Командный чат",
    teamChatDesc:
      "Обсуждайте задачи прямо в контексте проекта. Комментарии, упоминания и уведомления.",
    integrations: "Интеграции",
    integrationsDesc:
      "GitHub, GitLab и другие сервисы. Автоматическая синхронизация задач с вашими репозиториями.",
    aiAssistant: "AI-помощник",
    aiAssistantDesc:
      "Искусственный интеллект помогает планировать задачи, оценивать сроки и оптимизировать процессы.",
    howItWorks: "Как это работает",
    step1Title: "Создайте проект",
    step1Desc: "Определите цели, добавьте описание и пригласите участников.",
    step2Title: "Добавьте задачи",
    step2Desc: "Разбейте проект на задачи, назначьте исполнителей и сроки.",
    step3Title: "Отслеживайте прогресс",
    step3Desc: "Следите за статусами, метриками и завершайте проекты вовремя.",
    readyToStart: "Готовы начать?",
    readyToStartDesc:
      "Присоединяйтесь к тысячам команд, которые уже используют Novex для управления проектами.",
    startFree: "Начать бесплатно",
    tryDemo: "Попробовать демо",
    privacy: "Политика конфиденциальности",
    terms: "Условия использования",
  },
  en: {
    welcome: "Welcome to Novex",
    heroDesc:
      "Task Manager for efficient and organized team collaboration, built for productivity.",
    loginAsUser: "Sign in as user",
    loginAsUserSub: "For regular application users",
    loginAsTest: "Sign in as test user",
    loginAsTestSub: "For a quick overview (HR and others)",
    login: "Sign in",
    or: "or",
    manageTasks: "Manage tasks",
    manageTasksDesc: "Organize and track your team's tasks",
    followTeam: "Monitor your team",
    followTeamDesc: "View activity and productivity",
    analyzeProgress: "Analyze progress",
    analyzeProgressDesc: "Track metrics and efficiency",
    activeUsers: "Active users",
    completedTasks: "Completed tasks",
    uptime: "Uptime",
    support: "Support",
    platformFeatures: "Platform features",
    kanban: "Kanban boards",
    kanbanDesc:
      "Visualize your workflow with flexible task boards. Drag and drop cards between columns.",
    deadlines: "Deadlines & priorities",
    deadlinesDesc:
      "Set deadlines, assign priorities and get notifications about approaching due dates.",
    analytics: "Analytics & reports",
    analyticsDesc:
      "Detailed statistics on tasks, projects and performance of each team member.",
    teamChat: "Team chat",
    teamChatDesc:
      "Discuss tasks in the context of the project. Comments, mentions and notifications.",
    integrations: "Integrations",
    integrationsDesc:
      "GitHub, GitLab and other services. Automatic sync of tasks with your repositories.",
    aiAssistant: "AI assistant",
    aiAssistantDesc:
      "Artificial intelligence helps plan tasks, estimate deadlines and optimize processes.",
    howItWorks: "How it works",
    step1Title: "Create a project",
    step1Desc: "Define goals, add a description and invite members.",
    step2Title: "Add tasks",
    step2Desc: "Break the project into tasks, assign performers and deadlines.",
    step3Title: "Track progress",
    step3Desc: "Monitor statuses, metrics and complete projects on time.",
    readyToStart: "Ready to start?",
    readyToStartDesc:
      "Join thousands of teams already using Novex for project management.",
    startFree: "Start for free",
    tryDemo: "Try demo",
    privacy: "Privacy policy",
    terms: "Terms of use",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["ru"];

class LanguageStore {
  lang: Lang = (localStorage.getItem("lang") as Lang) || "ru";

  constructor() {
    makeAutoObservable(this);
  }

  setLang(lang: Lang) {
    this.lang = lang;
    localStorage.setItem("lang", lang);
  }

  get t() {
    return translations[this.lang];
  }
}

export const languageStore = new LanguageStore();
