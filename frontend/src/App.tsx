// App.tsx
import { Route, Routes } from "react-router-dom";
import Header from "./UI/Header/Header";
import Home from "./UI/Home/HomePage.tsx";
import "./UI/Styles/app.scss";
import { ThemeProvider } from "./context/Theme.tsx";
import ProjectsPage from "./UI/Projects/ProjectsPage.tsx";
import TaskPage from "./UI/Tasks/TaskPage.tsx";
import UnderConstruction from "./UI/UnderConstruction/UnderConstruction.tsx";
import AIPage from "./UI/AI/AIPage.tsx";
import CodePage from "./UI/Code/CodePage.tsx";
import Login from "./common/Login/Login.tsx";
import { LoginProvider, useLogin } from "./context/Modal.tsx";
import { RegistrationProvider } from "./context/RegistrarionModal.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import dataStroe from "./Store/Data.tsx";
import StartPage from "./UI/Start/StartPage.tsx";
import { observer } from "mobx-react-lite";
import { CurrentUserStore } from "./Store/User.store.tsx";

const App = observer(() => {
  useEffect(() => {
    dataStroe.FetchALl();
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
                <Route path="/Home" element={<Home />} />
                <Route path="/Projects" element={<ProjectsPage />} />
                <Route path="/Tasks" element={<TaskPage />} />
                <Route path="/Code" element={<UnderConstruction />} />
                <Route path="/Settings" element={<UnderConstruction />} />
                <Route path="/Ai" element={<AIPage />} />
              </Routes>
            </div>
          </RegistrationProvider>
        </LoginProvider>
      </UserProvider>
    </ThemeProvider>
  );
});

export default App;
