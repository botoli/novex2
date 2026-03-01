import { useEffect, useState } from "react";
import projectsStore from "../../Store/Projects.store";
import dataStore from "../../Store/Data";
import styles from "./AddProject.module.scss";
import { CloseIcon } from "../../UI/Icons";
import { observer } from "mobx-react-lite";
import { CurrentUserStore } from "../../Store/User.store";
import AddEmployeesModal from "../AddEmployeesModal/AddEmployeesModal";

const AddProjectModal = observer(() => {
  const Priority = ["Low", "Medium", "High"];

  const token =
    CurrentUserStore.currentuser?.id ?? localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedTo, setAssignedTo] = useState([]); // массив выбранных пользователей
  const [tags, setTags] = useState([]); // массив тегов
  const [tagInput, setTagInput] = useState(""); // поле ввода тега
  const [proj, setProj] = useState([]);
  const [isOpenAssignedTo, setIsOpenAssignedTo] = useState(false);

  function addNewProject() {
    const newProj = {
      title: title,
      description: description,
      created_by: Number(token),
      assigned_to: assignedTo.map((u) => u.id),
      priority: priority,
      tags: tags,
    };
    dataStore.projects = [...dataStore.projects, newProj];
    setProj([...proj, newProj]);
    setTitle("");
    setDescription("");
    setPriority("");
    setAssignedTo([]);
    setTags([]);
    setTagInput("");
    async function sendProject() {
      try {
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProj),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Проект создан:", data);

          // Закрыть модалку
          projectsStore.IsOpenAddProject = false;

          // Очистить форму
          setTitle("");
          setDescription("");
          setPriority("");
          setAssignedTo([]);
          setTags([]);
          setTagInput("");
        } else {
          const errorText = await response.text();
          console.error("❌ Ошибка сервера:", errorText);
        }
      } catch (error) {
        console.error("❌ Сетевая ошибка:", error);
      }
    }
    sendProject();
  }

  useEffect(() => {
    console.log(proj);
  }, [proj]);

  function tooglePriority(priority: string) {
    setPriority(Priority.find((e) => e === priority));
  }

  function toogleUser(id: number, name: string) {
    if (!assignedTo.some((u) => u.id === id)) {
      setAssignedTo([...assignedTo, { id, name }]);
    }
  }

  function deleteUser(id: number) {
    setAssignedTo(assignedTo.filter((u) => u.id !== id));
  }

  function NewTags() {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  }

  function DeleteTags(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  return (
    <div className={projectsStore.IsOpenAddProject ? styles.blur : null}>
      <div
        className={
          projectsStore.IsOpenAddProject
            ? styles.AddProjectModal
            : styles.closedAddProjectModal
        }
      >
        <div className={styles.modalHeader}>
          <h2>New Project</h2>
          <div
            className={styles.closeButton}
            onClick={() =>
              (projectsStore.IsOpenAddProject = !projectsStore.IsOpenAddProject)
            }
          >
            <CloseIcon />
          </div>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.field}>
            <label htmlFor="title">Project name</label>
            <input
              id="title"
              className={styles.input}
              type="text"
              placeholder="Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="description">Description</label>
            <input
              id="description"
              className={styles.input}
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>Priority</label>
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
          </div>

          <div className={styles.field}>
            <label>Assigned to</label>
            <div
              className={styles.assignedGroup}
              onClick={() => setIsOpenAssignedTo(!isOpenAssignedTo)}
            >
              {assignedTo.length > 0 ? (
                assignedTo.map((u) => (
                  <div className={styles.userChip} key={u.id}>
                    <p>{u.name}</p>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteUser(u.id);
                      }}
                    >
                      <CloseIcon />
                    </div>
                  </div>
                ))
              ) : (
                <span className={styles.placeholder}>Add participant</span>
              )}
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="tags">Tags</label>
            <div className={styles.addTags}>
              <input
                id="tags"
                className={styles.input}
                type="text"
                placeholder="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
              <button className={styles.addTagsBtn} onClick={() => NewTags()}>
                <p>Add tag</p>
              </button>
            </div>
          </div>

          {tags.length > 0 && (
            <div className={styles.activeTags}>
              {tags.map((tag) => (
                <div className={styles.user} key={tag}>
                  <p>#{tag}</p>
                  <div onClick={() => DeleteTags(tag)}>
                    <CloseIcon />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          className={styles.addNewProject}
          onClick={() => {
            addNewProject();
            projectsStore.changeIsOpen();
          }}
        >
          Create Project
        </button>
      </div>
      {isOpenAssignedTo && <AddEmployeesModal />}
    </div>
  );
});
export default AddProjectModal;
