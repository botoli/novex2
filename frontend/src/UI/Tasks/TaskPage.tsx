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
  const [currentTasks, setCurrentTasks] = useState([])
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Due Date");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedTasks, setSortedTasks] = useState(dataStroe.currentTasks);
  const [isUp, setIsUp] = useState(false);
  const token =
    CurrentUserStore.currentuser?.id ?? localStorage.getItem("token");
  dataStroe.setToken(localStorage.getItem("token"))
  const btns = [
    { name: "All Tasks" },
    { name: "Overdue" },
    { name: "Hight priority" },
    { name: "Blocked" },
    { name: "Assigned = Me" },
    { name: "More filters" }
  ];
  useEffect(() => {

    if (dataStroe.tasks) {
      setCurrentTasks(
        dataStroe.tasks.filter((p: any) => p.assigneeId === Number(token)),
      );
    }
  }, [])
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
      return dataStroe.currentTasks.filter((task) => task.assigneeId === Number(dataStroe.token));
    }
    return dataStroe.currentTasks.filter(
      (task) => task.status === activeFiltertask.toLowerCase(),
    );
  }, [dataStroe.currentTasks, activeFiltertask, dataStroe.token]);
  const getProjectName = (projectId: number) => {
    const project = dataStroe.projects.find((p) => p.id === projectId);
    return project ? project.title : "Unknown";
  };

  const getAssigneeName = (assigneeId: number) => {
    const user = dataStroe.users.find((u) => u.id === assigneeId);
    return user ? user.name : null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return styles.statusActive;
      case "blocked":
        return styles.statusBlocked;
      case "completed":
        return styles.statusComplete;
      case "overdue":
        return styles.statusOverdue;
      default:
        return "";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return styles.priorityHigh;
      case "medium":
        return styles.priorityMedium;
      case "low":
        return styles.priorityLow;
      default:
        return "";
    }
  };
  function setTasksfilter(name) { }
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
                        ? dataStroe.currentTasks.filter((task) => task.status === "completed")
                          .length
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
            <span className={styles.totalTasks}>Total: {dataStroe.currentTasks.length}</span>
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
                {dataStroe.tasks.filter(t => t.status === "todo").length}
              </span>
            </div>
            <div className={styles.cardsContainer}>
              {dataStroe.tasks.filter(t => t.status === 'todo').map(task =>
                <div key={task.id} className={styles.taskCard}>
                  <div className={styles.taskHeader}>
                    <span className={styles.taskId}>#123</span>
                    <button className={styles.taskMenu}>⋯</button>
                  </div>
                  <h4 className={styles.taskTitle}>{task.name}</h4>
                  <p className={styles.taskDescription}>Описание задачи</p>
                  <div className={styles.taskMeta}>
                    <span className={`${styles.priorityBadge} ${styles.priorityHigh}`}>
                      High
                    </span>
                    <span className={`${styles.statusBadge} ${styles.statusTodo}`}>
                      To Do
                    </span>
                  </div>
                  <div className={styles.taskFooter}>
                    <div className={styles.assigneeInfo}>
                      <div className={styles.assigneeAvatar}>A</div>
                      <span>Assignee Name</span>
                    </div>
                    <span className={styles.dueDate}>2024-01-20</span>
                  </div>
                  <div className={styles.projectName}>Project Name</div>
                </div>)

              }

            </div>
          </div>

          {/* Колонка In Progress */}
          <div className={styles.kanbanColumn}>
            <div className={styles.columnHeader}>
              <div className={styles.columnTitle}>
                <span className={`${styles.statusIcon} ${styles.inProgress}`} />
                <h3>In Progress</h3>
              </div>
              <span className={styles.columnCount}>0</span>
            </div>
            <div className={styles.cardsContainer}>
              {dataStroe.tasks.filter(t => t.status === 'in_progress').map(task =>
                <div key={task.id} className={styles.taskCard}>
                  <div className={styles.taskHeader}>
                    <span className={styles.taskId}>#123</span>
                    <button className={styles.taskMenu}>⋯</button>
                  </div>
                  <h4 className={styles.taskTitle}>{task.name}</h4>
                  <p className={styles.taskDescription}>Описание задачи</p>
                  <div className={styles.taskMeta}>
                    <span className={`${styles.priorityBadge} ${styles.priorityHigh}`}>
                      High
                    </span>
                    <span className={`${styles.statusBadge} ${styles.statusTodo}`}>
                      To Do
                    </span>
                  </div>
                  <div className={styles.taskFooter}>
                    <div className={styles.assigneeInfo}>
                      <div className={styles.assigneeAvatar}>A</div>
                      <span>Assignee Name</span>
                    </div>
                    <span className={styles.dueDate}>2024-01-20</span>
                  </div>
                  <div className={styles.projectName}>Project Name</div>
                </div>)

              }
            </div>
          </div>



          {/* Колонка Blocked */}
          <div className={styles.kanbanColumn}>
            <div className={styles.columnHeader}>
              <div className={styles.columnTitle}>
                <span className={`${styles.statusIcon} ${styles.blocked}`} />
                <h3>Blocked</h3>
              </div>
              <span className={styles.columnCount}>0</span>
            </div>
            <div className={styles.cardsContainer}>
              {dataStroe.tasks.filter(t => t.status === 'blocked').map(task =>
                <div key={task.id} className={styles.taskCard}>
                  <div className={styles.taskHeader}>
                    <span className={styles.taskId}>#123</span>
                    <button className={styles.taskMenu}>⋯</button>
                  </div>
                  <h4 className={styles.taskTitle}>{task.name}</h4>
                  <p className={styles.taskDescription}>Описание задачи</p>
                  <div className={styles.taskMeta}>
                    <span className={`${styles.priorityBadge} ${styles.priorityHigh}`}>
                      High
                    </span>
                    <span className={`${styles.statusBadge} ${styles.statusTodo}`}>
                      To Do
                    </span>
                  </div>
                  <div className={styles.taskFooter}>
                    <div className={styles.assigneeInfo}>
                      <div className={styles.assigneeAvatar}>A</div>
                      <span>Assignee Name</span>
                    </div>
                    <span className={styles.dueDate}>2024-01-20</span>
                  </div>
                  <div className={styles.projectName}>Project Name</div>
                </div>)

              }
            </div>
          </div>

          {/* Колонка Done */}
          <div className={styles.kanbanColumn}>
            <div className={styles.columnHeader}>
              <div className={styles.columnTitle}>
                <span className={`${styles.statusIcon} ${styles.done}`} />
                <h3>Done</h3>
              </div>
              <span className={styles.columnCount}>0</span>
            </div>
            <div className={styles.cardsContainer}>
              {dataStroe.tasks.filter(t => t.status === 'done').map(task =>
                <div key={task.id} className={styles.taskCard}>
                  <div className={styles.taskHeader}>
                    <span className={styles.taskId}>#123</span>
                    <button className={styles.taskMenu}>⋯</button>
                  </div>
                  <h4 className={styles.taskTitle}>{task.name}</h4>
                  <p className={styles.taskDescription}>Описание задачи</p>
                  <div className={styles.taskMeta}>
                    <span className={`${styles.priorityBadge} ${styles.priorityHigh}`}>
                      High
                    </span>
                    <span className={`${styles.statusBadge} ${styles.statusTodo}`}>
                      To Do
                    </span>
                  </div>
                  <div className={styles.taskFooter}>
                    <div className={styles.assigneeInfo}>
                      <div className={styles.assigneeAvatar}>A</div>
                      <span>Assignee Name</span>
                    </div>
                    <span className={styles.dueDate}>2024-01-20</span>
                  </div>
                  <div className={styles.projectName}>Project Name</div>
                </div>)

              }
            </div>
          </div>


        </div>
      </section >
    </div >
  );
})
export default TaskPage;