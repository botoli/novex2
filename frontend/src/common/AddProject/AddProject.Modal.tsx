import { useEffect, useState } from "react";
import projectsStore from "../../Store/Projects.store";
import dataStroe from "../../Store/Data";
import styles from "./AddProject.module.scss";
import { CloseIcon } from "../../UI/Icons";
import { observer, useLocalObservable } from "mobx-react-lite";
import { CurrentUserStore } from "../../Store/User.store";

const AddProjectModal = observer(() => {
  const token =
    CurrentUserStore.currentuser?.id ?? localStorage.getItem("token");
  const form = useLocalObservable(() => ({
    title: "",
    description: "",
    status: "",
    priority: "",
    assigned_to: [] as { id: number; name: string }[],
    tag: "",
    tags: [] as string[],
    created_by: token ? parseInt(token) : 0,
    created_at: new Date().toISOString(),
    addNewProject() {
      const newProject = {
        title: this.title,
        description: this.description,
        status: this.status,
        priority: this.priority,
        assigned_to: [...this.assigned_to],
        tags: [...this.tags],
        created_by: this.created_by,
      };
      projectsStore.projects = [...projectsStore.projects, newProject];
      this.title = "";
      this.description = "";
      this.status = "";
      this.priority = "";
      this.assigned_to = [];
      this.tags = [];
      this.tag = "";
      projectsStore.IsOpenAddProject = false;
    },
    toogleUser(id: number, name: string) {
      if (!this.assigned_to.some((u) => u.id === id)) {
        this.assigned_to = [...this.assigned_to, { id, name }];
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
          <div className={styles.status}>Status</div>
          <div className={styles.priority}>Priority</div>
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
              {dataStroe.users.map((u) => (
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
              <div className={styles.tag}>
                <p>{tag}</p>
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
