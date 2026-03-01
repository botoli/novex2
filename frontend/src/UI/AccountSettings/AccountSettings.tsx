import React, { useState } from "react";
import styles from "./AccountSettings.module.scss";
import { CloseIcon, GithubIcon, LogoutIcon } from "../Icons";
import { useUser } from "../../context/UserContext";
import { observer } from "mobx-react-lite";
import projectsStore from "../../Store/Projects.store";
import { CurrentUserStore } from "../../Store/User.store";
import { Link } from "react-router-dom";
import dataStore from "../../Store/Data";

const AccountSettings = observer(() => {
  const token = localStorage.getItem("token");
  const currentUser = dataStore.users.find((user) => user.id === Number(token));
  const { currentuser, setCurrentuser } = useUser();

  const [username, setUsername] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [password, setPassword] = useState(currentUser?.password || "");
  const [repeatPassword, setRepeatPassword] = useState(
    currentUser?.password || "",
  );
  const [about, setAbout] = useState(currentUser?.about || "");

  function close() {
    projectsStore.changeIsOpenSettings();
  }

  function Logout() {
    CurrentUserStore.logOut();
  }

  return (
    <div>
      <div className={styles.overlay} onClick={close}></div>

      <div
        className={styles.allAccountSettings}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h1>Profile</h1>
          <div className={styles.icon} onClick={close}>
            <CloseIcon />
          </div>
        </div>

        <div className={styles.modalBody}>
          {/* Left column - avatar and socials */}
          <aside className={styles.leftCol}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatar}>
                {/* Placeholder avatar */}
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="avatar" />
                ) : (
                  <div className={styles.avatarInitials}>
                    {(currentUser?.name || "").slice(0, 1)}
                  </div>
                )}
              </div>
              <button className={styles.uploadBtn}>Upload Picture</button>
            </div>

            <ul className={styles.socials}>
              <li>
                <button className={styles.socialBtn}>
                  <GithubIcon />
                </button>
                <span>Add Facebook</span>
              </li>
              <li>
                <button className={styles.socialBtn}>T</button>
                <span>Add Twitter</span>
              </li>
              <li>
                <button className={styles.socialBtn}>I</button>
                <span>Add Instagram</span>
              </li>
              <li>
                <button className={styles.socialBtn}>G+</button>
                <span>Add Google+</span>
              </li>
            </ul>
          </aside>

          {/* Center form */}
          <main className={styles.contentCol}>
            <form
              className={styles.form}
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: perform update/save here
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <label>
                Username:
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
              <label>
                Role:
                <input value={currentUser?.role || ""} />
              </label>

              <label>
                E-mail:
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label>
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              <label>
                About Me:
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                />
              </label>

              <div className={styles.formActions}>
                <button type="submit" className={styles.updateBtn}>
                  Update Information
                </button>
              </div>
            </form>
          </main>

          {/* Right vertical tabs */}
          <nav className={styles.rightCol}>
            <ul className={styles.tabs}>
              <li className={styles.active}>Profile</li>
              <li>Statistics</li>
              <li>Get Help</li>
              <li>Settings</li>
              <li onClick={Logout}>Sign Out</li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
});

export default AccountSettings;
