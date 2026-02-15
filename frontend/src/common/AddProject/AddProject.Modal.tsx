import { useEffect, useState } from "react";
import projectsStore from "../../Store/Projects.store";
import dataStore from "../../Store/Data";
import styles from "./AddProject.module.scss";
import { CloseIcon } from "../../UI/Icons";
import { observer, useLocalObservable } from "mobx-react-lite";
import { CurrentUserStore } from "../../Store/User.store";
import { createProject } from "../../fetch/Post";

const AddProjectModal = observer(() => {
  const Priority = ["Low", "Medium", "High"];
  const token =
    CurrentUserStore.currentuser?.id ?? localStorage.getItem("token");

  // fetchData provides `post` which invalidates the GET cache on success

  const form = useLocalObservable(() => ({
    title: "",
    description: "",
    priority: "",
    status: "Active",
    assigned_to: [] as { id: number; name: string }[],
    tag: "",
    tags: [] as string[],
    created_by: token ? parseInt(token) : 0,
    created_at: new Date().toISOString(),

    async addNewProject() {
      const payload = {
        title: this.title,
        description: this.description,
        priority: this.priority,
        assigned_to: this.assigned_to.map((u) => u.id),
        tags: [...this.tags],
        created_by: this.created_by,
        created_at: this.created_at,
      };

      try {
        const created = await createProject(payload);
        // add server response to local store (keeps UI in sync)
        projectsStore.projects = [...projectsStore.projects, created];

        // reset form
        this.title = "";
        this.description = "";
        this.priority = "";
        this.assigned_to = [];
        this.tags = [];
        this.tag = "";
        projectsStore.IsOpenAddProject = false;
      } catch (err) {
        console.error("Failed to create project:", err);
        // minimal UX: keep modal open and let user try again
        // could add toast/inline error later
      }
    },

    toogleUser(id: number, name: string) {
      if (!this.assigned_to.some((u) => u.id === id)) {
        this.assigned_to = [...this.assigned_to, { id, name }];
      }
    },
    tooglePriority(priority: string) {
      if (this.priority.length > 0 && this.priority === priority) {
        this.priority = "";
      } else {
        this.priority = priority;
      }
    },
    deleteUser(id: number) {
      this.assigned_to = this.assigned_to.filter((q) => q.id !== id);
    },
    NewTags() {
      if (this.tag.trim()) {
        this.tags = [...this.tags, this.tag.trim()];
        this.tag = "";
      }
    },
    DeleteTags(tag: string) {
      this.tags = this.tags.filter((q) => q !== tag);
    },
  }));

  const [isOpenAssignedTo, setIsOpenAssignedTo] = useState(false);
  const [isOpenPriority, setIsOpenPriority] = useState(false);
  return (
    <div className={projectsStore.IsOpenAddProject ? styles.blur : null}>
      <div
        className={
          projectsStore.IsOpenAddProject
            ? styles.AddProjectModal
            : styles.closedAddProjectModal
        }
      >
        <div
          onClick={() =>
            (projectsStore.IsOpenAddProject = !projectsStore.IsOpenAddProject)
          }
        >
          <CloseIcon />
        </div>
        <div>
          <input
            className={styles.input}
            type="text"
            placeholder="title"
            value={form.title}
            onChange={(e) => (form.title = e.target.value)}
          />
          <input
            className={styles.input}
            type="text"
            placeholder="description"
            value={form.description}
            onChange={(e) => (form.description = e.target.value)}
          />
          <div
            className={styles.priority}
            onClick={() => setIsOpenPriority(!isOpenPriority)}
          >
            Priority
            <div
              className={
                isOpenPriority ? styles.openAssigned : styles.closedAssigned
              }
            >
              {Priority.map((p) => (
                <div
                  className={styles["priority" + p]}
                  onClick={() => form.tooglePriority(p)}
                  key={p}
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.activeUser}>
            {form.priority.length > 0 && (
              <div
                className={
                  form.priority
                    ? `${styles.user} ${styles["priority" + form.priority]}`
                    : styles.user
                }
              >
                <p>{form.priority}</p>
                <div onClick={() => (form.priority = "")}>
                  <CloseIcon />
                </div>
              </div>
            )}
          </div>
          <div
            className={styles.assigned_to}
            onClick={() => setIsOpenAssignedTo(!isOpenAssignedTo)}
          >
            Assigned to
            <div
              className={
                isOpenAssignedTo ? styles.openAssigned : styles.closedAssigned
              }
            >
              {dataStore.users.map((u) => (
                <div onClick={() => form.toogleUser(u.id, u.name)} key={u.id}>
                  {u.name}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.activeUser}>
            {form.assigned_to.map((user) => (
              <div className={styles.user}>
                <p>{user.name}</p>
                <div onClick={() => form.deleteUser(user.id)}>
                  <CloseIcon />
                </div>
              </div>
            ))}
          </div>
          <div className={styles.addTags}>
            <input
              className={styles.input}
              type="text"
              placeholder="tags"
              value={form.tag}
              onChange={(e) => (form.tag = e.target.value)}
            />
            <button
              className={styles.addTagsBtn}
              onClick={() => form.NewTags()}
            >
              <p>Add tag</p>
            </button>
          </div>
          <div className={styles.activeTags}>
            {form.tags.map((tag) => (
              <div className={styles.user}>
                <p>#{tag}</p>
                <div onClick={() => form.DeleteTags(tag)}>
                  <CloseIcon />
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          className={styles.addNewProject}
          onClick={() => form.addNewProject()}
        >
          Create Project
        </button>
      </div>
    </div>
  );
});
export default AddProjectModal;
