import { get, makeAutoObservable, runInAction } from "mobx";
import { nowurl, useData } from "../fetch/fetchTasks";
import axios from "axios";

const dataStroe = {
  users: [],
  projects: [],
  tasks: [],
  isLoading: true,
  token: null,
  error: null,

  setToken(token) {
    this.token = token;
  },

  // ✅ Добавь этот метод
  updateTaskStatus(taskId, newStatus) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.status = newStatus; // Теперь работает!
    }
  },

  FetchALl() {
    this.isLoading = true;
    Promise.all([
      axios.get(nowurl + "users"),
      axios.get(nowurl + "projects"),
      axios.get(nowurl + "tasks"),
    ])
      .then(([usersResp, projectsResp, tasksResp]) => {
        runInAction(() => {
          this.users = usersResp.data;
          this.projects = projectsResp.data;

          // ✅ ВАЖНО: делаем каждую задачу observable
          this.tasks = tasksResp.data.map((task) => {
            makeAutoObservable(task);
            return task;
          });

          this.isLoading = false;
        });
      })
      .catch((error) => {
        runInAction(() => {
          this.isLoading = false;
          this.error = {
            code: error?.response?.status || error?.code || "UNKNOWN_ERROR",
            message:
              error?.response?.data?.message ||
              error?.message ||
              "Произошла ошибка при загрузке данных",
          };
        });
      });
  },

  get currentProjects() {
    if (!this.token) {
      return [];
    }
    return this.projects.filter((project) =>
      project.assigned_to.includes(Number(this.token)),
    );
  },

  get currentTasks() {
    const projectIds = this.currentProjects.map((p) => p.id);
    return this.tasks.filter((task) => projectIds.includes(task.projectId));
  },
};

makeAutoObservable(dataStroe);
export default dataStroe;
