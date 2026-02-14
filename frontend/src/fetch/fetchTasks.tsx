import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";

const API_URL = "/api/";
export const nowurl = API_URL;

export function useData(url: string) {
  const queryClient = useQueryClient();
  const [isPosting, setIsPosting] = useState(false);

  async function fetchData() {
    const resp = await axios.get(url);
    return resp.data;
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["Api-data", url],
    queryFn: fetchData,
  });

  const post = async function (payload: any) {
    setIsPosting(true);
    try {
      const resp = await axios.post(url, payload);
      await queryClient.invalidateQueries({
        queryKey: ["Api-data", url],
      });
      return resp.data;
    } finally {
      setIsPosting(false);
    }
  };

  return {
    data: data || [],
    isLoading,
    isError,
    post,
    postStatus: isPosting ? "loading" : "idle",
  };
}
