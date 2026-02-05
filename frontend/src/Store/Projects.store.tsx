import { makeAutoObservable } from "mobx";

const projectsStore = {
  projects: [] as any[],
  IsOpenAddProject: false,
  changeIsOpen() {
    this.IsOpenAddProject = !this.IsOpenAddProject;
  },
};

makeAutoObservable(projectsStore);
export default projectsStore;
