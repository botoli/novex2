import { useState } from 'react';
import { mockUsers } from '../MockData/UsersMock';
import { AccountIcon, LogoutIcon, NotificationIcon, SearchIcon, SettingsIcon } from '../UI/Icons';
import styles from './Page.Header.module.scss';
import AccountSettings from '../UI/AccountSettings/AccountSettings';
export default function PageHeader() {
  const [isopenProfile, setIsopenProfile] = useState(false);
  const [isOpenAccountSettings, setIsOpenAccountSettings] = useState(false);

  function OpenModalProfile() {
    isopenProfile === false ? setIsopenProfile(true) : setIsopenProfile(false);
  }
  return (
    <div>
      <div className={styles.AccountSettingsModal}>
        {isOpenAccountSettings && (
          <AccountSettings onclose={() => setIsOpenAccountSettings(!isOpenAccountSettings)} />
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
          {mockUsers.map(
            (user) =>
              user.role === 'Admin' && (
                <div className={styles.allAccount} onClick={OpenModalProfile}>
                  <div className={styles.account}>
                    <div className={styles.accountInfo}>
                      <div className={styles.accountAvatar}>
                        <AccountIcon />
                      </div>
                      <div className={styles.accountDetails}>
                        <p className={styles.accountName}>{user.name}</p>
                        <p className={styles.accountRole}>{user.role}</p>
                      </div>
                    </div>
                  </div>
                  {isopenProfile && (
                    <div className={styles.modalProfile}>
                      <div
                        className={styles.btnProfile}
                        onClick={() => setIsOpenAccountSettings(!isOpenAccountSettings)}>
                        <button className={styles.settings}>
                          <SettingsIcon />
                        </button>
                        <p>Account settings</p>
                      </div>
                      <div className={styles.btnProfile}>
                        <button className={styles.logOut}>
                          <LogoutIcon />
                        </button>
                        <p>Log out</p>
                      </div>
                    </div>
                  )}
                </div>
              ),
          )}
        </div>
      </section>
    </div>
  );
}
