import { makeAutoObservable } from "mobx";

export const AssignedStore = {
  assignedUsersTask: [],
  assignedUsersProjects: [],

  assignTask(id: number) {
    if (!this.assignedUsersTask.some((u) => u === id)) {
      this.assignedUsersTask = [...this.assignedUsersTask, id];
    }
  },
  unassignTask(id: number) {
    this.assignedUsersTask = this.assignedUsersTask.filter((u) => u !== id);
  },
};
makeAutoObservable(AssignedStore);
