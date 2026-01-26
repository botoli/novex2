import { useEffect, useState } from "react";
const API_URL = import.meta.env.REACT_APP_API_URL;
export const nowurl = API_URL;
export function useData(url) {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        setData(data);
      });
  }, []);
  return { data, setData };
}
