import React, { useEffect, useState } from 'react';
import styles from './Header.module.scss';
import { Tabs } from './tabs';
import { Link } from 'react-router-dom';
import { Projects } from '../Projects/Projects.Mockdata';
import {
  LogoIcon,
  HomeIcon,
  ProjectsIcon,
  TasksIcon,
  CodeIcon,
  SettingsIcon,
  AIIcon,
} from '../Icons';
import { useTheme } from '../../context/Theme.tsx';

export default function Header() {
  const countOfProjects = Projects.length;
  const [tabs, setTabs] = useState(Tabs);
  const [active, setActive] = useState();
  const { theme, changeTheme } = useTheme();

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'home':
        return <HomeIcon />;
      case 'projects':
        return <ProjectsIcon />;
      case 'tasks':
        return <TasksIcon />;
      case 'code':
        return <CodeIcon />;
      case 'settings':
        return <SettingsIcon />;
      case 'ai':
        return <AIIcon />;
      default:
        return null;
    }
  };

  function toogleActive(name: string) {
    setTabs((item) => item.map((prev) => ({ ...prev, active: prev.name === name })));
  }
  useEffect(() => {}, []);
  return (
    <div className={styles.allheader}>
      <div className={styles.logo_Container}>
        <LogoIcon />
        <h1>Novex</h1>
      </div>

      <div className={styles.Tabs}>
        {tabs.map((tab) => (
          <Link key={tab.id} to={tab.name === 'Home' ? '/' : `/${tab.name}`}>
            <div
              className={tab.active ? styles.activeTab : styles.tab}
              onClick={() => toogleActive(tab.name)}>
              {getIcon(tab.name)}
              <h2>{tab.name}</h2>
              {tab.name === 'Projects' && countOfProjects > 0 && (
                <div className={styles.projectCount}>{countOfProjects}</div>
              )}
            </div>
          </Link>
        ))}
        <div className={styles.tab} onClick={changeTheme}>
          {theme}
        </div>
      </div>
    </div>
  );
}
