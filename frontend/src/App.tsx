// App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  useNavigate,
} from "react-router-dom";
import Regmodule from "./Components/Form/Regmodule";
import MainPage from "./Components/Main/MainPage";
import ProjectsPage from "./Components/Main/ProjectsPage";
import ProjectDetailPage from "./Components/Main/ProjectDetailPage";
import TasksPage from "./Components/Main/TasksPage";
import Schedule from "./Components/Main/Schedule";
import TeamChat from "./Components/Main/TeamChat";
import AIAssistantPage from "./Components/Main/AIAssistantPage";
import Dashboard from "./Components/Main/Dashboard";
import SettingsPage from "./Components/Main/SettingsPage";
import QuickNote from "./Components/Main/QuickNote";
import Hero from "./Components/Main/Hero";
import NotFound404 from "./Components/Errors/NotFound404";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setVerificationCode, setVerified } from "./store/user";

// Обёртка для TeamChat с параметрами из URL
function TeamChatWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = id ? parseInt(id, 10) : 0;

  const handleBack = () => {
    if (projectId) {
      navigate(`/projects/${projectId}`);
    } else {
      navigate("/projects");
    }
  };

  return (
    <TeamChat
      projectId={projectId}
      projectTitle={undefined}
      onBack={handleBack}
    />
  );
}

// Обёртка для Schedule с параметрами из URL
function ScheduleWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = id ? parseInt(id, 10) : 0;

  const handleBack = () => {
    if (projectId) {
      navigate(`/projects/${projectId}`);
    } else {
      navigate("/projects");
    }
  };

  return (
    <Schedule
      projectId={projectId}
      projectTitle={undefined}
      onBack={handleBack}
    />
  );
}

// Обёртка для QuickNote с параметрами из URL
function QuickNoteWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = id ? parseInt(id, 10) : 0;

  const handleBack = () => {
    if (projectId) {
      navigate(`/projects/${projectId}`);
    } else {
      navigate("/projects");
    }
  };

  return (
    <QuickNote
      projectId={projectId}
      projectTitle={undefined}
      onBack={handleBack}
    />
  );
}

// Обёртка для ProjectDetailPage с параметрами из URL
function ProjectDetailPageWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = id ? parseInt(id, 10) : 0;

  const handleBack = () => {
    navigate("/projects");
  };

  const handleNavigateToTeamChat = (projectId: number) => {
    navigate(`/projects/${projectId}/team-chat`);
  };

  const handleNavigateToSchedule = (projectId: number) => {
    navigate(`/projects/${projectId}/schedule`);
  };

  const handleNavigateToQuickNote = (projectId: number) => {
    navigate(`/projects/${projectId}/quick-note`);
  };

  const handleNavigateToAI = () => {
    navigate("/ai-assistant");
  };

  const handleProjectDeleted = () => {
    // Можно обновить список проектов, но пока просто навигация
    navigate("/projects");
  };

  return (
    <ProjectDetailPage
      projectId={projectId}
      onBack={handleBack}
      onNavigateToTeamChat={handleNavigateToTeamChat}
      onNavigateToSchedule={handleNavigateToSchedule}
      onNavigateToQuickNote={handleNavigateToQuickNote}
      onNavigateToAI={handleNavigateToAI}
      onProjectDeleted={handleProjectDeleted}
    />
  );
}

// Обёртка для общих страниц (без projectId)
function GeneralTeamChat() {
  const navigate = useNavigate();
  const handleBack = () => navigate("/projects");
  return (
    <TeamChat projectId={0} projectTitle={undefined} onBack={handleBack} />
  );
}

function GeneralSchedule() {
  const navigate = useNavigate();
  const handleBack = () => navigate("/projects");
  return (
    <Schedule projectId={0} projectTitle={undefined} onBack={handleBack} />
  );
}

function GeneralQuickNote() {
  const navigate = useNavigate();
  const handleBack = () => navigate("/projects");
  return (
    <QuickNote projectId={0} projectTitle={undefined} onBack={handleBack} />
  );
}

function App() {
  const user = useSelector(selectUser);
  console.log(user);

  return (
    <div className="App">
      <Routes>
        <Route path="/auth/*" element={<Regmodule />} />
        {user.isVerified ? (
          <Route path="/" element={<MainPage />}>
            <Route index element={<Hero />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:id" element={<ProjectDetailPageWrapper />} />
            <Route
              path="projects/:id/team-chat"
              element={<TeamChatWrapper />}
            />
            <Route path="projects/:id/schedule" element={<ScheduleWrapper />} />
            <Route
              path="projects/:id/quick-note"
              element={<QuickNoteWrapper />}
            />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="schedule" element={<GeneralSchedule />} />
            <Route path="team-chat" element={<GeneralTeamChat />} />
            <Route path="ai-assistant" element={<AIAssistantPage />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="quick-note" element={<GeneralQuickNote />} />
          </Route>
        ) : (
          <Route path="/" element={<Regmodule />} />
        )}
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </div>
  );
}

export default App;
