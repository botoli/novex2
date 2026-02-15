import { useEffect, useMemo, useState } from "react";
import dataStore from "../../Store/Data";
import styles from "./FilteredButtons.module.scss";
const [activeFilter, setActiveFilter] = useState(() => {
  return localStorage.getItem("activeFilter") || "All Projects";
});
const btns = [
  { name: "All Projects" },
  { name: "Active" },
  { name: "Paused" },
  { name: "At Risk" },
  { name: "Completed" },
];
const filtered = useMemo(() => {
  return activeFilter === "All Projects"
    ? dataStore.currentProjects
    : dataStore.currentProjects.filter((p) => p.status === activeFilter);
}, [activeFilter, dataStore.currentProjects]);
useEffect(() => {
  localStorage.setItem("activeFilter", activeFilter);
}, [activeFilter]);

export const FilteredButtons = () => {
  <div className={styles.filterall}>
    {btns?.map((btn) => (
      <button
        key={btn.name}
        className={`${styles.Allprojetcs} ${
          activeFilter === btn.name ? styles.active : ""
        }`}
        onClick={() => setActiveFilter(btn.name)}
      >
        <p>{btn.name}</p>
        <p className={styles.countProjects}>
          {btn.name === "All Projects"
            ? dataStore.currentProjects.length
            : dataStore.currentProjects.filter((p) => p.status === btn.name)
                .length}
        </p>
      </button>
    ))}
  </div>;
};
export default FilteredButtons;
