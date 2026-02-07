import { useEffect, useState } from "react";
import {
  AccountIcon,
  LogoutIcon,
  NotificationIcon,
  SearchIcon,
  SettingsIcon,
} from "../UI/Icons";
import styles from "./Page.Header.module.scss";
import AccountSettings from "../UI/AccountSettings/AccountSettings";
import { nowurl, useData } from "../fetch/fetchTasks";
import { useLogin } from "../context/Modal";
import { useRegistration } from "../context/RegistrarionModal";

import { observer } from "mobx-react-lite";
import { CurrentUserStore } from "../Store/User.store";
import projectsStore from "../Store/Projects.store";

const PageHeader = observer(() => {
  const [isOpenProfile, setIsOpenProfile] = useState(false);

  const [user, setUser] = useState();
  const { isOpenLogin, setIsOpenLogin } = useLogin();
  const { isOpenRegistration, setIsOpenRegistration } = useRegistration();

  function Logout() {
    CurrentUserStore.logOut();
  }

  return (
    <div>
      <div className={styles.AccountSettingsModal} onClick={() => projectsStore.changeIsOpenSettings()}>
        {projectsStore.IsOpenSettings ? <AccountSettings /> : null}
      </div>

      <section className={styles.pageHeader}>
        <div className={styles.searchBar}>
          <SearchIcon />
          <input type="text" placeholder="Search" />
          <button>Search</button>
        </div>
        {CurrentUserStore.currentuser?.name === "Test User" && (
          <div className={styles.demoWarning}>Demo Mode</div>
        )}
        <div className={styles.avatar}>
          <div>
            <button className={styles.notification}>
              <NotificationIcon />
            </button>
          </div>
          {!CurrentUserStore.currentuser ? (
            <>
              <div className={styles.SignIn}>
                <button onClick={() => setIsOpenLogin(true)}>Sign In</button>
              </div>
              <div className={styles.SignUp}>
                <button
                  onClick={() => {
                    setIsOpenRegistration(true);
                    setIsOpenLogin(false);
                  }}
                >
                  Sign Up
                </button>
              </div>
            </>
          ) : (
            <div
              className={styles.allAccount}
              onClick={() => setIsOpenProfile(!isOpenProfile)}
            >
              <div className={styles.account}>
                <div className={styles.accountInfo}>
                  <div className={styles.accountAvatar}>
                    {CurrentUserStore.currentuser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.accountDetails}>
                    <p className={styles.accountName}>
                      {CurrentUserStore.currentuser.name}
                    </p>
                    <p className={styles.accountRole}></p>
                  </div>
                </div>
              </div>
              {isOpenProfile && (
                <div className={styles.modalProfile}>
                  <div
                    className={styles.btnProfile}
                    onClick={() => projectsStore.changeIsOpenSettings()}
                  >
                    <button className={styles.settings}>
                      <SettingsIcon />
                    </button>
                    <p>Account settings</p>
                  </div>
                  <div className={styles.btnProfile} onClick={() => Logout()}>
                    <button className={styles.logOut}>
                      <LogoutIcon />
                    </button>
                    <p>Log out</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
});
export default PageHeader;
