import { useEffect, useState } from 'react';
import { ActiveIcon, ArrowRightIcon, BlockedIcon, GithubIcon, OverdueIcon } from '../Icons';
import styles from './Projects.module.scss';
import { Link } from 'react-router-dom';
import PageHeader from '../../common/PageHeader';
import { useData } from '../../fetch/fetchTasks';
export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState(() => {
    return localStorage.getItem('activeFilter') || 'All Projects';
  });
  const { data: projects, setData: setProjects } = useData('http://localhost:3001/projects');
  const { data: tasks, setData: setTasks } = useData('http://localhost:3001/tasks');
  const [filtered, setFiltered] = useState(() => {
    const storedFiltered = localStorage.getItem('filtered');
    return storedFiltered ? JSON.parse(storedFiltered) : projects;
  });
  const btns = [
    { name: 'All Projects' },
    { name: 'Active' },
    { name: 'Paused' },
    { name: 'At Risk' },
    { name: 'Completed' },
  ];
  useEffect(() => {
    localStorage.setItem('activeFilter', activeFilter);
    localStorage.setItem('filtered', JSON.stringify(filtered));
  });

  const progress = (id: number) => {
    return Math.floor(
      (tasks.filter((task) => task.projectId === id && task.status === 'completed').length /
        tasks.filter((task) => task.projectId === id).length) *
        100,
    );
  };

  function SetStatistikActive(id: number) {
    return Math.floor(
      tasks.filter((task) => task.projectId === id && task.status === 'active').length,
    );
  }

  function SetStatistikBlocked(id: number) {
    return Math.floor(
      tasks.filter((task) => task.projectId === id && task.status === 'blocked').length,
    );
  }

  function SetStatistikOverdue(id: number) {
    return Math.floor(
      tasks.filter((task) => task.projectId === id && task.status === 'overdue').length,
    );
  }

  function Filter(name: string) {
    setActiveFilter(name);
    setFiltered(name === 'All Projects' ? projects : projects.filter((p) => p.status === name));
  }

  return (
    <div className={styles.ProjectContainer}>
      <PageHeader />
      <section className={styles.dashboard}>
        <h1>Projects</h1>
        <div className={styles.headerProjects}>
          <div className={styles.filterall}>
            {btns.map((btn) => (
              <button
                className={`${styles.Allprojetcs} ${
                  activeFilter === btn.name ? styles.active : ''
                }`}
                onClick={() => Filter(btn.name)}>
                <p>{btn.name}</p>
                <p className={styles.countProjects}>
                  {btn.name === 'All Projects'
                    ? projects.length
                    : projects.filter((p) => p.status === btn.name).length}
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
            <div className={styles.gridProjects}>
              {filtered?.map((project) => (
                <div key={project.id} className={styles.taskCard}>
                  <div className={styles.taskHeader}>
                    <div className={styles.taskInfo}>
                      <h1>
                        {project.title}
                        <Link to={`/Projects/${project.title}`}>
                          <button name={project.title}>
                            <ArrowRightIcon />
                          </button>
                        </Link>
                      </h1>
                      <div className={styles.progressContainer}>
                        <p className={styles.progressText}>{progress(project.id)}%</p>
                        <div className={styles.progressDiv}>
                          <div
                            className={styles.progressBar}
                            style={{ width: progress(project.id) + '%' }}></div>
                        </div>
                        <p>
                          {Math.floor(
                            tasks.filter(
                              (task) =>
                                task.projectId === project.id && task.status === 'completed',
                            ).length,
                          )}
                          /
                          {Math.floor(tasks.filter((task) => task.projectId === project.id).length)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.taskFooter}>
                    <div className={styles.taskMetrics}>
                      <div className={styles.metricButtons}>
                        <button className={`${styles.btnActive}`}>
                          <ActiveIcon />
                          <span className={styles.label}>Active:</span>
                          <span className={styles.value}>{SetStatistikActive(project.id)}</span>
                        </button>

                        <button className={`${styles.btnBlocked}`}>
                          <BlockedIcon />
                          <span className={styles.label}>Blocked:</span>

                          <span className={styles.value}>{SetStatistikBlocked(project.id)}</span>
                        </button>

                        <button className={`${styles.btnOverdue}`}>
                          <OverdueIcon />
                          <span className={styles.label}>Overdue:</span>
                          <span className={styles.value}>{SetStatistikOverdue(project.id)}</span>
                        </button>
                      </div>
                    </div>

                    <div className={styles.githubInfo}>
                      <GithubIcon />
                      <span>github:</span>
                      <span className={styles.githubCommits}>
                        commits:{/* {CountOfCommits} */} 10
                      </span>
                      <span className={styles.githubCommits}>PR:{/* {PR} */}7</span>
                      <span className={styles.githubCommits}>CI:{/* {CI} */}2 </span>
                    </div>

                    <div className={styles.actionButtons}>
                      <button className={styles.btnBoard}>
                        <p>Board</p>
                      </button>
                      <button className={styles.btnGithub}>
                        <p>Repo</p>
                      </button>
                      <button className={styles.btnAnalytics}>
                        <p>Analytics</p>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
