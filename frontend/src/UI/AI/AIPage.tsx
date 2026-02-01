import React from "react";
import styles from "./AIPage.module.scss";
import PageHeader from "../../common/PageHeader";
import { AIIcon } from "../Icons";
import Registration from "../../common/Registration/Registration";
import { useLogin } from "../../context/Modal";
import { useRegistration } from "../../context/RegistrarionModal";
import Login from "../../common/Login/Login";

export default function AIPage() {
  const { isOpenRegistration, setIsOpenRegistration } = useRegistration();
  const { isOpenLogin, setIsOpenLogin } = useLogin();
  return (
    <div className={styles.aiContainer}>
      <PageHeader />

      {isOpenLogin ? <Login /> : null}
      {isOpenRegistration ? <Registration /> : null}
      <section className={styles.dashboard}>
        <h1>AI</h1>

        <div className={styles.chatContainer}>
          {/* Chat Messages Area */}
          <div className={styles.messagesArea}>
            <div className={styles.message}>
              <div className={styles.messageAvatar}>
                <AIIcon width={24} height={24} />
              </div>
              <div className={styles.messageContent}>
                <div className={styles.messageHeader}>
                  <span className={styles.messageAuthor}>AI Assistant</span>
                  <span className={styles.messageTime}>10:30 AM</span>
                </div>
                <div className={styles.messageText}>
                  Hello! How can I help you today? I can assist with code
                  analysis, debugging, or answer questions about your projects.
                </div>
              </div>
            </div>

            <div className={`${styles.message} ${styles.userMessage}`}>
              <div className={styles.messageAvatar}>
                <span>U</span>
              </div>
              <div className={styles.messageContent}>
                <div className={styles.messageHeader}>
                  <span className={styles.messageAuthor}>You</span>
                  <span className={styles.messageTime}>10:32 AM</span>
                </div>
                <div className={styles.messageText}>
                  Can you help me refactor this component to use TypeScript?
                </div>
              </div>
            </div>

            <div className={styles.message}>
              <div className={styles.messageAvatar}>
                <AIIcon width={24} height={24} />
              </div>
              <div className={styles.messageContent}>
                <div className={styles.messageHeader}>
                  <span className={styles.messageAuthor}>AI Assistant</span>
                  <span className={styles.messageTime}>10:33 AM</span>
                </div>
                <div className={styles.messageText}>
                  Of course! I'd be happy to help you refactor your component to
                  TypeScript. Please share the component code you'd like to
                  refactor, and I'll provide suggestions and improvements.
                </div>
              </div>
            </div>
          </div>

          {/* Chat Input Area */}
          <div className={styles.inputArea}>
            <div className={styles.inputContainer}>
              <textarea
                className={styles.chatInput}
                placeholder="Type your message here..."
                rows={3}
              />
              <div className={styles.inputActions}>
                <button className={styles.attachButton}>📎</button>
                <button className={styles.sendButton}>Send</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
