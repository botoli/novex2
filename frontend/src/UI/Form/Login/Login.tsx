import styles from './login.module.scss';
export default function Login() {
  return (
    <div>
      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <h1>Login</h1>
        </div>
        <div className={styles.inputs}>
          <input type="text" placeholder="Email" />
          <input type="text" placeholder="Password" />
        </div>
        <button className={styles.Login}>Login</button>
      </div>
    </div>
  );
}
