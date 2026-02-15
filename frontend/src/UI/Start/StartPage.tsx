import { observer } from "mobx-react-lite";
import styles from "./Start.module.scss";
import { useLogin } from "../../context/Modal";
import { CurrentUserStore } from "../../Store/User.store";
import { Link } from "react-router-dom";
import { languageStore } from "../../Store/Language.store";
import { useState, useRef, useEffect } from "react";
import Login from "../../common/Login/Login";
import Registration from "../../common/Registration/Registration";
import { useRegistration } from "../../context/RegistrarionModal";
import dataStore from "../../Store/Data";

const flags: Record<string, string> = { ru: "🇷🇺", en: "🇺🇸" };
const langLabels: Record<string, string> = { ru: "Русский", en: "English" };

const StartPage = observer(() => {
  const { isOpenRegistration, setIsOpenRegistration } = useRegistration();
  const { isOpenLogin, setIsOpenLogin } = useLogin();
  const t = languageStore.t;
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleTestUser() {
    const testUser = {
      name: "Test User",
      email: "testUser@test.ru",
      password: "test",
    };
    CurrentUserStore.setCurrentuser(testUser);
    localStorage.setItem("token", "1");
  }

  return (
    <div className={styles.startPageContainer}>
      {/* Language Switcher - Top Right */}
      {isOpenLogin ? <Login /> : null}
      {isOpenRegistration ? <Registration /> : null}
      <div className={styles.topBar}>
        <div className={styles.langSwitcher} ref={langRef}>
          <button
            className={styles.langButton}
            onClick={() => setLangOpen(!langOpen)}
          >
            <span className={styles.langFlag}>{flags[languageStore.lang]}</span>
            <span>{langLabels[languageStore.lang]}</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {langOpen && (
            <div className={styles.langDropdown}>
              {(["ru", "en"] as const).map((lang) => (
                <button
                  key={lang}
                  className={`${styles.langOption} ${languageStore.lang === lang ? styles.langOptionActive : ""}`}
                  onClick={() => {
                    languageStore.setLang(lang);
                    setLangOpen(false);
                  }}
                >
                  <span className={styles.langFlag}>{flags[lang]}</span>
                  <span>{langLabels[lang]}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hero */}
      <section className={styles.heroSection}>
        <h1 className={styles.mainTitle}>{t.welcome}</h1>
        <p className={styles.heroDescription}>{t.heroDesc}</p>

        {/* Login Cards */}
        <div className={styles.loginActions}>
          {/* User Login Card */}
          <div className={styles.loginCard}>
            <div className={styles.loginCardHeader}>
              <div className={styles.loginCardIcon}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--dracula-purple)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <h3>{t.loginAsUser}</h3>
                <p className={styles.loginCardSub}>{t.loginAsUserSub}</p>
              </div>
            </div>
            <button
              className={styles.loginCardButton}
              onClick={() => setIsOpenLogin(true)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {t.login}
            </button>
            <a
              className={styles.loginCardLink}
              onClick={() => setIsOpenLogin(true)}
            >
              {t.loginAsUserSub} &nbsp;→
            </a>
          </div>

          {/* Test User Card */}
          <div className={styles.loginCard}>
            <div className={styles.loginCardHeader}>
              <div className={styles.loginCardIconGreen}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--dracula-green)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <div>
                <h3>{t.loginAsTest}</h3>
                <p className={styles.loginCardSub}>{t.loginAsTestSub}</p>
              </div>
            </div>
            <Link to="/home">
              <button
                className={styles.loginCardButtonGreen}
                onClick={handleTestUser}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
                {t.login}
              </button>
            </Link>
            <a className={styles.loginCardLink} onClick={handleTestUser}>
              {t.loginAsTestSub} &nbsp;→
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider}>
          <span>{t.or}</span>
        </div>

        {/* Quick Feature Cards */}
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--dracula-orange)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <h3>{t.manageTasks}</h3>
            <p>{t.manageTasksDesc}</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--dracula-cyan)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3>{t.followTeam}</h3>
            <p>{t.followTeamDesc}</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--dracula-green)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3>{t.analyzeProgress}</h3>
            <p>{t.analyzeProgressDesc}</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statItem}>
          <h3 className={styles.statNumber}>{dataStore.users.length}</h3>
          <p className={styles.statLabel}>{t.activeUsers}</p>
        </div>
        <div className={styles.statItem}>
          <h3 className={styles.statNumber}>
            {dataStore.tasks.filter((t) => t.status === "completed").length}
          </h3>
          <p className={styles.statLabel}>{t.completedTasks}</p>
        </div>
        <div className={styles.statItem}>
          <h3 className={styles.statNumber}>99.9%</h3>
          <p className={styles.statLabel}>{t.uptime}</p>
        </div>
        <div className={styles.statItem}>
          <h3 className={styles.statNumber}>24/7</h3>
          <p className={styles.statLabel}>{t.support}</p>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section className={styles.detailSection}>
        <h2 className={styles.sectionTitle}>{t.platformFeatures}</h2>
        <div className={styles.detailGrid}>
          <div className={styles.detailCard}>
            <div className={styles.detailIcon}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--dracula-purple)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <div>
              <h4>{t.kanban}</h4>
              <p>{t.kanbanDesc}</p>
            </div>
          </div>

          <div className={styles.detailCard}>
            <div className={styles.detailIcon}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--dracula-cyan)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <h4>{t.deadlines}</h4>
              <p>{t.deadlinesDesc}</p>
            </div>
          </div>

          <div className={styles.detailCard}>
            <div className={styles.detailIcon}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--dracula-green)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20V10" />
                <path d="M18 20V4" />
                <path d="M6 20v-4" />
              </svg>
            </div>
            <div>
              <h4>{t.analytics}</h4>
              <p>{t.analyticsDesc}</p>
            </div>
          </div>

          <div className={styles.detailCard}>
            <div className={styles.detailIcon}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--dracula-orange)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <h4>{t.teamChat}</h4>
              <p>{t.teamChatDesc}</p>
            </div>
          </div>

          <div className={styles.detailCard}>
            <div className={styles.detailIcon}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--dracula-pink)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h4>{t.integrations}</h4>
              <p>{t.integrationsDesc}</p>
            </div>
          </div>

          <div className={styles.detailCard}>
            <div className={styles.detailIcon}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--dracula-yellow)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a10 10 0 0 1 0 20 10 10 0 0 1 0-20z" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <div>
              <h4>{t.aiAssistant}</h4>
              <p>{t.aiAssistantDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howSection}>
        <h2 className={styles.sectionTitle}>{t.howItWorks}</h2>
        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>1</div>
            <h4>{t.step1Title}</h4>
            <p>{t.step1Desc}</p>
          </div>
          <div className={styles.stepArrow}>→</div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>2</div>
            <h4>{t.step2Title}</h4>
            <p>{t.step2Desc}</p>
          </div>
          <div className={styles.stepArrow}>→</div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>3</div>
            <h4>{t.step3Title}</h4>
            <p>{t.step3Desc}</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <h2>{t.readyToStart}</h2>
        <p>{t.readyToStartDesc}</p>
        <div className={styles.ctaButtons}>
          <button
            className={styles.loginCardButton}
            onClick={() => setIsOpenLogin(true)}
          >
            {t.startFree}
          </button>
          <Link to="/home">
            <button
              className={styles.loginCardButtonGreen}
              onClick={handleTestUser}
            >
              {t.tryDemo}
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <a href="#">{t.privacy}</a>
        <span className={styles.footerDot}>•</span>
        <a href="#">{t.terms}</a>
      </footer>
    </div>
  );
});

export default StartPage;
