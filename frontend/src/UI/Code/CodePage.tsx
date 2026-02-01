import React from "react";
import styles from "./CodePage.module.scss";
import PageHeader from "../../common/PageHeader";
import { AIIcon, GithubIcon, SearchIcon } from "../Icons";
import { useLogin } from "../../context/Modal";
import { useRegistration } from "../../context/RegistrarionModal";
import Login from "../../common/Login/Login";
import Registration from "../../common/Registration/Registration";

export default function CodePage() {
  const { isOpenRegistration, setIsOpenRegistration } = useRegistration();
  const { isOpenLogin, setIsOpenLogin } = useLogin();
  return (
    <div className={styles.codeContainer}>
      <PageHeader />
      {isOpenLogin ? <Login /> : null}
      {isOpenRegistration ? <Registration /> : null}
      <section className={styles.dashboard}>
        <h1>Code</h1>

        <div className={styles.subNavigation}>
          <button className={`${styles.subNavButton} ${styles.active}`}>
            All Repos
          </button>
          <button className={styles.subNavButton}>
            My Commits
            <span className={styles.dropdownArrow}>▼</span>
          </button>
          <div className={styles.summary}>
            <span>Total: 3</span>
          </div>
        </div>

        <div className={styles.mainContent}>
          {/* Left Top - Repositories Panel */}
          <div className={styles.repositoriesPanel}>
            <h2 className={styles.panelTitle}>Repositories</h2>
            <div className={styles.repositoriesList}>
              <div className={styles.repoCard}>
                <div className={styles.repoIcon}>
                  <GithubIcon width={24} height={24} />
                </div>
                <div className={styles.repoInfo}>
                  <h3 className={styles.repoName}>Mobile App</h3>
                  <p className={styles.repoUrl}>github.com/novex/mobile-app</p>
                  <div className={styles.repoStats}>
                    <span className={styles.statItem}>★ 42</span>
                    <span className={styles.statItem}>↓ 15</span>
                  </div>
                </div>
                <button className={styles.viewButton}>View Code</button>
              </div>

              <div className={styles.repoCard}>
                <div className={styles.repoIcon}>
                  <GithubIcon width={24} height={24} />
                </div>
                <div className={styles.repoInfo}>
                  <h3 className={styles.repoName}>E-Commerce Platform</h3>
                  <p className={styles.repoUrl}>github.com/novex/ecommerce</p>
                  <div className={styles.repoStats}>
                    <span className={styles.statItem}>★ 38</span>
                    <span className={styles.statItem}>↓ 22</span>
                  </div>
                </div>
                <button className={styles.viewButton}>View Code</button>
              </div>

              <div className={styles.repoCard}>
                <div className={styles.repoIcon}>
                  <GithubIcon width={24} height={24} />
                </div>
                <div className={styles.repoInfo}>
                  <h3 className={styles.repoName}>Admin Dashboard</h3>
                  <p className={styles.repoUrl}>
                    github.com/novex/admin-dashboard
                  </p>
                  <div className={styles.repoStats}>
                    <span className={styles.statItem}>★ 25</span>
                    <span className={styles.statItem}>↓ 11</span>
                  </div>
                </div>
                <button className={styles.viewButton}>View Code</button>
              </div>
            </div>
          </div>

          {/* Right Top - Project Architecture Panel */}
          <div className={styles.architecturePanel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Project Architecture</h2>
              <div className={styles.panelActions}>
                <div className={styles.searchBox}>
                  <SearchIcon width={16} height={16} />
                  <input type="text" placeholder="Q Search repos..." />
                </div>
                <button className={styles.filterButton}>⚙</button>
                <button className={styles.newButton}>New Commit</button>
              </div>
            </div>
            <div className={styles.architectureDiagram}>
              <div className={`${styles.diagramNode} ${styles.nodeClient}`}>
                Client
              </div>
              <div className={`${styles.diagramNode} ${styles.nodeFrontend}`}>
                <div className={styles.nodeContent}>
                  <span className={styles.nodeIcon}>📧</span>
                  <span className={styles.nodeIcon}>📊</span>
                </div>
                Frontend UI
              </div>
              <div className={`${styles.diagramNode} ${styles.nodeAPI}`}>
                API
              </div>
              <div className={`${styles.diagramNode} ${styles.nodeBusiness}`}>
                Business Logic
              </div>
              <div className={`${styles.diagramNode} ${styles.nodeDB}`}>
                <span className={styles.nodeIcon}>📁</span>
                Database
              </div>
              <div className={`${styles.diagramNode} ${styles.nodeCICD}`}>
                <div className={styles.nodeContent}>
                  <span className={styles.nodeIcon}>🧠</span>
                  <span className={styles.nodeIcon}>🐳</span>
                  <span className={styles.nodeIcon}>🦊</span>
                </div>
                CI/CD
              </div>
            </div>
          </div>

          {/* Bottom Left - Code Explorer Panel */}
          <div className={styles.explorerPanel}>
            <h2 className={styles.panelTitle}>Code Explorer</h2>
            <div className={styles.repositorySelect}>
              <select>
                <option>Mobile App Repository</option>
                <option>E-Commerce Platform Repository</option>
                <option>Admin Dashboard Repository</option>
              </select>
            </div>
            <div className={styles.fileTree}>
              <div className={styles.treeFolder}>
                <span className={styles.folderIcon}>📁</span>
                <span>Src</span>
                <div className={styles.treeChildren}>
                  <div className={styles.treeFolder}>
                    <span className={styles.folderIcon}>📁</span>
                    <span>components</span>
                  </div>
                  <div className={styles.treeFolder}>
                    <span className={styles.folderIcon}>📁</span>
                    <span>hooks</span>
                  </div>
                  <div className={styles.treeFolder}>
                    <span className={styles.folderIcon}>📁</span>
                    <span>pages</span>
                    <div className={styles.treeChildren}>
                      <div className={styles.treeFile}>
                        <span className={styles.fileIcon}>📄</span>
                        <span>App.tsx</span>
                      </div>
                      <div className={styles.treeFile}>
                        <span className={styles.fileIcon}>📄</span>
                        <span>index.tsx</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.treeFile}>
                    <span className={styles.fileIcon}>📄</span>
                    <span>vite.config.ts</span>
                  </div>
                </div>
              </div>
              <div className={styles.treeFolder}>
                <span className={styles.folderIcon}>📁</span>
                <span>public</span>
              </div>
              <div className={styles.treeFile}>
                <span className={styles.fileIcon}>📄</span>
                <span>package.json</span>
              </div>
            </div>
          </div>

          {/* Bottom Right - Code Editor Panel */}
          <div className={styles.editorPanel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>App.tsx</h2>
              <button className={styles.newButton}>New Commit</button>
            </div>
            <div className={styles.codeEditor}>
              <div className={styles.codeLine}>
                <span className={styles.lineNumber}>1</span>
                <span className={styles.codeContent}>
                  <span className={styles.keyword}>import</span>
                  <span className={styles.variable}>React</span>
                  <span className={styles.keyword}>from</span>
                  <span className={styles.string}>'react'</span>;
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.lineNumber}>2</span>
                <span className={styles.codeContent}>
                  <span className={styles.keyword}>import</span>
                  <span
                    className={styles.variable}
                  >{`{ BrowserRouter, Route, Switch }`}</span>
                  <span className={styles.keyword}>from</span>
                  <span className={styles.string}>'react-router-dom'</span>;
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.lineNumber}>3</span>
                <span className={styles.codeContent}>
                  <span className={styles.keyword}>import</span>
                  <span className={styles.variable}>Home</span>
                  <span className={styles.keyword}>from</span>
                  <span className={styles.string}>'./Home'</span>;
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.lineNumber}>4</span>
                <span className={styles.codeContent}>
                  <span className={styles.keyword}>import</span>
                  <span className={styles.variable}>Dashboard</span>
                  <span className={styles.keyword}>from</span>
                  <span className={styles.string}>'./Dashboard'</span>;
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.lineNumber}>5</span>
                <span className={styles.codeContent}>
                  <span className={styles.keyword}>import</span>
                  <span className={styles.variable}>NotFound</span>
                  <span className={styles.keyword}>from</span>
                  <span className={styles.string}>'./NotFound'</span>;
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.lineNumber}>6</span>
                <span className={styles.codeContent}></span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.lineNumber}>7</span>
                <span className={styles.codeContent}>
                  <span className={styles.function}>function</span>
                  <span className={styles.variable}>App</span>() {"{"}
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.lineNumber}>8</span>
                <span className={styles.codeContent}>
                  {"  "}
                  <span className={styles.keyword}>return</span> (
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.lineNumber}>9</span>
                <span className={styles.codeContent}>
                  {"    "}
                  <span className={styles.variable}>{`<BrowserRouter>`}</span>
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.lineNumber}>10</span>
                <span className={styles.codeContent}>
                  {"      "}
                  <span className={styles.variable}>{`<Route`}</span>{" "}
                  <span className={styles.string}>path="/"</span>
                  <span className={styles.variable}>component</span>=
                  {<span className={styles.variable}>Home</span>}
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.lineNumber}>11</span>
                <span className={styles.codeContent}>
                  <span className={styles.variable}>{`<Route`}</span>
                  <span className={styles.string}>path="/peshbaad"</span>
                  <span className={styles.variable}>component</span>=
                  {<span className={styles.variable}>Dashboard</span>}
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.lineNumber}>12</span>
                <span className={styles.codeContent}>
                  <span className={styles.variable}>{`<Route`}</span>
                  <span className={styles.variable}>component</span>=
                  {<span className={styles.variable}>NotFound</span>}
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.lineNumber}>13</span>
                <span className={styles.codeContent}>
                  <span className={styles.variable}>{`</BrowserRouter>`}</span>
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.lineNumber}>14</span>
                <span className={styles.codeContent}>);</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.lineNumber}>15</span>
                <span className={styles.codeContent}>{"}"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
