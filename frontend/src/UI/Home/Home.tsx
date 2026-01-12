import React, { useState } from 'react';
import styles from './Home.module.scss';
import { Tabs } from './Data';
import { Link } from 'react-router-dom';
export default function Home() {
  const [active, setActive] = useState(false);
  return (
    <div className={styles.allHome}>
      <section className={styles.header_section}></section>
    </div>
  );
}
