import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import styles from "./Home.module.scss";

import {
  AIIcon,
  GithubIcon,
  ActiveIcon,
  OverdueIcon,
  BlockedIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "../Icons";

import AccountSettings from "../AccountSettings/AccountSettings";
import PageHeader from "../../common/PageHeader";
import Login from "../../common/Login/Login";
import { useLogin } from "../../context/Modal";
import Registration from "../../common/Registration/Registration";
import { useRegistration } from "../../context/RegistrarionModal";
import { data, Link } from "react-router";
import { CurrentUserStore } from "../../Store/User.store";
import dataStroe from "../../Store/Data";

const HomePage = observer(() => {
  const mockAI = [
    {
      id: 1,
      name: "ChatGPT",
      text: "сделать рефакторинг",
    },
    {
      id: 2,
      name: "Deepseek",
      text: "Удалить ненужные файлы",
    },
    {
      id: 3,
      name: "ChatGPT",
      text: "сделать код чистым",
    },
  ];

  const { isOpenRegistration, setIsOpenRegistration } = useRegistration();
  const { isOpenLogin, setIsOpenLogin } = useLogin();

  const [currentProjects, setCurrentprojects] = useState([]);
  const [sortBy, setSortBy] = useState("Dedline");
  const [sort, setSort] = useState([]);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [isOpenAccountSettings, setIsOpenAccountSettings] = useState(false);
  const [isSortRisk, setIsSortRisk] = useState(true);
  const [isSortDedline, setIsSortDedline] = useState(true);
  const [currentTasks, setCurrentTasks] = useState([]);

  const token =
    CurrentUserStore.currentuser?.id ?? localStorage.getItem("token");

  useEffect(() => {
    token
      ? setCurrentTasks(
          dataStroe.tasks.filter((t) => t.assigneeId === Number(token)),
        )
      : setCurrentTasks([]);
  }, [dataStroe.tasks, CurrentUserStore.currentuser, token]);

  useEffect(() => {
    token
      ? setCurrentprojects(
          dataStroe.projects.filter((p) => p.assigned_to === Number(token)),
        )
      : setCurrentprojects([]);
  }, [CurrentUserStore.currentuser, dataStroe.projects, token]);

  const progress = (id: number) => {
    return (
      Math.floor(
        (dataStroe.tasks.filter(
          (task) => task.projectId === id && task.status === "completed",
        ).length /
          dataStroe.tasks.filter((task) => task.projectId === id).length) *
          100,
      ) || 0
    );
  };

  function sorty() {
    const copyMockTasks = [...currentTasks];
    if (sortBy === "Dedline") {
      const SortByDedline = copyMockTasks.sort((a, b) => {
        const deadlineA =
          a.deadline instanceof Date
            ? a.deadline.getTime()
            : parseInt(a.deadline);
        const deadlineB =
          b.deadline instanceof Date
            ? b.deadline.getTime()
            : parseInt(b.deadline);
        return isSortDedline ? deadlineA - deadlineB : deadlineB - deadlineA;
      });
      setSort(SortByDedline);
    }

    if (sortBy === "Risk") {
      const sortByRisk = copyMockTasks.sort((a, b) => {
        const RiskA =
          a.priority === "low" ? 1 : a.priority === "medium" ? 2 : 3;
        const RiskB =
          b.priority === "low" ? 1 : b.priority === "medium" ? 2 : 3;
        return isSortRisk ? RiskA - RiskB : RiskB - RiskA;
      });
      setSort(sortByRisk);
    }
  }
  useEffect(() => {
    sorty();
  }, [currentTasks, sortBy, isSortDedline, isSortRisk]);

  function SetStatistikActive(id: number) {
    return Math.floor(
      currentTasks.filter(
        (task) => task.projectId === id && task.status === "active",
      ).length,
    );
  }

  function SetStatistikBlocked(id: number) {
    return Math.floor(
      currentTasks.filter(
        (task) => task.projectId === id && task.status === "blocked",
      ).length,
    );
  }
  function SetStatistikOverdue(id: number) {
    return Math.floor(
      currentTasks.filter(
        (task) => task.projectId === id && task.status === "overdue",
      ).length,
    );
  }

  return (
    <div className={styles.homeContainer}>
      <div className={styles.AccountSettingsModal}>
        {isOpenAccountSettings && <AccountSettings />}
      </div>
      <PageHeader />

      {isOpenLogin ? <Login /> : null}
      {isOpenRegistration ? <Registration /> : null}
      <section className={styles.dashboard}>
        <h1>Home</h1>

        {/* Projects Focus Section */}
        <div className={styles.tasksSection}>
          <h1 className={styles.sectionTitle}>Projects Focus</h1>
          <div className={styles.gridProjects}>
            {dataStroe.isLoading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Загрузка проектов...</p>
              </div>
            ) : currentProjects.length === 0 && !dataStroe.error ? (
              <div className={styles.noProjects}>
                <div className={styles.noProjectsdiv}>
                  <h1 className={styles.noProjectsTitle}>У вас нет проектов</h1>
                  <p className={styles.noProjectsSubtitle}>
                    Создайте свой первый проект, чтобы начать работу
                  </p>
                </div>
                <button className={styles.addButton}>
                  <span>+</span>
                  <p>Создать проект</p>
                </button>
              </div>
            ) : dataStroe.error !== null ? (
              <div className={styles.errorCont}>
                <div className={styles.errorDiv}>
                  <h1 className={styles.ErrorTitle}>
                    Ошибка: {dataStroe.error.code}
                  </h1>
                  <h1 className={styles.ErrorTitle}>
                    {dataStroe.error.message}
                  </h1>
                </div>
              </div>
            ) : (
              currentProjects.map((project) => (
                <div key={project.id} className={styles.taskCard}>
                  <div className={styles.taskHeader}>
                    <div className={styles.taskInfo}>
                      <h1>
                        {project.title}
                        <button>
                          <ArrowRightIcon />
                        </button>
                      </h1>
                      <div className={styles.progressContainer}>
                        <p className={styles.progressText}>
                          {progress(project.id)}%
                        </p>
                        <div className={styles.progressDiv}>
                          <div
                            className={styles.progressBar}
                            style={{ width: progress(project.id) + "%" }}
                          ></div>
                        </div>
                        <p>
                          {Math.floor(
                            dataStroe.tasks.filter(
                              (task) =>
                                task.projectId === project.id &&
                                task.status === "completed",
                            ).length,
                          )}
                          /
                          {Math.floor(
                            dataStroe.tasks.filter(
                              (task) => task.projectId === project.id,
                            ).length,
                          )}
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
                          <span className={styles.value}>
                            {SetStatistikActive(project.id)}
                          </span>
                        </button>

                        <button className={`${styles.btnBlocked}`}>
                          <BlockedIcon />
                          <span className={styles.label}>Blocked:</span>

                          <span className={styles.value}>
                            {SetStatistikBlocked(project.id)}
                          </span>
                        </button>

                        <button className={`${styles.btnOverdue}`}>
                          <OverdueIcon />
                          <span className={styles.label}>Overdue:</span>
                          <span className={styles.value}>
                            {SetStatistikOverdue(project.id)}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className={styles.githubInfo}>
                      <GithubIcon />
                      <span>github:</span>
                      <span className={styles.githubCommits}>
                        commits:{/* {CountOfCommits} */} 10
                      </span>
                      <span className={styles.githubCommits}>
                        PR:{/* {PR} */}7
                      </span>
                      <span className={styles.githubCommits}>
                        CI:{/* {CI} */}2{" "}
                      </span>
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
              ))
            )}
          </div>
        </div>
        {/* Active Tasks */}
        <div className={styles.bottomSection}>
          <div className={styles.cardsContainer}>
            <h1 className={styles.sectionTitle}>Active Tasks</h1>
            {dataStroe.tasks
              .filter((t) => t.status === "todo")
              .map((task) => (
                <div key={task.id} className={styles.taskCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.taskId}>TASK-{task.id}</span>
                    <span
                      className={`${styles.priorityIcon} ${task.priorityId === 1 ? styles.priorityLow : task.priorityId === 2 ? styles.priorityNormal : styles.priorityHigh}`}
                      title={
                        task.priorityId === 1
                          ? "Low"
                          : task.priorityId === 2
                            ? "Normal"
                            : "High"
                      }
                    >
                      {task.priorityId === 3
                        ? "↑↑"
                        : task.priorityId === 2
                          ? "↑"
                          : "↓"}
                    </span>
                  </div>
                  <h4 className={styles.taskTitle}>{task.name}</h4>
                  {task.tags && task.tags.length > 0 && (
                    <div className={styles.tagsRow}>
                      {task.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                      {task.tags.length > 3 && (
                        <span className={styles.tagMore}>
                          +{task.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  <div className={styles.cardFooter}>
                    <div className={styles.assigneeInfo}>
                      <div className={styles.assigneeAvatar}>
                        {dataStroe.users.find((u) => u.id === task.assigneeId)
                          ?.name[0] || "?"}
                      </div>
                      <span>
                        {dataStroe.users.find((u) => u.id === task.assigneeId)
                          ?.name || "Unassigned"}
                      </span>
                    </div>
                    <span className={styles.projectBadge}>
                      {dataStroe.projects.find((p) => p.id === task.projectId)
                        ?.title || "No project"}
                    </span>
                  </div>
                  <div className={styles.cardMeta}>
                    <span className={styles.dueDate}>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {task.deadline}
                    </span>
                    <span className={styles.createdDate}>
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
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
              {mockAI?.map((card) => (
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
});
export default HomePage;
