import { useEffect, useState } from "react";
import { useRegistration } from "../../context/RegistrarionModal";
import { CloseIcon } from "../../UI/Icons";
import styles from "./Registration.module.scss";
import axios from "axios";
import { nowurl } from "../../fetch/fetchTasks";
import { useUser } from "../../context/UserContext";
// filepath: /workspaces/novex2/novex2/frontend/src/UI/Form/Registration/Registration.tsx

export default function Registration() {
  const { isOpenRegistration, setIsOpenRegistration } = useRegistration();
  const { currentuser, setCurrentuser } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const RegData = {
    name: name,
    email: email,
    password: password,
  };

  const testUser = {
    name: "Test User",
    email: "testUser@test.ru",
    password: "test",
  };
  async function handleRegistration() {
    try {
      const response = await axios.post(nowurl + "users", RegData, {
        headers: { "Content-Type": "application/json" },
      });
      const NewUser = response.data;
      localStorage.setItem("currentuser", JSON.stringify(response.data));
      localStorage.setItem("token", `${response.data.id ?? ""}`);
      setCurrentuser(NewUser);
      setIsOpenRegistration(false);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  }
  function handleTestUser() {
    setCurrentuser(testUser);
    setIsOpenRegistration(false);
    localStorage.setItem("currentuser", JSON.stringify(testUser));
    localStorage.setItem("token", "1");
  }

  return (
    <div className={styles.blur}>
      <div className={styles.registrationContainer}>
        <div
          className={styles.closeIcon}
          onClick={() => setIsOpenRegistration(false)}
        >
          <CloseIcon />
        </div>
        <div className={styles.registrationHeader}>
          <p className={styles.warning}>
            Важно!Не вводите реальные данные, для доступа к системе нажмите на
            кнопку "Test User" или введите любые фиктивные данные.
          </p>
          <h1>Sign Up</h1>
        </div>
        <div className={styles.inputs}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className={styles.buttons}>
          <button className={styles.register} onClick={handleRegistration}>
            Sign Up
          </button>
          <button className={styles.testUser} onClick={() => handleTestUser()}>
            Test User
          </button>
        </div>
      </div>
    </div>
  );
}
