import { useCallback } from "react";
import dataStore from "./Data";

export const useProjectStatus = (id: number) => {
  const active = Math.floor(
    dataStore.tasks.filter(
      (task) => task.projectId === id && task.status === "active",
    ).length,
  );
  const blocked = Math.floor(
    dataStore.tasks.filter(
      (task) => task.projectId === id && task.status === "blocked",
    ).length,
  );
  const overdue = Math.floor(
    dataStore.tasks.filter(
      (task) => task.projectId === id && task.status === "overdue",
    ).length,
  );
  const progress =
    Math.floor(
      (dataStore.tasks.filter(
        (task) => task.projectId === id && task.status === "completed",
      ).length /
        dataStore.tasks.filter((task) => task.projectId === id).length) *
        100,
    ) || 0;

  return {
    active: active,
    blocked: blocked,
    overdue: overdue,
    progress: progress,
  };
};
