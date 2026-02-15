import { useLogin } from "../../context/Modal";
import { useRegistration } from "../../context/RegistrarionModal";
import { CloseIcon } from "../../UI/Icons";
import styles from "./login.module.scss";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { CurrentUserStore } from "../../Store/User.store";
import dataStore from "../../Store/Data";
import { Link } from "react-router-dom";
const Login = observer(() => {
  const { isOpenLogin, setIsOpenLogin } = useLogin();
  const { isOpenRegistration, setIsOpenRegistration } = useRegistration();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function LoginValidate() {
    const found = dataStore.users.find(
      (user) => user.email === email && user.password === password,
    );
    if (found) {
      localStorage.setItem("currentuser", JSON.stringify(found));
      localStorage.setItem("token", `${found.id ?? ""}`);
      CurrentUserStore.setCurrentuser(found);
    }
  }
  return (
    <div className={styles.blur}>
      <div className={styles.loginContainer}>
        <div className={styles.closeIcon} onClick={() => setIsOpenLogin(false)}>
          <CloseIcon />
        </div>
        <div className={styles.loginHeader}>
          <h1>Sign In</h1>
        </div>
        <div className={styles.inputs}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Link to="/home">
          <button
            className={styles.Login}
            onClick={() => {
              LoginValidate();
              setIsOpenLogin(false);
            }}
          >
            Sign In
          </button>
        </Link>

        <div className={styles.Signup}>
          Don't have an account?{" "}
          <span
            onClick={() => {
              setIsOpenRegistration(true);
              setIsOpenLogin(false);
            }}
          >
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
});
export default Login;
