import { get, makeAutoObservable, runInAction } from "mobx";
import { nowurl, useData } from "../fetch/fetchTasks";
import axios from "axios";

const dataStroe = {
  users: [],
  projects: [],
  tasks: [],
  isLoading: true,
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
          this.tasks = tasksResp.data;
          this.isLoading = false;
        });
      })
      .catch((error) => {
        console.error("Ошибка получения данных:", error);
      });
  },
};

makeAutoObservable(dataStroe);

export default dataStroe;
