import React, { useState } from "react";
import styles from "./AccountSettings.module.scss";
import { CloseIcon, LogoIcon, LogoutIcon } from "../Icons";
import { nowurl, useData } from "../../fetch/fetchTasks";
export default function AccountSettings({ onclose }) {
  const { data: users, setData: setUsers } = useData(nowurl + "users");

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

        {users.map(
          (user) =>
            user.role === "Admin" && (
              <div className={styles.userInfo}>
                <div className={styles.allinfo}>
                  <div className={styles.info}>
                    <p>Name</p>
                    <div>{user.name}</div>
                    <button>Change</button>
                  </div>
                  <div className={styles.info}>
                    <p>Role</p>
                    <div>{user.role}</div>
                    <button>Change</button>
                  </div>
                  <div className={styles.info}>
                    <p>GitHub</p>
                    <div>{user.github ? user.github : "Привяжите github"}</div>
                    <button className={styles.gitconnect}>Connect</button>
                  </div>
                  <div className={styles.info}>
                    <p>Email</p>
                    <div>{user.email}</div>
                    <button>Change</button>
                  </div>
                  <div className={styles.info}>
                    <p>Password</p>
                    <div>{user.password}</div>
                    <button>Change</button>
                  </div>
                </div>
                <div className={styles.logOut}>
                  <p>Loh out</p>
                  <button className={styles.logOutBtn}>
                    <p>Loh out</p>
                  </button>
                </div>
                <div className={styles.logOut}>
                  <p>Delete account</p>
                  <button className={styles.logOutBtn}>
                    <p>Delete account</p>
                  </button>
                </div>
              </div>
            ),
        )}
      </div>
    </div>
  );
}
