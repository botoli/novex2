import { makeAutoObservable } from "mobx";

const projectsStore = {
  projects: [] as any[],
  IsOpenAddProject: false,
  IsOpenAddTasks: false,
  IsOpenSettings: false,
  IsOpenAssigned: false,
  changeIsOpen() {
    this.IsOpenAddProject = !this.IsOpenAddProject;
  },
  changeIsOpenTasks() {
    this.IsOpenAddTasks = !this.IsOpenAddTasks;
  },
  changeIsOpenAssigned() {
    this.IsOpenAssigned = !this.IsOpenAssigned;
  },
  changeIsOpenSettings() {
    this.IsOpenSettings = !this.IsOpenSettings;
  },
};

makeAutoObservable(projectsStore);
export default projectsStore;
