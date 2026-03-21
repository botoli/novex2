import React, { useEffect, useState } from "react";
import styles from "./AccountSettings.module.scss";
import { CloseIcon, GithubIcon } from "../Icons";
import { observer } from "mobx-react-lite";
import projectsStore from "../../Store/Projects.store";
import { CurrentUserStore } from "../../Store/User.store";
import dataStore from "../../Store/Data";
import AvatarStore from "../../Store/Avatar.store";

const AccountSettings = observer(() => {
  const currentUser = dataStore.users.find((user) => user.role === "test");

  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [about, setAbout] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialValues, setInitialValues] = useState({
    username: "",
    email: "",
    password: "",
    about: "",
  });

  useEffect(() => {
    if (currentUser) {
      const avatarValue = currentUser.avatar
        ? `${import.meta.env.VITE_API_URL}${currentUser.avatar}`
        : null;
      const usernameValue = currentUser.name || "";
      const emailValue = currentUser.email || "";
      const passwordValue = currentUser.password || "";
      const aboutValue = currentUser.about || "";

      setAvatar(avatarValue);
      setUsername(usernameValue);
      setEmail(emailValue);
      setPassword(passwordValue);
      setRepeatPassword(passwordValue);
      setAbout(aboutValue);

      setInitialValues({
        username: usernameValue,
        email: emailValue,
        password: passwordValue,
        about: aboutValue,
      });
    }
  }, [currentUser]);

  useEffect(() => {
    const changed =
      username !== initialValues.username ||
      email !== initialValues.email ||
      password !== initialValues.password ||
      about !== initialValues.about ||
      avatarFile !== null;

    setHasChanges(changed);
  }, [username, email, password, about, initialValues, avatarFile]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (password && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (password !== repeatPassword) {
      newErrors.repeatPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function close() {
    projectsStore.changeIsOpenSettings();
  }

  function Logout() {
    CurrentUserStore.logOut();
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setNotification({
        type: "error",
        message: "Please select an image file",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setNotification({ type: "error", message: "Image too large. Max 5MB" });
      return;
    }

    setIsUploading(true);
    setAvatarFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;

      setAvatar(result);
      setIsUploading(false);
      setNotification({
        type: "success",
        message: "Avatar selected! Click 'Update Information' to save.",
      });
    };

    reader.onerror = () => {
      setIsUploading(false);
      setNotification({ type: "error", message: "Failed to read file" });
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = async () => {
    if (!currentUser) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${currentUser.id}/avatar`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) throw new Error("Failed to remove avatar");

      setAvatar(null);
      setAvatarFile(null);
      AvatarStore.setAvatar(null);
      if (currentUser) {
        currentUser.avatar = "";
      }
      setNotification({ type: "success", message: "Avatar removed" });
    } catch (error) {
      setNotification({ type: "error", message: "Failed to remove avatar" });
    }
  };

  const handleReset = () => {
    setUsername(initialValues.username);
    setEmail(initialValues.email);
    setPassword(initialValues.password);
    setRepeatPassword(initialValues.password);
    setAbout(initialValues.about);

    setAvatarFile(null);
    setErrors({});

    // Восстанавливаем исходный аватар
    if (currentUser) {
      const avatarValue = currentUser.avatar
        ? `${import.meta.env.VITE_API_URL}${currentUser.avatar}`
        : null;
      setAvatar(avatarValue);
      AvatarStore.setAvatar(avatarValue);
    }

    setNotification({ type: "success", message: "Changes discarded" });
  };

  return (
    <div>
      <div className={styles.overlay} onClick={close}></div>

      <div
        className={styles.allAccountSettings}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {notification && (
          <div
            className={`${styles.notification} ${styles[notification.type]}`}
          >
            {notification.message}
          </div>
        )}

        <div className={styles.header}>
          <h1>Profile</h1>
          {hasChanges && (
            <span className={styles.unsavedBadge}>Unsaved changes</span>
          )}
          <div className={styles.icon} onClick={close}>
            <CloseIcon />
          </div>
        </div>

        <div className={styles.modalBody}>
          <aside className={styles.leftCol}>
            <div className={styles.avatarWrap}>
              <div
                className={`${styles.avatar} ${isUploading ? styles.uploading : ""}`}
              >
                {isUploading && <div className={styles.spinner}></div>}
                {avatar ? (
                  <img
                    src={avatar}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                      opacity: isUploading ? 0.3 : 1,
                    }}
                  />
                ) : (
                  <div className={styles.avatarInitials}>
                    {(currentUser?.name || "").slice(0, 1)}
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: "none" }}
                id="avatar-upload"
                disabled={isUploading}
              />
              <div className={styles.avatarActions}>
                <label
                  htmlFor="avatar-upload"
                  className={`${styles.uploadBtn} ${isUploading ? styles.disabled : ""}`}
                >
                  {isUploading ? "Uploading..." : "Upload Picture"}
                </label>
                {avatar && !isUploading && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className={styles.removeBtn}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <ul className={styles.socials}>
              <li>
                <button className={styles.socialBtn}>
                  <GithubIcon />
                </button>
                <span>Add Facebook</span>
              </li>
              <li>
                <button className={styles.socialBtn}>T</button>
                <span>Add Twitter</span>
              </li>
              <li>
                <button className={styles.socialBtn}>I</button>
                <span>Add Instagram</span>
              </li>
              <li>
                <button className={styles.socialBtn}>G+</button>
                <span>Add Google+</span>
              </li>
            </ul>
          </aside>

          <main className={styles.contentCol}>
            <form
              className={styles.form}
              onSubmit={async (e) => {
                e.preventDefault();

                if (!validateForm()) {
                  setNotification({
                    type: "error",
                    message: "Please fix the errors",
                  });
                  return;
                }

                if (!currentUser) {
                  setNotification({
                    type: "error",
                    message: "User not found",
                  });
                  return;
                }

                setIsSaving(true);

                try {
                  const formData = new FormData();
                  formData.append("username", username);
                  formData.append("email", email);
                  formData.append("about", about);

                  if (password && password.trim() !== "") {
                    formData.append("password", password);
                  }

                  if (avatarFile) {
                    formData.append("avatar", avatarFile);
                  } else {
                  }

                  const url = `${import.meta.env.VITE_API_URL}/users/${currentUser.id}`;

                  const response = await fetch(url, {
                    method: "PUT",
                    body: formData,
                  });

                  if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(
                      `Failed to update profile: ${response.status} ${errorText}`,
                    );
                  }

                  const responseText = await response.text();

                  const data = JSON.parse(responseText);

                  // Обновляем currentUser
                  if (currentUser && data.user) {
                    currentUser.name = data.user.name;
                    currentUser.email = data.user.email;
                    currentUser.about = data.user.about;
                    currentUser.avatar = data.user.avatar;

                    if (data.user.password) {
                      currentUser.password = data.user.password;
                    }
                  }

                  // Обновляем начальные значения
                  setInitialValues({
                    username,
                    email,
                    password,
                    about,
                  });

                  setAvatarFile(null);

                  // Обновляем отображаемый аватар
                  if (data.avatarUrl) {
                    const newAvatarUrl = `${import.meta.env.VITE_API_URL}${data.avatarUrl}`;
                    setAvatar(newAvatarUrl);
                    AvatarStore.setAvatar(newAvatarUrl);
                  }

                  setNotification({
                    type: "success",
                    message: "✓ Information updated successfully!",
                  });
                } catch (error) {
                  console.error("Update error:", error);
                  setNotification({
                    type: "error",
                    message: "Failed to update information",
                  });
                } finally {
                  setIsSaving(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <label className={errors.username ? styles.hasError : ""}>
                Username:
                <input
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) {
                      const newErrors = { ...errors };
                      delete newErrors.username;
                      setErrors(newErrors);
                    }
                  }}
                  className={errors.username ? styles.errorInput : ""}
                />
                {errors.username && (
                  <span className={styles.errorText}>{errors.username}</span>
                )}
              </label>

              <label>
                Role:
                <input value={currentUser?.role || ""} readOnly />
              </label>

              <label className={errors.email ? styles.hasError : ""}>
                E-mail:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      const newErrors = { ...errors };
                      delete newErrors.email;
                      setErrors(newErrors);
                    }
                  }}
                  className={errors.email ? styles.errorInput : ""}
                />
                {errors.email && (
                  <span className={styles.errorText}>{errors.email}</span>
                )}
              </label>

              <label className={errors.password ? styles.hasError : ""}>
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      const newErrors = { ...errors };
                      delete newErrors.password;
                      setErrors(newErrors);
                    }
                  }}
                  className={errors.password ? styles.errorInput : ""}
                  placeholder="Leave empty to keep current"
                />
                {errors.password && (
                  <span className={styles.errorText}>{errors.password}</span>
                )}
              </label>

              <label className={errors.repeatPassword ? styles.hasError : ""}>
                Repeat Password:
                <input
                  type="password"
                  value={repeatPassword}
                  onChange={(e) => {
                    setRepeatPassword(e.target.value);
                    if (errors.repeatPassword) {
                      const newErrors = { ...errors };
                      delete newErrors.repeatPassword;
                      setErrors(newErrors);
                    }
                  }}
                  className={errors.repeatPassword ? styles.errorInput : ""}
                  placeholder="Repeat password"
                />
                {errors.repeatPassword && (
                  <span className={styles.errorText}>
                    {errors.repeatPassword}
                  </span>
                )}
              </label>

              <label>
                About Me:
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </label>

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={handleReset}
                  className={styles.resetBtn}
                  disabled={!hasChanges || isSaving}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className={styles.updateBtn}
                  disabled={!hasChanges || isSaving}
                  onClick={(e) => {}}
                >
                  {isSaving ? (
                    <>
                      <span className={styles.btnSpinner}></span>
                      Saving...
                    </>
                  ) : (
                    "Update Information"
                  )}
                </button>
              </div>
            </form>
          </main>

          <nav className={styles.rightCol}>
            <ul className={styles.tabs}>
              <li className={styles.active}>Profile</li>
              <li>Statistics</li>
              <li>Get Help</li>
              <li>Settings</li>
              <li onClick={Logout}>Sign Out</li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
});

export default AccountSettings;
