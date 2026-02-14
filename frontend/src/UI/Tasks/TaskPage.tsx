import { useEffect, useState, useMemo } from "react";
import styles from "./TaskPage.module.scss";
import PageHeader from "../../common/PageHeader";
import { SearchIcon } from "../../UI/Icons";
import { useLogin } from "../../context/Modal";
import { useRegistration } from "../../context/RegistrarionModal";
import Registration from "../../common/Registration/Registration";
import Login from "../../common/Login/Login";
import { observer } from "mobx-react-lite";
import dataStore from "../../Store/Data";
import { CurrentUserStore } from "../../Store/User.store";

const TaskPage = observer(() => {
  const { isOpenRegistration, setIsOpenRegistration } = useRegistration();
  const { isOpenLogin, setIsOpenLogin } = useLogin();
  const [activeFilterTask, setActiveFilterTask] = useState<string>(() => {
    return localStorage.getItem("activeFilterTask") || "All Tasks";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Получаем token единообразно
  const token =
    CurrentUserStore.currentuser?.id || localStorage.getItem("token");

  // Устанавливаем token в стор
  if (token) {
    dataStore.setToken(token);
  }

  const btns = [
    { name: "All Tasks" },
    { name: "Overdue" },
    { name: "High Priority" },
    { name: "Blocked" },
    { name: "Assigned to Me" },
    { name: "More filters" },
  ];

  useEffect(() => {
    localStorage.setItem("activeFilterTask", activeFilterTask);
  }, [activeFilterTask]);

  // Функция для проверки просроченности задачи
  const isTaskOverdue = (task) => {
    if (task.status === "done" || task.status === "completed") return false;
    const today = new Date().toISOString().split("T")[0];
    return task.deadline && task.deadline < today;
  };

  // Функция для проверки соответствия приоритета
  const getPriorityLevel = (priorityId) => {
    switch (priorityId) {
      case 1:
        return "low";
      case 2:
        return "medium";
      case 3:
        return "high";
      default:
        return "low";
    }
  };

  // Основная фильтрация задач
  const filteredTasks = useMemo(() => {
    let tasks = dataStore.currentTasks || [];

    // 1. Сначала применяем фильтр по активной кнопке
    switch (activeFilterTask) {
      case "All Tasks":
        // Ничего не фильтруем
        break;

      case "Overdue":
        tasks = tasks.filter((task) => isTaskOverdue(task));
        break;

      case "High Priority":
        tasks = tasks.filter(
          (task) => task.priorityId === 3 || task.priorityId === 2,
        );
        break;

      case "Blocked":
        tasks = tasks.filter((task) => task.status === "blocked");
        break;

      case "Assigned to Me":
        tasks = tasks.filter(
          (task) =>
            task.assigned_to && task.assigned_to.includes(Number(token)),
        );
        break;

      case "More filters":
        // Можно добавить логику для дополнительных фильтров
        break;

      default:
        break;
    }

    // 2. Применяем поиск по названию, если есть запрос
    if (searchQuery.trim()) {
      tasks = tasks.filter((task) =>
        task.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return tasks;
  }, [dataStore.currentTasks, activeFilterTask, searchQuery, token]);

  // Подсчет количества задач для каждой кнопки
  const getTaskCount = (btnName) => {
    const tasks = dataStore.currentTasks || [];

    switch (btnName) {
      case "All Tasks":
        return tasks.length;

      case "Overdue":
        return tasks.filter((task) => isTaskOverdue(task)).length;

      case "High Priority":
        return tasks.filter(
          (task) => task.priorityId === 3 || task.priorityId === 2,
        ).length;

      case "Blocked":
        return tasks.filter((task) => task.status === "blocked").length;

      case "Assigned to Me":
        return tasks.filter(
          (task) =>
            task.assigned_to && task.assigned_to.includes(Number(token)),
        ).length;

      case "More filters":
        return "...";

      default:
        return 0;
    }
  };

  // Получение задач для конкретной колонки
  const getTasksByStatus = (status) => {
    return filteredTasks.filter((task) => task.status === status);
  };

  // Получение имени исполнителя
  const getAssigneeName = (task) => {
    if (!task.assigned_to || task.assigned_to.length === 0) return "Unassigned";
    const assigneeId = task.assigned_to[0];
    const user = dataStore.users?.find((u) => u.id === assigneeId);
    return user?.name || "Unassigned";
  };

  // Получение первой буквы имени исполнителя для аватара
  const getAssigneeInitial = (task) => {
    if (!task.assigned_to || task.assigned_to.length === 0) return "?";
    const assigneeId = task.assigned_to[0];
    const user = dataStore.users?.find((u) => u.id === assigneeId);
    return user?.name?.[0] || "?";
  };

  // Получение названия проекта
  const getProjectTitle = (task) => {
    const project = dataStore.projects?.find((p) => p.id === task.projectId);
    return project?.title || "No project";
  };

  // Получение класса приоритета
  const getPriorityClass = (priorityId) => {
    switch (priorityId) {
      case 1:
        return styles.priorityLow;
      case 2:
        return styles.priorityNormal;
      case 3:
        return styles.priorityHigh;
      default:
        return styles.priorityLow;
    }
  };

  // Получение иконки приоритета
  const getPriorityIcon = (priorityId) => {
    switch (priorityId) {
      case 1:
        return "Low";
      case 2:
        return "Medium";
      case 3:
        return "High";
      default:
        return "↓";
    }
  };

  // Получение заголовка приоритета
  const getPriorityTitle = (priorityId) => {
    switch (priorityId) {
      case 1:
        return "Low";
      case 2:
        return "Normal";
      case 3:
        return "High";
      default:
        return "Low";
    }
  };

  return (
    <div className={styles.TaskContainer}>
      <PageHeader />
      {isOpenLogin ? <Login /> : null}
      {isOpenRegistration ? <Registration /> : null}
      <section className={styles.dashboard}>
        <h1>Tasks</h1>

        <div className={styles.headerTasks}>
          <div className={styles.filterall}>
            {btns.map((btn) => (
              <button
                key={btn.name}
                className={`${styles.AllTasks} ${activeFilterTask === btn.name ? styles.active : ""}`}
                onClick={() => setActiveFilterTask(btn.name)}
              >
                <p>{btn.name}</p>
                <p className={styles.countTasks}>{getTaskCount(btn.name)}</p>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.tasksControls}>
          <div className={styles.tasksInfo}>
            <span className={styles.totalTasks}>
              Total: {filteredTasks.length}
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

        {/* Канбан доска */}
        <div className={styles.kanbanBoard}>
          {/* Колонка To Do */}
          <div className={styles.kanbanColumn}>
            <div className={styles.columnHeader}>
              <div className={styles.columnTitle}>
                <span className={`${styles.statusIcon} ${styles.todo}`} />
                <h3>To Do</h3>
              </div>
              <span className={styles.columnCount}>
                {getTasksByStatus("todo").length}
              </span>
            </div>
            <div className={styles.cardsContainer}>
              {getTasksByStatus("todo").map((task) => (
                <div key={task.id} className={styles.taskCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.taskId}>TASK-{task.id}</span>
                    <span
                      className={`${styles.priorityIcon} ${getPriorityClass(task.priorityId)}`}
                      title={getPriorityTitle(task.priorityId)}
                    >
                      {getPriorityIcon(task.priorityId)}
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
                        {getAssigneeInitial(task)}
                      </div>
                      <span>{getAssigneeName(task)}</span>
                    </div>
                    <span className={styles.projectBadge}>
                      {getProjectTitle(task)}
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
                      {task.deadline || "No deadline"}
                    </span>
                    <span className={styles.createdDate}>
                      Created:{" "}
                      {task.createdAt
                        ? new Date(task.createdAt).toLocaleDateString()
                        : "Unknown"}
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
                {getTasksByStatus("in_progress").length}
              </span>
            </div>
            <div className={styles.cardsContainer}>
              {getTasksByStatus("in_progress").map((task) => (
                <div key={task.id} className={styles.taskCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.taskId}>TASK-{task.id}</span>
                    <span
                      className={`${styles.priorityIcon} ${getPriorityClass(task.priorityId)}`}
                      title={getPriorityTitle(task.priorityId)}
                    >
                      {getPriorityIcon(task.priorityId)}
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
                        {getAssigneeInitial(task)}
                      </div>
                      <span>{getAssigneeName(task)}</span>
                    </div>
                    <span className={styles.projectBadge}>
                      {getProjectTitle(task)}
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
                      {task.deadline || "No deadline"}
                    </span>
                    <span className={styles.createdDate}>
                      Created:{" "}
                      {task.createdAt
                        ? new Date(task.createdAt).toLocaleDateString()
                        : "Unknown"}
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
                {getTasksByStatus("blocked").length}
              </span>
            </div>
            <div className={styles.cardsContainer}>
              {getTasksByStatus("blocked").map((task) => (
                <div key={task.id} className={styles.taskCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.taskId}>TASK-{task.id}</span>
                    <span
                      className={`${styles.priorityIcon} ${getPriorityClass(task.priorityId)}`}
                      title={getPriorityTitle(task.priorityId)}
                    >
                      {getPriorityIcon(task.priorityId)}
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
                        {getAssigneeInitial(task)}
                      </div>
                      <span>{getAssigneeName(task)}</span>
                    </div>
                    <span className={styles.projectBadge}>
                      {getProjectTitle(task)}
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
                      {task.deadline || "No deadline"}
                    </span>
                    <span className={styles.createdDate}>
                      Created:{" "}
                      {task.createdAt
                        ? new Date(task.createdAt).toLocaleDateString()
                        : "Unknown"}
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
                {getTasksByStatus("done").length}
              </span>
            </div>
            <div className={styles.cardsContainer}>
              {getTasksByStatus("done").map((task) => (
                <div key={task.id} className={styles.taskCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.taskId}>TASK-{task.id}</span>
                    <span
                      className={`${styles.priorityIcon} ${getPriorityClass(task.priorityId)}`}
                      title={getPriorityTitle(task.priorityId)}
                    >
                      {getPriorityIcon(task.priorityId)}
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
                        {getAssigneeInitial(task)}
                      </div>
                      <span>{getAssigneeName(task)}</span>
                    </div>
                    <span className={styles.projectBadge}>
                      {getProjectTitle(task)}
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
                      {task.deadline || "No deadline"}
                    </span>
                    <span className={styles.createdDate}>
                      Created:{" "}
                      {task.createdAt
                        ? new Date(task.createdAt).toLocaleDateString()
                        : "Unknown"}
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
