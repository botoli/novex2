import { useEffect, useState } from "react";
import styles from "./Home.module.scss";

import {
  AccountIcon,
  TeamIcon,
  AIIcon,
  GithubIcon,
  ProjectsIcon,
  MetricsIcon,
  CICDHealthIcon,
  ActiveIcon,
  OverdueIcon,
  BlockedIcon,
  ArrowRightIcon,
  WarningIcon,
  PauseIconRounded,
  ArrowUpIcon,
  ArrowDownIcon,
} from "../Icons";

import AccountSettings from "../AccountSettings/AccountSettings";
import { nowurl, useData } from "../../fetch/fetchTasks";
import PageHeader from "../../common/PageHeader";
import Login from "../../common/Login/Login";
import { useLogin } from "../../context/Modal";
import Registration from "../../common/Registration/Registration";
import { useRegistration } from "../../context/RegistrarionModal";
import { useUser } from "../../context/UserContext";
import { Link } from "react-router";

export default function HomePage() {
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

  const {
    data: projects,
    setData: setProjects,
    loading: loadingProjects,
  } = useData(nowurl + "/projects");
  const { data: tasks, setData: setTasks } = useData(nowurl + "/tasks");
  const { data: projecs, setData: setProjecs } = useData(nowurl + "/projects");
  const { currentuser, setCurrentuser } = useUser();
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

  const token = localStorage.getItem("token");
  useEffect(() => {
    setCurrentTasks(tasks.filter((t) => t.assigneeId === Number(token)));
  }, [tasks, token]);
  useEffect(() => {
    if (projecs.filter((p) => p.assigned_to === Number(token))) {
      setCurrentprojects(
        projects.filter((p) => p.assigned_to === Number(token)),
      );
    } else {
      setCurrentprojects([]);
    }
  }, [projects, currentuser]);

  const progress = (id: number) => {
    return (
      Math.floor(
        (tasks.filter(
          (task) => task.projectId === id && task.status === "completed",
        ).length /
          tasks.filter((task) => task.projectId === id).length) *
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
        {isOpenAccountSettings && (
          <AccountSettings
            onclose={() => setIsOpenAccountSettings(!isOpenAccountSettings)}
          />
        )}
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
            {loadingProjects ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Загрузка проектов...</p>
              </div>
            ) : currentProjects.length === 0 ? (
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
                            tasks.filter(
                              (task) =>
                                task.projectId === project.id &&
                                task.status === "completed",
                            ).length,
                          )}
                          /
                          {Math.floor(
                            tasks.filter(
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
          <div className={styles.myactivetaskSection}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.sectionTitle}>My Active Tasks</h1>
              <div className={styles.sort}>
                <button
                  className={styles.btnSecondary}
                  onClick={() => {
                    setSortBy("Risk");
                    setIsSortRisk(!isSortRisk);
                  }}
                >
                  <p>Risk</p>
                  {isSortRisk ? <ArrowDownIcon /> : <ArrowUpIcon />}
                </button>
                <button
                  className={styles.btnSecondary}
                  onClick={() => {
                    setSortBy("Dedline");
                    setIsSortDedline(!isSortDedline);
                  }}
                >
                  <p>Dedline</p>
                  {isSortDedline ? <ArrowDownIcon /> : <ArrowUpIcon />}
                </button>
              </div>

              {/* <p className={styles.Overdue}>Overdue: {SetStatistikOverdue(1)}</p> */}
              <Link to="/tasks">
                <button className={styles.btnSecondary}>View All</button>
              </Link>
            </div>
            <div className={styles.mytaskscard}>
              {sort?.map((task) => (
                <div key={task.id}>
                  <div
                    className={
                      task.priority === "low"
                        ? styles.Lowcardstatus
                        : task.priority === "medium"
                          ? styles.Mediumcardstatus
                          : task.priority === "high"
                            ? styles.Hightcardstatus
                            : styles.Hightcardstatus
                    }
                  >
                    {task.priority}
                  </div>
                  <div className={styles.taskInfo}>
                    <p className={styles.taskName}>{task.name}</p>
                    <div className={styles.datesContainer}>
                      <p className={styles.taskCreatedAt}>{task.createdAt}</p>
                      <p className={styles.taskDedline}>{task.deadline}</p>
                    </div>
                  </div>
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
}
