import { useState } from 'react';
import styles from './Detail.Projects.module.scss';
import { ArrowRightIcon } from '../Icons/Icon';
import { useData } from '../../fetch/fetchTasks';

export default function DetailProject({ name }) {
  const { data: projects, setData: setProjects } = useData('http://localhost:3001/projects');
  return (
    <div className={styles.allDetailProject}>
      {projects
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
