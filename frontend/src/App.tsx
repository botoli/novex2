// App.tsx
import { data, Route, Routes } from "react-router-dom";
import Header from "./UI/Header/Header";
import Home from "./UI/Home/HomePage.tsx";
import "./UI/Styles/app.scss";
import { ThemeProvider } from "./context/Theme.tsx";
import ProjectsPage from "./UI/Projects/ProjectsPage.tsx";
import TaskPage from "./UI/Tasks/TaskPage.tsx";
import UnderConstruction from "./UI/UnderConstruction/UnderConstruction.tsx";
import AIPage from "./UI/AI/AIPage.tsx";
import { LoginProvider, useLogin } from "./context/Modal.tsx";
import { RegistrationProvider } from "./context/RegistrarionModal.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import StartPage from "./UI/Start/StartPage.tsx";
import { observer } from "mobx-react-lite";
import { CurrentUserStore } from "./Store/User.store.tsx";
import dataStore from "./Store/Data.tsx";
import { useEffect } from "react";

const App = observer(() => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dataStore.setToken(Number(token));
      dataStore.FetchAll();
    }
  }, []);
  return (
    <ThemeProvider>
      <UserProvider>
        <LoginProvider>
          <RegistrationProvider>
            <div className="App">
              {CurrentUserStore.currentuser ||
              window.location.pathname !== "/" ? (
                <Header />
              ) : (
                <StartPage />
              )}
              <Routes>
                <Route
                  path="/"
                  element={
                    CurrentUserStore.currentuser ? <Home /> : <StartPage />
                  }
                />
                <Route path="/home" element={<Home />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/tasks" element={<TaskPage />} />
                <Route path="/code" element={<UnderConstruction />} />
                <Route path="/settings" element={<UnderConstruction />} />
                <Route path="/ai" element={<AIPage />} />
              </Routes>
            </div>
          </RegistrationProvider>
        </LoginProvider>
      </UserProvider>
    </ThemeProvider>
  );
});

export default App;
