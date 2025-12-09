import React from "react";
import styles from "../../style/Main/SimplePage.module.scss";

type SettingCard = {
  id: number;
  title: string;
  description: string;
  badge?: string;
  tone?: "info" | "success";
  icon?: string;
};

const settings: SettingCard[] = [
  {
    id: 1,
    title: "Профиль и аккаунт",
    description:
      "Управляйте личной информацией, аватаром и контактными данными.",
    icon: "variant=1.svg",
  },
  {
    id: 2,
    title: "Внешний вид",
    description: "Настройте тему, шрифты и плотность отображения интерфейса.",
    badge: "Новинка",
    tone: "info",
    icon: "variant=2.svg",
  },
  {
    id: 3,
    title: "Язык и регион",
    description: "Выберите язык интерфейса и настройки формата даты/времени.",
    icon: "variant=3.svg",
  },
  {
    id: 4,
    title: "Уведомления",
    description: "Настройте, какие события отправлять в почту и мессенджеры.",
    badge: "Рекомендуется",
    tone: "info",
    icon: "variant=4.svg",
  },
  {
    id: 5,
    title: "Безопасность",
    description: "Двухфакторная аутентификация и управление устройствами.",
    badge: "Активно",
    tone: "success",
    icon: "variant=5.svg",
  },
  {
    id: 6,
    title: "Интеграции",
    description:
      "Подключите Jira, Slack или GitHub, чтобы синхронизировать работу.",
    icon: "variant=6.svg",
  },
  {
    id: 7,
    title: "Подписка и биллинг",
    description:
      "Управляйте тарифным планом, способами оплаты и историей платежей.",
    icon: "variant=7.svg",
  },
  {
    id: 8,
    title: "Конфиденциальность",
    description: "Настройте видимость профиля и управление данными.",
    icon: "variant=8.svg",
  },
  {
    id: 9,
    title: "Доступность",
    description: "Настройте параметры для улучшения доступности интерфейса.",
    icon: "variant=9.svg",
  },
  {
    id: 10,
    title: "Экспорт данных",
    description:
      "Скачайте архив с вашими данными или перенесите их в другой сервис.",
    icon: "variant=10.svg",
  },
  {
    id: 11,
    title: "Удаление аккаунта",
    description: "Удалите аккаунт и все связанные с ним данные.",
    tone: "info",
    icon: "variant=11.svg",
  },
];

const SettingsPage: React.FC = () => {
  const getBadgeClass = (tone?: SettingCard["tone"]) => {
    if (tone === "success") return `${styles.badge} ${styles.badgeSuccess}`;
    if (tone === "info") return `${styles.badge} ${styles.badgeInfo}`;
    return styles.badge;
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Настройки</h1>
        <p className={styles.pageSubtitle}>
          Управляйте личными настройками, интеграциями и безопасностью учетной
          записи.
        </p>
      </div>

      <div className={styles.cardsGrid}>
        {settings.map((setting) => (
          <div key={setting.id} className={styles.card}>
            <h3 className={styles.cardTitle}>
              {setting.icon && (
                <img
                  src={`/src/assets/icons/${setting.icon}`}
                  alt=""
                  className={styles.cardIcon}
                />
              )}
              {setting.title}
            </h3>
            <p className={styles.cardText}>{setting.description}</p>
            <div className={styles.metaRow}>
              {setting.badge && (
                <span className={getBadgeClass(setting.tone)}>
                  {setting.badge}
                </span>
              )}
              <span className={styles.badge}>Доступно всем членам</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
