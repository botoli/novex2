import { useEffect, useRef, useState } from "react";
import projectsStore from "../../Store/Projects.store";
import { CloseIcon } from "../../UI/Icons";
import styles from "./AddTask.module.scss";
import { useForm } from "react-hook-form";
import dataStore from "../../Store/Data";
import type { CreateTaskDto } from "../../interfaces/Interfaces";
import AddEmployeesModal from "../AddEmployeesModal/AddEmployeesModal";
import { observer } from "mobx-react-lite";
import { AssignedStore } from "../../Store/Assigned.Users";

const AddTask = observer(() => {
  const Priority = ["Low", "Medium", "High"];
  const [priority, setPriority] = useState("");
  function tooglePriority(priority: string) {
    setPriority(Priority.find((e) => e === priority));
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTaskDto>({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      estimated_hours: 0.5,
    },
  });

  const onsubmit = (data) => {
    data.assigned_to = AssignedStore.assignedUsersTask;
    data.priority = priority;
    setPriority("");
    AssignedStore.assignedUsersTask = [];
    console.log(data);

    async function sendProject() {
      try {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Проект создан:", data);
          // Закрыть модалку
          projectsStore.IsOpenAddTasks = false;

          reset();
        } else {
          const errorText = await response.text();
          console.error("❌ Ошибка сервера:", errorText);
        }
      } catch (error) {
        console.error("❌ Сетевая ошибка:", error);
      }
    }
    sendProject();
  };

  return (
    <div
      className={
        projectsStore.IsOpenAddTasks && projectsStore.IsOpenAddTasks
          ? styles.blur
          : null
      }
    >
      {projectsStore.IsOpenAssigned ? <AddEmployeesModal /> : null}
      <div className={styles.modal}>
        <form className={styles.form} onSubmit={handleSubmit(onsubmit)}>
          <div className={styles.modalHeader}>
            <h2>New Task</h2>
            <div
              className={styles.closeButton}
              onClick={() => projectsStore.changeIsOpenTasks()}
            >
              <CloseIcon />
            </div>
          </div>

          {/* ИМЯ ТУТ Name */}
          <p>Имя</p>
          <input
            placeholder="Name"
            className={`${styles.input} ${errors.title ? styles.error : ""}`}
            type="text"
            {...register("title", {
              required: "Название обязательно",
            })}
          />
          {errors.title && (
            <span className={styles.errorMessage}>Обязательное поле</span>
          )}

          {/* ТУТ ПРОЕКТЫ Project*/}
          <p>Проекты</p>
          <select
            className={`${styles.select} ${errors.project_id ? styles.error : ""}`}
            {...register("project_id", { required: "Выберите проект" })}
          >
            {dataStore.currentProjects?.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.title}
              </option>
            ))}
          </select>

          {/* Description */}

          <p>Описание</p>
          <input
            placeholder="Descritpion"
            type="text"
            {...register("description", {
              required: "Description",
            })}
            className={`${styles.input} ${errors.title ? styles.error : ""}`}
          />
          {errors.description && (
            <span className={styles.errorMessage}>Обязательное поле</span>
          )}

          {/* Priority */}
          <p>Важность</p>
          <div className={styles.priorityGroup}>
            {Priority.map((p) => (
              <div
                key={p}
                className={`${styles.priorityButton} ${
                  priority === p ? styles.active : ""
                } ${styles[p.toLowerCase()]}`}
                onClick={() => tooglePriority(p)}
              >
                {p}
              </div>
            ))}
          </div>
          {/* Assigned to */}
          <p>Назначено на:</p>
          <div
            onClick={() => projectsStore.changeIsOpenAssigned()}
            className={`${styles.input} ${errors.title ? styles.error : ""}`}
          >
            Добавить сотрудников
          </div>
          {errors.title && (
            <span className={styles.errorMessage}>Обязательное поле</span>
          )}

          {/* ТУТ hours */}

          <p>Время выполнения</p>
          <input
            className={styles.input}
            type="number"
            step={0.5}
            min={0}
            max={100}
            maxLength={3}
            {...register("estimated_hours", { valueAsNumber: true })}
          />
          <div className={styles.onRow}>
            {/* Deadline */}

            <div>
              <p>Крайний срок</p>
              <input
                type="datetime-local"
                {...register("due_date")}
                className={`${styles.input} ${errors.title ? styles.error : ""}`}
              />
            </div>
            {/* Parent */}
            <div>
              <p>Родительская задача</p>
              <input
                type="text"
                {...register("parent_task_id")}
                className={styles.input}
              />
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
});
export default AddTask;
