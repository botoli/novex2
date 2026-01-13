import React, { useState } from 'react';
import styles from './Home.module.scss';
import { Tabs } from './Data';
import { Link } from 'react-router-dom';
import type { TaskInterface } from './Home.Interface';
import {
  SearchIcon,
  NotificationIcon,
  AccountIcon,
  StatusIcon,
  TeamIcon,
  AIIcon,
  ExclamationIcon,
} from '../Icons';

export default function Home() {
  const [active, setActive] = useState(false);
  const [mockTasks, setMockTasks] = useState<TaskInterface[]>([
    {
      id: 0,
      name: 'Сделать рефакторинг',
      active: false,
      project: 'E-Commerce Platform',
      risk: 'Medium Risk',
      createdAt: '22 April ',
      dedline: '21 days',
    },
    {
      id: 1,
      name: 'Сделать Форму заполнения',
      active: false,
      project: 'Mobile App',
      risk: 'Low Risk',
      createdAt: '12-02-2025',
      dedline: '21 days',
    },
  ]);
  const [mockAI, setMockAI] = useState([
    {
      id: 0,
      name: 'ChatGPT',
      text: 'Решить проблемы с безопасностью ',
    },
    {
      id: 1,
      name: 'ChatGPT',
      text: 'Разработать документацию',
    },
  ]);
  return (
    <div className={styles.homeContainer}>
      <section className={styles.pageHeader}>
        <div className={styles.searchBar}>
          <SearchIcon />
          <input type="text" placeholder="Search" />
          <button>Search</button>
        </div>

        <div className={styles.avatar}>
          <div>
            <button>
              <NotificationIcon />
            </button>
          </div>
          <div className={styles.account}>
            <div className={styles.accountInfo}>
              <div className={styles.accountAvatar}>
                <AccountIcon />
              </div>
              <div className={styles.accountDetails}>
                <p className={styles.accountName}>Botoli</p>
                <p className={styles.accountRole}>Lead Developer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.dashboard}>
        <h1>Home</h1>

        <div className={styles.metricsGrid}>
          {/* Company Projects Card */}
          <div className={styles.metricCard}>
            <div className={styles.cardHeader}>
              <h1>Company Projects</h1>
            </div>
            <div className={styles.cardContent}>
              {/* {CountOfActiveTasks} */}
              {/* {CountOfPausedTasks} */}
              {/* {CountOfRiskTasks} */}
              <div className={styles.progressBar}></div>
            </div>
          </div>

          {/* Company Teams Card */}
          <div className={styles.metricCard}>
            <div className={styles.cardHeader}>
              <TeamIcon width={16} height={16} />
              <h1>Company Teams</h1>
            </div>
            <div className={styles.cardContent}>{/* {CountOfOnlineUsers} */}</div>
          </div>

          {/* Global Metrics Card */}
          <div className={styles.metricCard}>
            <div className={styles.cardHeader}>
              <h1>Global Metrics</h1>
            </div>
            <div className={styles.cardContent}>
              {/* {CountOfTasks} */}
              {/* {CountOfOverdueTasks} */}
            </div>
          </div>

          {/* CI/CD Health Card */}
          <div className={styles.metricCard}>
            <div className={styles.cardHeader}>
              <h1>CI/CD Health</h1>
            </div>
            <div className={styles.cardContent}></div>
          </div>
        </div>

        {/* Projects Focus Section */}
        <div className={styles.tasksSection}>
          <h1 className={styles.sectionTitle}>Projects Focus</h1>

          <div className={styles.gridProjects}>
            {mockTasks?.map((task) => (
              <div key={task.id} className={styles.taskCard}>
                <div className={styles.taskHeader}>
                  <div className={styles.taskInfo}>
                    <h1>
                      {task.project}
                      <button>
                        <StatusIcon />
                      </button>
                    </h1>
                    <p>risk: {task.risk}</p>
                    <div className={styles.progressContainer}>
                      <p className={styles.progressText}>{/* 60% */}</p>
                      <div className={styles.taskProgressBar}></div>
                    </div>
                  </div>
                </div>

                <div className={styles.taskFooter}>
                  <div className={styles.taskMetrics}>
                    <div className={styles.metricButtons}>
                      <button className={styles.btnActive}>
                        Active:{/* {CountOfActiveTasks} */}
                      </button>
                      <button className={styles.btnPaused}>
                        Blocked:{/* {CountOfBlockedTasks} */}
                      </button>
                      <button className={styles.btnOverdue}>
                        Overdue:{/* {CountOfOverdueTasks} */}
                      </button>
                    </div>
                  </div>

                  <div className={styles.githubInfo}>
                    <span>github:</span>
                    <span className={styles.githubCommits}>commits:{/* {CountOfCommits} */}</span>
                    <span className={styles.githubCommits}>PR:{/* {PR} */}</span>
                    <span className={styles.githubCommits}>CI:{/* {CI} */}</span>
                  </div>

                  <div className={styles.actionButtons}>
                    <button className={styles.btnSecondary}>Open Board</button>
                    <button className={styles.btnSecondary}>Repo</button>
                    <button className={styles.btnSecondary}>Analytics</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.bottomSection}>
          <div className={styles.myactivetaskSection}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.sectionTitle}>My Active Tasks</h1>
              <p className={styles.Overdue}>Overdue: {/* {CountOfOverdueTasks} */}</p>
              <button className={styles.btnSecondary}>View All</button>
            </div>
            <div className={styles.mytaskscard}>
              {mockTasks?.map((task) => (
                <div key={task.id}>
                  <div className={styles.cardstatus}>
                    {task.risk}
                    {/* {task status color} */}
                  </div>
                  <p className={styles.taskName}>{task.name}</p>
                  <p className={styles.taskCreatedAt}>{task.createdAt}</p>
                  <p className={styles.taskDedline}>{task.dedline}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.rightColumn}>
            <div className={styles.mystatsSection}>
              <div className={styles.sectionHeader}>
                <h1 className={styles.sectionTitle}>My Stats</h1>
                <button className={styles.btnSecondary}>Show All</button>
              </div>
              <div className={styles.mystatscard}>
                <div className={styles.taskscomplited}>
                  {/* {CountOfCompletedweekTasks} */} Tasks complited this week
                </div>
                <p className={styles.tasksoverdue}>
                  Tasks overdue this week:{/* {CountOfOverdueTasks} */}
                </p>
              </div>
            </div>
            <div className={styles.AiSection}>
              <div className={styles.sectionHeader}>
                <AIIcon width={24} height={24} />
                <h1 className={styles.sectionTitle}>AI Analysis</h1>
              </div>
              {mockAI.map((card) => (
                <div key={card.id}>
                  <div className={styles.AiCard}>
                    <AIIcon width={20} height={20} />
                    <p className={styles.aiName}>{card.name}</p>
                    <p>{card.text}</p>
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
