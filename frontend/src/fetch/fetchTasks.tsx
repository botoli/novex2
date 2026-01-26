import axios from "axios";
import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;
export const nowurl = API_URL;
export function useData(url: string) {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    if (!url) {
      console.error("API url is missing");
      return;
    }
    const fetchData = async () => {
      const response = await axios.get(url);
      setData(response.data);
    };
    fetchData();
  }, [url]);
  return { data, setData };
}
