import { useEffect, useState } from 'react';

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
