import React, { useState } from "react";
import styles from "./AccountSettings.module.scss";
import { CloseIcon, LogoIcon, LogoutIcon } from "../Icons";
import { nowurl, useData } from "../../fetch/fetchTasks";
import { useUser } from "../../context/UserContext";
export default function AccountSettings({ onclose }) {
  const { data: users } = useData(nowurl + "users");
  const token = localStorage.getItem("token");
  const currentUser = users.find((user) => user.id === Number(token));
  const { currentuser, setCurrentuser } = useUser();

  function Logout() {
    localStorage.removeItem("currentuser");
    localStorage.removeItem("token");

    setCurrentuser(null);
  }
  return (
    <div>
      <div className={styles.overlay} onClick={onclose}></div>
      <div className={styles.allAccountSettings}>
        <div className={styles.header} onClick={onclose}>
          <h1>Account Settings</h1>
          <div className={styles.icon}>
            <CloseIcon />
          </div>
        </div>

        {currentUser && (
          <div className={styles.userInfo}>
            <div className={styles.allinfo}>
              <div className={styles.info}>
                <p>Name</p>
                <div>{currentUser.name}</div>
                <button>Change</button>
              </div>
              <div className={styles.info}>
                <p>Role</p>
                <div>{currentUser.role}</div>
                <button>Change</button>
              </div>
              <div className={styles.info}>
                <p>GitHub</p>
                <div>
                  {currentUser.github ? currentUser.github : "Привяжите github"}
                </div>
                <button className={styles.gitconnect}>Connect</button>
              </div>
              <div className={styles.info}>
                <p>Email</p>
                <div>{currentUser.email}</div>
                <button>Change</button>
              </div>
              <div className={styles.info}>
                <p>Password</p>
                <div>{currentUser.password}</div>
                <button>Change</button>
              </div>
            </div>
            <div className={styles.logOut}>
              <p>Log out</p>
              <button className={styles.logOutBtn} onClick={() => Logout()}>
                <p>Log out</p>
              </button>
            </div>

            {currentUser?.name === "Test User" ? null : (
              <div className={styles.logOut}>
                <button className={styles.logOutBtn}>
                  <p>Delete account</p>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
