import React, { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import { Tabs } from "./tabs";
import { Link, useLocation } from "react-router-dom";
import {
  LogoIcon,
  HomeIcon,
  ProjectsIcon,
  TasksIcon,
  CodeIcon,
  SettingsIcon,
  AIIcon,
  MenuIcon,
  CloseIcon,
} from "../Icons/index.ts";
import { useTheme } from "../../context/Theme.tsx";
import { nowurl, useData } from "../../fetch/fetchTasks.tsx";
import { observer } from "mobx-react-lite";
import { CurrentUserStore } from "../../Store/User.store.tsx";
import dataStroe from "../../Store/Data.tsx";

const Header = observer(() => {
  const location = useLocation();
  const currentPath = location.pathname;

  const [currentProjects, setCurrentProjects] = useState<any[]>([]);
  const [currentTasks, setCurrentTasks] = useState<any[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (dataStroe.projects) {
      setCurrentProjects(
        dataStroe.projects.filter((p: any) => p.assigned_to === Number(token)),
      );
    }
    if (dataStroe.tasks) {
      setCurrentTasks(
        dataStroe.tasks.filter((p: any) => p.assigneeId === Number(token)),
      );
    }
  }, [dataStroe.projects, dataStroe.tasks, token]);

  const countOfProjects = currentProjects?.length ?? 0;
  const countOfTasks = currentTasks?.length ?? 0;
  const [tabs, setTabs] = useState(() => {
    const storedTabs = localStorage.getItem("tabs");
    return storedTabs ? JSON.parse(storedTabs) : Tabs;
  });
  const { theme, changeTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "home":
        return <HomeIcon />;
      case "projects":
        return <ProjectsIcon />;
      case "tasks":
        return <TasksIcon />;
      case "code":
        return <CodeIcon />;
      case "settings":
        return <SettingsIcon />;
      case "ai":
        return <AIIcon />;
      default:
        return null;
    }
  };

  function toogleActive(name: string) {
    setTabs((prev) =>
      prev?.map((tab) => ({ ...tab, active: tab.name === name })),
    );
    if (window.innerWidth <= 1024) {
      setIsMenuOpen(false);
    }
  }
  useEffect(() => {
    localStorage.setItem("tabs", JSON.stringify(tabs));
  }, [tabs, CurrentUserStore.currentuser]);

  useEffect(() => {
    const storedTabs = localStorage.getItem("tabs");
    if (storedTabs) {
      setTabs(JSON.parse(storedTabs));
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMenuOpen && window.innerWidth <= 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMenuOpen, CurrentUserStore.currentuser]);

  return (
    <>
      {/* Overlay для мобильных */}
      {isMenuOpen && (
        <div className={styles.overlay} onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Бургер-кнопка для мобильных */}
      <button
        className={styles.burgerButton}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <CloseIcon width={24} height={24} />
        ) : (
          <MenuIcon width={24} height={24} />
        )}
      </button>

      <div
        className={`${styles.allheader} ${isMenuOpen ? styles.menuOpen : ""}`}
      >
        <div className={styles.logo_Container}>
          <LogoIcon />
          <h1>Novex</h1>
        </div>

        <div className={styles.Tabs}>
          {tabs?.map((tab) => {
            const tabPath = `/${tab.name.toLowerCase()}`;
            const isActive =
              currentPath === tabPath || currentPath.startsWith(tabPath + "/");

            return (
              <Link key={tab.id} to={tabPath}>
                <div
                  className={isActive ? styles.activeTab : styles.tab}
                  onClick={() => toogleActive(tab.name)}
                >
                  {getIcon(tab.name)}
                  <h2>{tab.name}</h2>
                  {tab.name === "Projects" && countOfProjects > 0 ? (
                    <div className={styles.projectCount}>{countOfProjects}</div>
                  ) : tab.name === "Tasks" && countOfTasks > 0 ? <div className={styles.projectCount}>{countOfTasks}</div> : null}
                </div>
              </Link>
            );
          })}
          <div
            className={styles.tab}
            onClick={() => {
              changeTheme();
              // Закрываем меню при клике на смену темы на мобильных
              if (window.innerWidth <= 1024) {
                setIsMenuOpen(false);
              }
            }}
          >
            {theme}
          </div>
        </div>
      </div>
    </>
  );
});
export default Header;
