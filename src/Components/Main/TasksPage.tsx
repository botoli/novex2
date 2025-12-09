import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/user.js";
import { ProjectService } from "../../assets/MockData/index.js";
import styles from "../../style/Main/SimplePage.module.scss";

type StatusTone = "info" | "warning" | "success";

type TaskCard = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  due?: string;
  project?: string;
  tone: StatusTone;
};

const STATUS_FILTERS: { id: TaskCard["status"] | "all"; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "in-progress", label: "В работе" },
  { id: "todo", label: "К выполнению" },
  { id: "done", label: "Готово" },
];

const TasksPage: React.FC = () => {
  const user = useSelector(selectUser);
  const [tasks, setTasks] = useState<TaskCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    TaskCard["status"] | "all"
  >("all");

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      setError("");
      try {
        // Берём проекты, где участвует пользователь, и генерируем "личные" задачи
        const projects = await ProjectService.getUserProjects(user.id);
        const generated: TaskCard[] = projects.flatMap((project, idx) => {
          const baseId = `${project.id}-${idx}`;
          const baseTitle = project.tittle || "Проект";
          const desc =
            project.description ||
            "Описание будет добавлено, когда владелец уточнит детали.";

          // Простая генерация трёх типов задач на проект
          return [
            {
              id: `${baseId}-todo`,
              title: `Подготовить задачи по ${baseTitle}`,
              description: `Сформировать список задач и уточнить приоритеты. ${desc}`,
              status: "todo",
              due: "Завтра",
              project: baseTitle,
              tone: "info",
            },
            {
              id: `${baseId}-in-progress`,
              title: `Основная работа по ${baseTitle}`,
              description: "Активно выполняется: синхронизация с командой и ревью.",
              status: "in-progress",
              due: "Через 3 дня",
              project: baseTitle,
              tone: "warning",
            },
            {
              id: `${baseId}-done`,
              title: `Недавний результат в ${baseTitle}`,
              description: "Задача закрыта и ждёт релиза.",
              status: "done",
              project: baseTitle,
              tone: "success",
            },
          ];
        });

        setTasks(generated);
      } catch (e) {
        console.error(e);
        setError("Не удалось загрузить ваши задания");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [user?.id]);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return tasks;
    return tasks.filter((t) => t.status === activeFilter);
  }, [tasks, activeFilter]);

  const getToneClass = (tone: StatusTone) => {
    if (tone === "success") return `${styles.badge} ${styles.badgeSuccess}`;
    if (tone === "warning") return `${styles.badge} ${styles.badgeWarning}`;
    return `${styles.badge} ${styles.badgeInfo}`;
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Мои задания</h1>
        <p className={styles.pageSubtitle}>
          Личные задачи из проектов, в которых вы участвуете.
        </p>
      </div>

      <div className={styles.filtersRow}>
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.id}
            className={`${styles.badge} ${
              activeFilter === filter.id ? styles.badgeInfo : ""
            }`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className={styles.card}>Загружаем ваши задания...</div>
      ) : error ? (
        <div className={styles.card}>{error}</div>
      ) : filtered.length === 0 ? (
        <div className={styles.card}>Пока нет задач в этом разделе.</div>
      ) : (
        <div className={styles.cardsGrid}>
          {filtered.map((task) => (
            <div key={task.id} className={styles.card}>
              <h3 className={styles.cardTitle}>{task.title}</h3>
              <p className={styles.cardText}>{task.description}</p>
              <div className={styles.metaRow}>
                <span className={getToneClass(task.tone)}>
                  {task.status === "in-progress"
                    ? "В работе"
                    : task.status === "todo"
                    ? "К выполнению"
                    : "Готово"}
                </span>
                {task.due && (
                  <span className={styles.badge}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M8 7V3M16 7V3M4 11h16M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
                    </svg>
                    {task.due}
                  </span>
                )}
                {task.project && (
                  <span className={styles.badge}>Проект: {task.project}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksPage;

