import { api } from "./api";

export async function fetchData(endpoint: string) {
  try {
    const { data } = await api.get(endpoint);
    return data;
  } catch (error) {
    console.log(error);
  }
}
