import { useState } from "react";
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
import { useUser } from "../context/UserContext";
export default function PageHeader() {
  const { data: projects, setData: setProjects } = useData(nowurl + "projects");
  const { data: tasks, setData: setTasks } = useData(nowurl + "tasks");
  const { data: users, setData: setUser } = useData(nowurl + "users");

  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [isOpenAccountSettings, setIsOpenAccountSettings] = useState(false);

  const { isOpenLogin, setIsOpenLogin } = useLogin();
  const { isOpenRegistration, setIsOpenRegistration } = useRegistration();
  const { currentuser, setCurrentuser } = useUser();
  function Logout() {
    localStorage.removeItem("currentuser");
    localStorage.removeItem("token");
    setCurrentuser(null);
  }

  return (
    <div>
      <div className={styles.AccountSettingsModal}>
        {isOpenAccountSettings && (
          <AccountSettings
            onclose={() => setIsOpenAccountSettings(!isOpenAccountSettings)}
          />
        )}
      </div>
      <section className={styles.pageHeader}>
        <div className={styles.searchBar}>
          <SearchIcon />
          <input type="text" placeholder="Search" />
          <button>Search</button>
        </div>

        <div className={styles.avatar}>
          <div>
            <button>
              <NotificationIcon />
            </button>
          </div>
          {!currentuser ? (
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
                    <AccountIcon />
                  </div>
                  <div className={styles.accountDetails}>
                    <p className={styles.accountName}>{currentuser.name}</p>
                    <p className={styles.accountRole}></p>
                  </div>
                </div>
              </div>
              {isOpenProfile && (
                <div className={styles.modalProfile}>
                  <div
                    className={styles.btnProfile}
                    onClick={() =>
                      setIsOpenAccountSettings(!isOpenAccountSettings)
                    }
                  >
                    <button className={styles.settings}>
                      <SettingsIcon />
                    </button>
                    <p>Account settings</p>
                  </div>
                  <div className={styles.btnProfile}>
                    <button className={styles.logOut}>
                      <LogoutIcon />
                    </button>
                    <p onClick={() => Logout()}>Log out</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
