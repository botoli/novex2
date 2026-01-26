import { useState } from "react";
import { nowurl } from "../../fetch/fetchTasks";
const [isConnected, setIsConnected] = useState(false);
export default function connectGithub() {
  const GITHUB_CLIENT_ID = "Ov23liBymmsLTOkVE4cN"; // Вставь сюда реальный ID
  const REDIRECT_URI = nowurl + "github/callback";
  function handleConnect() {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo`;

    window.open(authUrl, "_blank"); // Открывает в новой вкладке
    setIsConnected(true);
  }
}
