import { current } from "@reduxjs/toolkit";
import { makeAutoObservable } from "mobx";

export const CurrentUserStore = {
  currentuser: (() => {
    try {
      const saved = localStorage.getItem("currentuser");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })(),

  setCurrentuser(data) {
    this.currentuser = data;
    data
      ? localStorage.setItem("currentuser", JSON.stringify(data))
      : localStorage.removeItem("currentuser");
  },
  logOut() {
    this.currentuser = null;
    localStorage.removeItem("currentuser");
    localStorage.removeItem("token");
  },
};
makeAutoObservable(CurrentUserStore);
