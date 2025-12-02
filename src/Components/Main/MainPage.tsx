import LeftPanel from "./LeftPanel";
import Osnova from "./Osnova";
import style from "../../style/Main/MainPage.module.scss";
function MainPage() {
  return (
    <div className={style.main}>
      <LeftPanel />
      <Osnova />
    </div>
  );
}

export default MainPage;
