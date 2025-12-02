import React from "react";
import style from "../../style/Main/Osnova.module.scss";
import { osnovaIcons } from "../../assets/LeftPanel/index.js";

const Osnova = () => {
  return (
    <div className={style.container}>
      <header className={style.header}>
        <div className={style.topBar}>
          <div className={style.logo}>
            <h1 className={style.title}>Novex</h1>
            <p className={style.subtitle}>
              Интеллектуальное рабочее пространство для современных команд
            </p>
          </div>

          <div className={style.topButtons}>
            {osnovaIcons.map((icon) => (
              <button key={icon.name} className={style.topButton}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d={icon.icon}
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div className={style.bottomBar}>
          <div className={style.statusBlock}>
            <span>Текущий спринт:</span> Спринт 24
          </div>
          <div className={style.statusBlock}>
            <span>Команда:</span> Продукт & Дизайн
          </div>
          <div className={style.statusBlockAI}>
            <span>Статус ИИ:</span> <span className={style.dot}>●</span> Активен
          </div>
        </div>
      </header>

      <div className={style.quickActions}>
        <button className={style.quickBtn}>
          <div className={style.quickIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
              <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="2" />
              <circle cx="12" cy="12" r="2" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <span>Создать задачу</span>
        </button>

        <button className={style.quickBtn}>
          <div className={style.quickIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 3.12805C16.8578 3.35042 17.6174 3.85132 18.1597 4.55211C18.702 5.25291 18.9962 6.11394 18.9962 7.00005C18.9962 7.88616 18.702 8.74719 18.1597 9.44799C17.6174 10.1488 16.8578 10.6497 16 10.8721"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 21V19C21.9993 18.1137 21.7044 17.2528 21.1614 16.5523C20.6184 15.8519 19.8581 15.3516 19 15.13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span>Командный чат</span>
        </button>

        <button className={style.quickBtn}>
          <div className={style.quickIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
                stroke="white"
                strokeWidth="2"
              />
              <path
                d="M16 2V6M8 2V6M3 10H21"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span>Расписание</span>
        </button>

        <button className={style.quickBtn}>
          <div className={style.quickIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3H16L20 7V12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 3V7H20"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 14H15M9 17H12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span>Быстрая заметка</span>
        </button>
      </div>

      <div className={style.projectsSection}>
        <div className={style.sectionHeader}>
          <div className={style.sectionTitle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8" stroke="#667EEA" strokeWidth="2" />
              <circle cx="12" cy="12" r="4" stroke="#667EEA" strokeWidth="2" />
            </svg>
            <h2>Активные проекты</h2>
          </div>
          <button className={style.viewAll}>Смотреть все →</button>
        </div>

        <div className={style.projectCards}>
          {/* Проект 1 */}
          <div className={style.projectCard}>
            <div className={style.projectHeader}>
              <div className={style.projectName}>
                <h3>Редизайн продукта</h3>
                <span className={style.statusActive}>активен</span>
              </div>
              <div className={style.projectStats}>
                <div className={style.stat}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 3.12805C16.8578 3.35042 17.6174 3.85132 18.1597 4.55211C18.702 5.25291 18.9962 6.11394 18.9962 7.00005C18.9962 7.88616 18.702 8.74719 18.1597 9.44799C17.6174 10.1488 16.8578 10.6497 16 10.8721"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 21V19C21.9993 18.1137 21.7044 17.2528 21.1614 16.5523C20.6184 15.8519 19.8581 15.3516 19 15.13"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>5</span>
                </div>
                <div className={style.stat}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="8"
                      cy="8"
                      r="6"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="8"
                      cy="8"
                      r="3"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <span>12</span>
                </div>
              </div>
            </div>
            <div className={style.progressContainer}>
              <div className={style.progressLabel}>
                <span>Прогресс</span>
                <span>75%</span>
              </div>
              <div className={style.progressBar}>
                <div
                  className={style.progressFill}
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Проект 2 */}
          <div className={style.projectCard}>
            <div className={style.projectHeader}>
              <div className={style.projectName}>
                <h3>Маркетинговая кампания</h3>
                <span className={style.statusActive}>активен</span>
              </div>
              <div className={style.projectStats}>
                <div className={style.stat}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 3.12805C16.8578 3.35042 17.6174 3.85132 18.1597 4.55211C18.702 5.25291 18.9962 6.11394 18.9962 7.00005C18.9962 7.88616 18.702 8.74719 18.1597 9.44799C17.6174 10.1488 16.8578 10.6497 16 10.8721"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 21V19C21.9993 18.1137 21.7044 17.2528 21.1614 16.5523C20.6184 15.8519 19.8581 15.3516 19 15.13"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>3</span>
                </div>
                <div className={style.stat}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="8"
                      cy="8"
                      r="6"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="8"
                      cy="8"
                      r="3"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <span>8</span>
                </div>
              </div>
            </div>
            <div className={style.progressContainer}>
              <div className={style.progressLabel}>
                <span>Прогресс</span>
                <span>45%</span>
              </div>
              <div className={style.progressBar}>
                <div
                  className={style.progressFill}
                  style={{ width: "45%" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Проект 3 */}
          <div className={style.projectCard}>
            <div className={style.projectHeader}>
              <div className={style.projectName}>
                <h3>Интеграция API</h3>
                <span className={style.statusReview}>на проверке</span>
              </div>
              <div className={style.projectStats}>
                <div className={style.stat}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 3.12805C16.8578 3.35042 17.6174 3.85132 18.1597 4.55211C18.702 5.25291 18.9962 6.11394 18.9962 7.00005C18.9962 7.88616 18.702 8.74719 18.1597 9.44799C17.6174 10.1488 16.8578 10.6497 16 10.8721"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 21V19C21.9993 18.1137 21.7044 17.2528 21.1614 16.5523C20.6184 15.8519 19.8581 15.3516 19 15.13"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>4</span>
                </div>
                <div className={style.stat}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="8"
                      cy="8"
                      r="6"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="8"
                      cy="8"
                      r="3"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <span>3</span>
                </div>
              </div>
            </div>
            <div className={style.progressContainer}>
              <div className={style.progressLabel}>
                <span>Прогресс</span>
                <span>90%</span>
              </div>
              <div className={style.progressBar}>
                <div
                  className={style.progressFill}
                  style={{ width: "90%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={style.activitySection}>
        <div className={style.sectionHeader}>
          <div className={style.sectionTitle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#667EEA" strokeWidth="2" />
              <path
                d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20"
                stroke="#667EEA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h2>Недавняя активность</h2>
          </div>
        </div>

        <div className={style.activityList}>
          <div className={style.activityItem}>
            <div className={style.avatar}>Ж</div>
            <div className={style.activityContent}>
              <p>Жирный Жид завершила проверку дизайна</p>
              <span>5 минут назад</span>
            </div>
          </div>
          <div className={style.activityItem}>
            <div className={style.avatar}>Е</div>
            <div className={style.activityContent}>
              <p>Ебаное чмо прокомментировал дорожную карту</p>
              <span>12 минут назад</span>
            </div>
          </div>
          <div className={style.activityItem}>
            <div className={style.avatar}>Т</div>
            <div className={style.activityContent}>
              <p>ТЦК создал новый спринт</p>
              <span>1 час назад</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Osnova;
