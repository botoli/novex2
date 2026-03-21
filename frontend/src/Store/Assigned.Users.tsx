import { makeAutoObservable } from "mobx";
import projectsStore from "./Projects.store";

export const AssignedStore = {
  assignedUsersTask: [],
  assignedUsersProjects: [],

  assignTask(id: number) {
    if (!this.assignedUsersTask.some((u) => u === id)) {
      this.assignedUsersTask = [...this.assignedUsersTask, id];
    }
    if (!projectsStore.IsOpenAssigned) {
      this.assignedUsersTask = [];
    }
  },
  unassignTask(id: number) {
    this.assignedUsersTask = this.assignedUsersTask.filter((u) => u !== id);
  },
  assignProject(id: number) {
    if (
      !this.assignedUsersProjects.some((u) => u === id) ||
      projectsStore.IsOpenAssigned
    ) {
      this.assignedUsersProjects = [...this.assignedUsersProjects, id];
    }
  },
  unassignProject(id: number) {
    this.assignedUsersProjects = this.assignedUsersProjects.filter(
      (u) => u !== id,
    );
  },
};
makeAutoObservable(AssignedStore);
