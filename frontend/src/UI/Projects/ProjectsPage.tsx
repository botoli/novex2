import { useEffect, useMemo, useState } from "react";
import {
  ActiveIcon,
  ArrowRightIcon,
  BlockedIcon,
  GithubIcon,
  OverdueIcon,
} from "../Icons";
import styles from "./Projects.module.scss";
import PageHeader from "../../common/PageHeader";
import { useLogin } from "../../context/Modal";
import { useRegistration } from "../../context/RegistrarionModal";
import Login from "../../common/Login/Login";
import Registration from "../../common/Registration/Registration";
import { observer } from "mobx-react-lite";
import dataStore from "../../Store/Data";
import AddProjectModal from "../../common/AddProject/AddProject.Modal";
import projectsStore from "../../Store/Projects.store";
import { useProjectStatus } from "../../Store/useProjectsStatus";
import FilteredButtons from "../../common/FilteredButtons/FilteredButtons";
const ProjectsPage = observer(() => {
  const { isOpenRegistration, setIsOpenRegistration } = useRegistration();
  const { isOpenLogin, setIsOpenLogin } = useLogin();

  return (
    <div className={styles.ProjectContainer}>
      <PageHeader />
      {isOpenLogin ? <Login /> : null}
      {isOpenRegistration ? <Registration /> : null}
      {<AddProjectModal />}

      <section className={styles.dashboard}>
        <h1>Projects</h1>
        <div className={styles.headerProjects}>
          <FilteredButtons />
          <div className={styles.addProject}>
            <button
              className={styles.addbtn}
              onClick={() => projectsStore.changeIsOpen()}
            >
              Add new project
            </button>
          </div>
        </div>
        <div className={styles.heroProjets}>
          <div className={styles.tasksSection}>
            <h1 className={styles.sectionTitle}>Projects Focus</h1>
            <div className={styles.gridProjects}>
              {filtered?.map((project) => (
                <div key={project.id} className={styles.taskCard}>
                  <div className={styles.taskHeader}>
                    <div className={styles.taskInfo}>
                      <h1>
                        {project.title}

                        <button name={project.title}>
                          <ArrowRightIcon />
                        </button>
                      </h1>
                      <div className={styles.progressContainer}>
                        <p className={styles.progressText}>
                          {useProjectStatus(project.id).progress}%
                        </p>
                        <div className={styles.progressDiv}>
                          <div
                            className={styles.progressBar}
                            style={{
                              width:
                                useProjectStatus(project.id).progress + "%",
                            }}
                          ></div>
                        </div>
                        <p>
                          {Math.floor(
                            dataStore.tasks.filter(
                              (task) =>
                                task.projectId === project.id &&
                                task.status === "completed",
                            ).length,
                          )}
                          /
                          {Math.floor(
                            dataStore.tasks.filter(
                              (task) => task.projectId === project.id,
                            ).length,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.taskFooter}>
                    <div className={styles.taskMetrics}>
                      <div className={styles.metricButtons}>
                        <button className={`${styles.btnActive}`}>
                          <ActiveIcon />
                          <span className={styles.label}>Active:</span>
                          <span className={styles.value}>
                            {useProjectStatus(project.id).active}
                          </span>
                        </button>

                        <button className={`${styles.btnBlocked}`}>
                          <BlockedIcon />
                          <span className={styles.label}>Blocked:</span>

                          <span className={styles.value}>
                            {useProjectStatus(project.id).blocked}
                          </span>
                        </button>

                        <button className={`${styles.btnOverdue}`}>
                          <OverdueIcon />
                          <span className={styles.label}>Overdue:</span>
                          <span className={styles.value}>
                            {useProjectStatus(project.id).overdue}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className={styles.githubInfo}>
                      <GithubIcon />
                      <span>github:</span>
                      <span className={styles.githubCommits}>
                        commits:{/* {CountOfCommits} */} 10
                      </span>
                      <span className={styles.githubCommits}>
                        PR:{/* {PR} */}7
                      </span>
                      <span className={styles.githubCommits}>
                        CI:{/* {CI} */}2{" "}
                      </span>
                    </div>

                    <div className={styles.actionButtons}>
                      <button className={styles.btnBoard}>
                        <p>Board</p>
                      </button>
                      <button className={styles.btnGithub}>
                        <p>Repo</p>
                      </button>
                      <button className={styles.btnAnalytics}>
                        <p>Analytics</p>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});
export default ProjectsPage;
