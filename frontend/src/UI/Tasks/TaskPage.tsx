import { useEffect, useState, useMemo, useId } from "react";
import styles from "./TaskPage.module.scss";
import PageHeader from "../../common/PageHeader";
import { SearchIcon } from "../../UI/Icons";
import { useLogin } from "../../context/Modal";
import { useRegistration } from "../../context/RegistrarionModal";
import Registration from "../../common/Registration/Registration";
import Login from "../../common/Login/Login";
import { observer } from "mobx-react-lite";
import dataStroe from "../../Store/Data";
import { CurrentUserStore } from "../../Store/User.store";

const TaskPage = observer(() => {
  const { isOpenRegistration, setIsOpenRegistration } = useRegistration();
  const { isOpenLogin, setIsOpenLogin } = useLogin();
  const [activeFiltertask, setActiveFiltertask] = useState<string>(() => {
    return localStorage.getItem("activeFiltertask") || "All Tasks";
  });
  const [currentTasks, setCurrentTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Due Date");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedTasks, setSortedTasks] = useState(dataStroe.currentTasks);
  const [isUp, setIsUp] = useState(false);
  const token =
    CurrentUserStore.currentuser?.id ?? localStorage.getItem("token");
  dataStroe.setToken(localStorage.getItem("token"));
  const btns = [
    { name: "All Tasks" },
    { name: "Overdue" },
    { name: "Hight priority" },
    { name: "Blocked" },
    { name: "Assigned = Me" },
    { name: "More filters" },
  ];
  useEffect(() => {
    if (dataStroe.tasks) {
      setCurrentTasks(
        dataStroe.tasks.filter((p: any) => p.assigneeId === Number(token)),
      );
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("activeFiltertask", activeFiltertask);
  }, [activeFiltertask]);
  function SortBy() {
    setSortedTasks(
      isUp
        ? dataStroe.currentTasks.sort((a, b) => a.priorityId - b.priorityId)
        : dataStroe.currentTasks.sort((a, b) => b.priorityId - a.priorityId),
    );
  }
  useEffect(() => {
    SortBy();
  }, [isUp]);
  const filteredTasks = useMemo(() => {
    if (activeFiltertask === "All Tasks") {
      return dataStroe.currentTasks;
    }
    if (activeFiltertask === "My Tasks") {
      return dataStroe.currentTasks.filter(
        (task) => task.assigneeId === Number(dataStroe.token),
      );
    }
    return dataStroe.currentTasks.filter(
      (task) => task.status === activeFiltertask.toLowerCase(),
    );
  }, [dataStroe.currentTasks, activeFiltertask, dataStroe.token]);

  return (
    <div className={styles.TaskContainer}>
      <PageHeader />
      {isOpenLogin ? <Login /> : null}
      {isOpenRegistration ? <Registration /> : null}
      <section className={styles.dashboard}>
        <h1>Tasks</h1>

        {/* Фильтры задач - остаются без изменений */}
        <div className={styles.headerTasks}>
          <div className={styles.filterall}>
            {btns?.map((btn) => (
              <button
                key={btn.name}
                className={`${styles.AllTasks} ${activeFiltertask === btn.name ? styles.active : ""}`}
                onClick={() => setActiveFiltertask(btn.name)}
              >
                <p>{btn.name}</p>
                <p className={styles.countTasks}>
                  {btn.name === "All Tasks"
                    ? dataStroe.currentTasks.length
                    : btn.name === "My Tasks"
                      ? dataStroe.currentTasks.filter(
                          (task) => task.assigneeId === Number(dataStroe.token),
                        ).length
                      : btn.name === "Complete"
                        ? dataStroe.currentTasks.filter(
                            (task) => task.status === "completed",
                          ).length
                        : dataStroe.currentTasks.filter(
                            (task) => task.status === btn.name.toLowerCase(),
                          ).length}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Контролы задач - остаются без изменений */}
        <div className={styles.tasksControls}>
          <div className={styles.tasksInfo}>
            <span className={styles.totalTasks}>
              Total: {dataStroe.currentTasks.length}
            </span>
          </div>
          <div className={styles.tasksActions}>
            <div className={styles.searchContainer}>
              <SearchIcon />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className={styles.searchInput}
              />
            </div>
            <button className={styles.createTaskBtn}>Create Task</button>
          </div>
        </div>

        {/* КАНБАН ДОСКА - вместо таблицы */}
        <div className={styles.kanbanBoard}>
          {/* Колонка To Do */}
          <div className={styles.kanbanColumn}>
            <div className={styles.columnHeader}>
              <div className={styles.columnTitle}>
                <span className={`${styles.statusIcon} ${styles.todo}`} />
                <h3>To Do</h3>
              </div>
              <span className={styles.columnCount}>
                {dataStroe.tasks.filter((t) => t.status === "todo").length}
              </span>
            </div>
            <div className={styles.cardsContainer}>
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
          </div>

          {/* Колонка In Progress */}
          <div className={styles.kanbanColumn}>
            <div className={styles.columnHeader}>
              <div className={styles.columnTitle}>
                <span className={`${styles.statusIcon} ${styles.inProgress}`} />
                <h3>In Progress</h3>
              </div>
              <span className={styles.columnCount}>
                {
                  dataStroe.tasks.filter((t) => t.status === "in_progress")
                    .length
                }
              </span>
            </div>
            <div className={styles.cardsContainer}>
              {dataStroe.tasks
                .filter((t) => t.status === "in_progress")
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
          </div>

          {/* Колонка Blocked */}
          <div className={styles.kanbanColumn}>
            <div className={styles.columnHeader}>
              <div className={styles.columnTitle}>
                <span className={`${styles.statusIcon} ${styles.blocked}`} />
                <h3>Blocked</h3>
              </div>
              <span className={styles.columnCount}>
                {dataStroe.tasks.filter((t) => t.status === "blocked").length}
              </span>
            </div>
            <div className={styles.cardsContainer}>
              {dataStroe.tasks
                .filter((t) => t.status === "blocked")
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
          </div>

          {/* Колонка Done */}
          <div className={styles.kanbanColumn}>
            <div className={styles.columnHeader}>
              <div className={styles.columnTitle}>
                <span className={`${styles.statusIcon} ${styles.done}`} />
                <h3>Done</h3>
              </div>
              <span className={styles.columnCount}>
                {dataStroe.tasks.filter((t) => t.status === "done").length}
              </span>
            </div>
            <div className={styles.cardsContainer}>
              {dataStroe.tasks
                .filter((t) => t.status === "done")
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
          </div>
        </div>
      </section>
    </div>
  );
});
export default TaskPage;
