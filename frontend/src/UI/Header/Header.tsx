import React, { useState } from 'react';
import styles from './Header.module.scss';
import { Tabs } from './tabs';
import { Link } from 'react-router-dom';
import { Projects } from '../Projects/Projects.Mockdata';
export default function Header() {
  const [active, setActive] = useState(false);
  const countOfProjects = Projects.length;

  return (
    <div className={styles.allheader}>
      <div className={styles.logo_Container}>
        {/* должно быть в линию */}
        {/* <svg>{Logo}</svg> пока нет */}
        <h1>
          Novex
          {/* {countOfProjects} */}
        </h1>
      </div>

      <div className={styles.Tabs}>
        {Tabs.map((tab) => (
          <Link to={tab.name === 'home' ? '/' : `/${tab.name}`}>
            <div key={tab.id}>
              <div>
                <div>{tab.name === 'projects' ? countOfProjects : ''}</div>
              </div>

              {/* <svg>{tab.icon}</svg> */}
              <h2 className={styles.tab}>{tab.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
