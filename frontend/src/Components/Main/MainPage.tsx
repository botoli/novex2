// MainPage.tsx
import React, { useState, Suspense, lazy, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/user.js";
import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom";
import LeftPanel from "./LeftPanel.js";
import Hero from "./Hero.js";
import { ProjectService } from "../../assets/MockData/index.js";
import style from "../../style/Main/MainPage.module.scss";

// Ленивая загрузка страниц (для обратной совместимости)
const Dashboard = lazy(() => import("./Dashboard.js"));
const TasksPage = lazy(() => import("./TasksPage.js"));
const SettingsPage = lazy(() => import("./SettingsPage.js"));
const ProjectsPage = lazy(() => import("./ProjectsPage.js"));
const ProjectDetailPage = lazy(() => import("./ProjectDetailPage.js"));
const TeamChat = lazy(() => import("./TeamChat.js"));
const Schedule = lazy(() => import("./Schedule.js"));
const QuickNote = lazy(() => import("./QuickNote.js"));
const AIAssistantPage = lazy(() => import("./AIAssistantPage.js"));

type Page =
  | "main"
  | "projects"
  | "project-detail"
  | "team-chat"
  | "schedule"
  | "quick-note"
  | "tasks"
  | "dashboard"
  | "settings"
  | "ai";

function MainPage() {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  // Состояния для обратной совместимости
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedProjectTitle, setSelectedProjectTitle] = useState<string | null>(null);
  const [projectRefreshKey, setProjectRefreshKey] = useState(0);

  // Определяем текущую страницу на основе URL
  const getCurrentPageFromPath = (): Page => {
    const path = location.pathname;
    if (path.includes("/projects/") && params.id) {
      if (path.includes("/team-chat")) return "team-chat";
      if (path.includes("/schedule")) return "schedule";
      if (path.includes("/quick-note")) return "quick-note";
      return "project-detail";
    }
    if (path.endsWith("/projects") || path.includes("/projects")) return "projects";
    if (path.endsWith("/tasks")) return "tasks";
    if (path.endsWith("/dashboard")) return "dashboard";
    if (path.endsWith("/settings")) return "settings";
    if (path.endsWith("/ai-assistant")) return "ai";
    if (path.endsWith("/team-chat")) return "team-chat";
    if (path.endsWith("/schedule")) return "schedule";
    if (path.endsWith("/quick-note")) return "quick-note";
    return "main"; // индексный маршрут
  };

  const currentPage = getCurrentPageFromPath();

  // При изменении параметра ID проекта обновляем состояние
  useEffect(() => {
    if (params.id && !isNaN(Number(params.id))) {
      const projectId = Number(params.id);
      if (projectId !== selectedProjectId) {
        setSelectedProjectId(projectId);
        // Загружаем заголовок проекта
        const loadProjectTitle = async () => {
          try {
            const project = await ProjectService.getProjectById(projectId, user?.id);
            setSelectedProjectTitle(project.tittle || project.title);
          } catch (error) {
            console.error("Ошибка загрузки проекта:", error);
          }
        };
        loadProjectTitle();
      }
    } else if (currentPage !== "project-detail" && 
               currentPage !== "team-chat" && 
               currentPage !== "schedule" && 
               currentPage !== "quick-note") {
      // Сбрасываем выбранный проект, если мы не на страницах проекта
      setSelectedProjectId(null);
      setSelectedProjectTitle(null);
    }
  }, [params.id, currentPage, user?.id]);

  const refreshProjects = () => {
    setProjectRefreshKey((prev) => prev + 1);
  };

  const handleProjectClick = async (projectId: number) => {
    try {
      const project = await ProjectService.getProjectById(projectId, user?.id);
      setSelectedProjectId(projectId);
      setSelectedProjectTitle(project.tittle);
      navigate(`/projects/${projectId}`);
    } catch (error) {
      console.error("Ошибка загрузки проекта:", error);
      setSelectedProjectId(projectId);
      navigate(`/projects/${projectId}`);
    }
  };

  const handlePageChange = (page: string) => {
    const pageToPath: Record<string, string> = {
      "main": "/",
      "projects": "/projects",
      "tasks": "/tasks",
      "dashboard": "/dashboard",
      "settings": "/settings",
      "ai": "/ai-assistant",
      "team-chat": "/team-chat",
      "schedule": "/schedule",
      "quick-note": "/quick-note",
    };
    const path = pageToPath[page];
    if (path) {
      navigate(path);
    } else if (page === "project-detail" && selectedProjectId) {
      navigate(`/projects/${selectedProjectId}`);
    }
  };

  const handleBackToProjects = () => {
    navigate("/projects");
    setSelectedProjectId(null);
    setSelectedProjectTitle(null);
  };

  const handleBackToProjectDetail = () => {
    if (selectedProjectId) {
      navigate(`/projects/${selectedProjectId}`);
    }
  };

  const handleNavigateToTeamChat = async (projectId: number) => {
    try {
      const project = await ProjectService.getProjectById(projectId, user?.id);
      setSelectedProjectId(projectId);
      setSelectedProjectTitle(project.tittle);
      navigate(`/projects/${projectId}/team-chat`);
    } catch (error) {
      console.error("Ошибка загрузки проекта:", error);
      setSelectedProjectId(projectId);
      navigate(`/projects/${projectId}/team-chat`);
    }
  };

  const handleNavigateToSchedule = async (projectId: number) => {
    try {
      const project = await ProjectService.getProjectById(projectId, user?.id);
      setSelectedProjectId(projectId);
      setSelectedProjectTitle(project.title);
      navigate(`/projects/${projectId}/schedule`);
    } catch (error) {
      console.error("Ошибка загрузки проекта:", error);
      setSelectedProjectId(projectId);
      navigate(`/projects/${projectId}/schedule`);
    }
  };

  const handleNavigateToQuickNote = async (projectId: number) => {
    try {
      const project = await ProjectService.getProjectById(projectId, user?.id);
      setSelectedProjectId(projectId);
      setSelectedProjectTitle(project.tittle);
      navigate(`/projects/${projectId}/quick-note`);
    } catch (error) {
      console.error("Ошибка загрузки проекта:", error);
      setSelectedProjectId(projectId);
      navigate(`/projects/${projectId}/quick-note`);
    }
  };

  const handleNavigateToAI = () => {
    navigate("/ai-assistant");
  };

  // Рендер контента для обратной совместимости (если Outlet не используется)
  const renderContent = () => {
    switch (currentPage) {
      case "project-detail":
        if (selectedProjectId) {
          return (
            <ProjectDetailPage
              projectId={selectedProjectId}
              onBack={handleBackToProjects}
              onNavigateToTeamChat={handleNavigateToTeamChat}
              onNavigateToSchedule={handleNavigateToSchedule}
              onNavigateToQuickNote={handleNavigateToQuickNote}
              onNavigateToAI={handleNavigateToAI}
              onProjectDeleted={refreshProjects}
            />
          );
        }
        return (
          <ProjectsPage
            onProjectClick={handleProjectClick}
            projectRefreshKey={projectRefreshKey}
            onProjectDeleted={refreshProjects}
          />
        );
      case "team-chat":
        if (selectedProjectId) {
          return (
            <TeamChat
              projectId={selectedProjectId}
              projectTitle={selectedProjectTitle || undefined}
              onBack={handleBackToProjectDetail}
            />
          );
        }
        return (
          <ProjectsPage
            onProjectClick={handleProjectClick}
            projectRefreshKey={projectRefreshKey}
            onProjectDeleted={refreshProjects}
          />
        );
      case "schedule":
        if (selectedProjectId) {
          return (
            <Schedule
              projectId={selectedProjectId}
              projectTitle={selectedProjectTitle || undefined}
              onBack={handleBackToProjectDetail}
            />
          );
        }
        return (
          <ProjectsPage
            onProjectClick={handleProjectClick}
            projectRefreshKey={projectRefreshKey}
            onProjectDeleted={refreshProjects}
          />
        );
      case "quick-note":
        if (selectedProjectId) {
          return (
            <QuickNote
              projectId={selectedProjectId}
              projectTitle={selectedProjectTitle || undefined}
              onBack={handleBackToProjectDetail}
            />
          );
        }
        return (
          <ProjectsPage
            onProjectClick={handleProjectClick}
            projectRefreshKey={projectRefreshKey}
            onProjectDeleted={refreshProjects}
          />
        );
      case "projects":
        return (
          <ProjectsPage
            onProjectClick={handleProjectClick}
            projectRefreshKey={projectRefreshKey}
            onProjectDeleted={refreshProjects}
          />
        );
      case "tasks":
        return <TasksPage />;
      case "dashboard":
        return <Dashboard />;
      case "settings":
        return <SettingsPage />;
      case "ai":
        return <AIAssistantPage />;
      case "main":
      default:
        return (
          <div className={style.contentColumn}>
            <Hero
              onNavigateToProjects={() => navigate("/projects")}
              onProjectClick={handleProjectClick}
              projectRefreshKey={projectRefreshKey}
            />
          </div>
        );
    }
  };

  // Определяем, используется ли Outlet (проверяем, есть ли вложенные маршруты)
  const isOutletUsed = location.pathname !== "/" && 
    !location.pathname.endsWith("/main") && 
    !location.pathname.endsWith("/projects") &&
    !location.pathname.endsWith("/tasks") &&
    !location.pathname.endsWith("/dashboard") &&
    !location.pathname.endsWith("/settings") &&
    !location.pathname.endsWith("/ai-assistant") &&
    !location.pathname.endsWith("/team-chat") &&
    !location.pathname.endsWith("/schedule") &&
    !location.pathname.endsWith("/quick-note");

  return (
    <div className={style.mainContainer}>
      <div className={style.leftPanelContainer}>
        <LeftPanel
          onPageChange={handlePageChange}
          currentPage={currentPage}
          onProjectClick={handleProjectClick}
          activeProjectId={selectedProjectId}
          projectRefreshKey={projectRefreshKey}
        />
      </div>
      <div className={style.contentContainer}>
        <Suspense
          fallback={<div className={style.loadingFallback}>Загрузка...</div>}
        >
          {isOutletUsed ? <Outlet /> : renderContent()}
        </Suspense>
      </div>
    </div>
  );
}

export default MainPage;