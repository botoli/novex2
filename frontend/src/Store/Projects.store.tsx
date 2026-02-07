import { makeAutoObservable } from "mobx";

const projectsStore = {
  projects: [] as any[],
  IsOpenAddProject: false,
  IsOpenSettings: false,
  changeIsOpen() {
    this.IsOpenAddProject = !this.IsOpenAddProject;
  },
  changeIsOpenSettings() {
    this.IsOpenSettings = !this.IsOpenSettings;
  },
};

makeAutoObservable(projectsStore);
export default projectsStore;
