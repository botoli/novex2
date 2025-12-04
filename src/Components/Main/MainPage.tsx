import LeftPanel from "./LeftPanel";
import Osnova from "./Osnova";
import style from "../../style/Main/MainPage.module.scss";
import { useEffect } from "react";
function MainPage() {

  
  return (
    <div className={style.main}>
      <LeftPanel />
      <Osnova />
    </div>
  );
}

export default MainPage;
