import { get, makeAutoObservable, runInAction } from "mobx";
import { fetchData } from "../fetch/fetchTasks";

const dataStore = {
  users: [],
  projects: [],
  tasks: [],
  isLoading: false,
  token: null,
  error: null,
  message: null,
  setToken(token) {
    this.token = token;
    localStorage.setItem("token", token);
  },
  async FetchAll() {
    console.log(this.token);

    this.isLoading = true;
    this.error = null;
    try {
      const [usersResp, projectsResp, tasksResp] = await Promise.all([
        await fetchData("users"),
        await fetchData("projects"),
        await fetchData("tasks"),
      ]);
      runInAction(() => {
        this.projects = projectsResp || [];
        this.users = usersResp || [];
        this.tasks = tasksResp || [];
        this.isLoading = false;
      });
    } catch (error) {
      this.message = error.message;
    }
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

makeAutoObservable(dataStore);
export default dataStore;
