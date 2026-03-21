import { useState } from "react";
import styles from "./Detail.Projects.module.scss";
import { ArrowRightIcon } from "../Icons/Icon";
import { fetchData } from "../../fetch/fetchTasks";
import dataStore from "../../Store/Data";

export default function DetailProject({ name }) {
  return (
    <div className={styles.allDetailProject}>
      {dataStore.currentProjects
        .filter((proj) => proj.title === name)
        .map((proj) => (
          <div key={proj.id} className={styles.DetailProjectHeader}>
            <ArrowRightIcon />
            <span>Projects</span>/<span>{proj.title}</span>
          </div>
        ))}
    </div>
  );
}
