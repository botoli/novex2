import React, { useState } from "react";
import LeftPanel from "./LeftPanel";
import Hero from "./Hero";
import Dashboard from "./Dashboard";
import ProjectsPage from "./ProjectsPage";
import style from "../../style/Main/MainPage.module.scss";

type Page = "main" | "projects";

function MainPage() {
  const [currentPage, setCurrentPage] = useState<Page>("main");

  const renderContent = () => {
    switch (currentPage) {
      case "projects":
        return <ProjectsPage />;
      case "main":
      default:
        return (
          <div className={style.contentColumn}>
            <Hero />
            <Dashboard />
          </div>
        );
    }
  };

  return (
    <div className={style.mainContainer}>
      <div className={style.leftPanelContainer}>
        <LeftPanel onPageChange={setCurrentPage} />
      </div>
      <div className={style.contentContainer}>{renderContent()}</div>
    </div>
  );
}

export default MainPage;
