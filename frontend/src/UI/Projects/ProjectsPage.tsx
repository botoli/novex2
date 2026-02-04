import { useEffect, useMemo, useState } from "react";
import {
  ActiveIcon,
  ArrowRightIcon,
  BlockedIcon,
  CloseIcon,
  GithubIcon,
  OverdueIcon,
} from "../Icons";
import styles from "./Projects.module.scss";
import PageHeader from "../../common/PageHeader";
import { nowurl, useData } from "../../fetch/fetchTasks";
import { useLogin } from "../../context/Modal";
import { useRegistration } from "../../context/RegistrarionModal";
import Login from "../../common/Login/Login";
import Registration from "../../common/Registration/Registration";
import { observer } from "mobx-react-lite";
import { CurrentUserStore } from "../../Store/User.store";
import dataStroe from "../../Store/Data";
const ProjectsPage = observer(() => {
  const [activeFilter, setActiveFilter] = useState(() => {
    return localStorage.getItem("activeFilter") || "All Projects";
  });

  const [isOpenAddProject, setIsOpenAddProject] = useState(false);
  const [currentProjects, setCurrentProjects] = useState<any[]>(
    dataStroe.projects,
  );
  const [filtered, setFiltered] = useState(() => {
    const storedFiltered = localStorage.getItem("filtered");
    return storedFiltered ? JSON.parse(storedFiltered) : currentProjects;
  });

  const { isOpenRegistration, setIsOpenRegistration } = useRegistration();
  const { isOpenLogin, setIsOpenLogin } = useLogin();
  const [isOpenasignedTo, setisOpenasignedTo] = useState(false);
  const [tagas, setTags] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedId, setSelectedId] = useState([]);
  const btns = [
    { name: "All Projects" },
    { name: "Active" },
    { name: "Paused" },
    { name: "At Risk" },
    { name: "Completed" },
  ];

  const token =
    CurrentUserStore.currentuser?.id ?? localStorage.getItem("token");

  function toogleUser(id: number) {}

  useEffect(() => {
    setCurrentProjects(
      dataStroe.projects.filter((p) => p.assigned_to === Number(token)),
    );
  }, [dataStroe.projects, token, CurrentUserStore.currentuser]);

  useMemo(() => {
    setActiveFilter(activeFilter);
    setFiltered(
      activeFilter === "All Projects"
        ? currentProjects
        : currentProjects.filter((p) => p.status === activeFilter),
    );
  }, [activeFilter, currentProjects]);

  useEffect(() => {
    localStorage.setItem("activeFilter", activeFilter);
    localStorage.setItem("filtered", JSON.stringify(filtered));
  }, [activeFilter, currentProjects, dataStroe.projects]);

  const progress = (id: number) => {
    return (
      Math.floor(
        (dataStroe.tasks.filter(
          (task) => task.projectId === id && task.status === "completed",
        ).length /
          dataStroe.tasks.filter((task) => task.projectId === id).length) *
          100,
      ) || 0
    );
  };

  function SetStatistikActive(id: number) {
    return Math.floor(
      dataStroe.tasks.filter(
        (task) => task.projectId === id && task.status === "active",
      ).length,
    );
  }

  function SetStatistikBlocked(id: number) {
    return Math.floor(
      dataStroe.tasks.filter(
        (task) => task.projectId === id && task.status === "blocked",
      ).length,
    );
  }

  function SetStatistikOverdue(id: number) {
    return Math.floor(
      dataStroe.tasks.filter(
        (task) => task.projectId === id && task.status === "overdue",
      ).length,
    );
  }

  return (
    <div className={styles.ProjectContainer}>
      <PageHeader />
      {isOpenLogin ? <Login /> : null}
      {isOpenRegistration ? <Registration /> : null}
      <div className={isOpenAddProject && styles.blur}>
        <div
          className={
            isOpenAddProject
              ? styles.AddProjectModal
              : styles.closedAddProjectModal
          }
        >
          <div onClick={() => setIsOpenAddProject(!isOpenAddProject)}>
            <CloseIcon />
          </div>
          <div>
            <input
              className={styles.input}
              type="text"
              placeholder="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className={styles.input}
              type="text"
              placeholder="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className={styles.status}>Status</div>
            <div className={styles.priority}>Priority</div>
            <div
              className={styles.assigned_to}
              onClick={() => setisOpenasignedTo(!isOpenasignedTo)}
            >
              Assigned to
              <div
                className={
                  isOpenasignedTo ? styles.openAsigned : styles.closedAsigned
                }
              >
                {dataStroe.users.map((u) => (
                  <div onClick={() => toogleUser(u.id)}>
                    {u.name} {u.id}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.activeUser}>
              {selectedId.map((user) => (
                <div className={styles.user}>
                  <p>{user}</p>{" "}
                  <div onClick={() => toogleUser(user)}>
                    <CloseIcon />
                  </div>
                </div>
              ))}
            </div>
            <input
              className={styles.input}
              type="text"
              placeholder="tags"
              value={tagas}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <button className={styles.addNewProject}>Create Project</button>
        </div>
      </div>
      <section className={styles.dashboard}>
        <h1>Projects</h1>
        <div className={styles.headerProjects}>
          <div className={styles.filterall}>
            {btns?.map((btn) => (
              <button
                className={`${styles.Allprojetcs} ${
                  activeFilter === btn.name ? styles.active : ""
                }`}
                onClick={() => setActiveFilter(btn.name)}
              >
                <p>{btn.name}</p>
                <p className={styles.countProjects}>
                  {btn.name === "All Projects"
                    ? currentProjects.length
                    : currentProjects.filter((p) => p.status === btn.name)
                        .length}
                </p>
              </button>
            ))}
          </div>
          <div className={styles.addProject}>
            <button
              className={styles.addbtn}
              onClick={() => setIsOpenAddProject(!isOpenAddProject)}
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
                          {progress(project.id)}%
                        </p>
                        <div className={styles.progressDiv}>
                          <div
                            className={styles.progressBar}
                            style={{ width: progress(project.id) + "%" }}
                          ></div>
                        </div>
                        <p>
                          {Math.floor(
                            dataStroe.tasks.filter(
                              (task) =>
                                task.projectId === project.id &&
                                task.status === "completed",
                            ).length,
                          )}
                          /
                          {Math.floor(
                            dataStroe.tasks.filter(
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
                            {SetStatistikActive(project.id)}
                          </span>
                        </button>

                        <button className={`${styles.btnBlocked}`}>
                          <BlockedIcon />
                          <span className={styles.label}>Blocked:</span>

                          <span className={styles.value}>
                            {SetStatistikBlocked(project.id)}
                          </span>
                        </button>

                        <button className={`${styles.btnOverdue}`}>
                          <OverdueIcon />
                          <span className={styles.label}>Overdue:</span>
                          <span className={styles.value}>
                            {SetStatistikOverdue(project.id)}
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
