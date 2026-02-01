import axios from "axios";
import { useEffect, useState } from "react";
// Используем прокси /api/ везде (Vite dev proxy + Vercel rewrites)
const API_URL = "/api";
export const nowurl = API_URL;
export function useData(url: string) {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) {
      console.error("API url is missing");
      setError("API url is missing");
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(url);

        setData(response.data || []);
      } catch (err) {
        console.error("Failed to fetch data from:", url, err);
        setError(`Failed to load data from ${url}`);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);
  return { data, setData, error, loading };
}
