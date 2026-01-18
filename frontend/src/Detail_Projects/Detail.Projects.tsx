import { useState } from 'react';
import ProjectsData from '../UI/Projects/ProjectsPage';
import styles from './Detail.Projects.module.scss';
import { ArrowRightIcon } from '../UI/Icons';
export default function DetailProject({ name }) {
  const [projects, setProjects] = useState(ProjectsData);
  return (
    <div className={styles.allDetailProject}>
      {projects.filter(
        (proj) =>
          proj.title === name && (
            <div className={styles.DetailProjectHeader}>
              <ArrowRightIcon />
              <span>Projects</span>/<span>{proj.title}</span>
            </div>
          ),
      )}
    </div>
  );
}
