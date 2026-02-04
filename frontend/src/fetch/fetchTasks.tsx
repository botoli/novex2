import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
const API_URL = "/api/";
export const nowurl = API_URL;
export function useData(url: string) {
  async function fetchData() {
    const resp = await axios.get(url);
    return resp.data;
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["Api-data", url],
    queryFn: fetchData,
  });

  return { data: data || [], isLoading, isError };
}
