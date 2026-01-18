import React, { useEffect, useState } from 'react';
import styles from './TaskPage.module.scss';
import PageHeader from '../common/PageHeader';
import { ActiveIcon, BlockedIcon, GithubIcon, OverdueIcon } from '../UI/Icons';
import { Tasks } from '../MockData/Tasks.mockData';
export default function TaskPage() {
  const [tasks, setTasks] = useState(Tasks);
  const [activeTasks, setActiveTasks] = useState(() => {
    return localStorage.getItem('tasks');
  });
  const [activeFilter, setActiveFilter] = useState(() => {
    return localStorage.getItem('activeFilter') || 'All Tasks';
  });
  const [filtered, setFiltered] = useState(() => {
    const storedFiltered = localStorage.getItem('filtered');
    return storedFiltered ? JSON.parse(storedFiltered) : Tasks;
  });
  const btns = [
    { name: 'All Tasks' },
    { name: 'My Tasks' },
    { name: 'Overdue' },
    { name: 'Active' },
    { name: 'Blocked' },
    { name: 'Completed' },
  ];
  useEffect(() => {
    localStorage.setItem('activeFilter', activeFilter);
    localStorage.setItem('filtered', JSON.stringify(filtered));
  });

  function Filter(name: string) {
    setActiveFilter(name);
    setActiveTasks(name === 'All Tasks' ? tasks : tasks.filter((p) => p.status === name));
  }
  return (
    <div className={styles.TaskContainer}>
      <PageHeader />
      <section className={styles.dashboard}>
        <h1>Tasks</h1>
        <div className={styles.headerTasks}>
          <div className={styles.filterall}>
            {btns.map((btn) => (
              <button
                className={`${styles.AllTasks} ${activeFilter === btn.name ? styles.active : ''}`}
                onClick={() => Filter(btn.name)}>
                <p>{btn.name}</p>
                <p className={styles.countTasks}>
                  {btn.name === 'All Tasks'
                    ? tasks.length
                    : btn.name === 'My Tasks'
                      ? tasks.filter((task) => task.assigneeId === 0).length
                      : tasks.filter((task) => task.status === btn.name.toLocaleLowerCase()).length}
                </p>
              </button>
            ))}
          </div>
          <div className={styles.addProject}>
            <button className={styles.addbtn}>Add new projetct</button>
          </div>
        </div>
        <div className={styles.heroProjets}>
          <div className={styles.tasksSection}>
            <h1 className={styles.sectionTitle}>Projects Focus</h1>
          </div>
        </div>
      </section>
    </div>
  );
}
