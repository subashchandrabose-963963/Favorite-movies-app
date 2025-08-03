import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/media";

export interface FavoriteEntry {
  id?: number;
  title: string;
  type: "Movie" | "TV Show";
  director: string;
  budget: string;
  location: string;
  duration: string;
  yearTime: string;
}

export async function fetchFavorites(page: number, size: number = 20) {
  const response = await axios.get(`${API_BASE_URL}/favorites`, {
    params: { page, size },
  });
  return response.data;
}

export async function addFavorite(entry: FavoriteEntry) {
  const response = await axios.post(`${API_BASE_URL}/favorites`, entry);
  return response.data;
}

export async function updateFavorite(id: number, entry: FavoriteEntry) {
  const response = await axios.put(`${API_BASE_URL}/favorites/${id}`, entry);
  return response.data;
}

export async function deleteFavorite(id: number) {
  const response = await axios.delete(`${API_BASE_URL}/favorites/${id}`);
  return response.data;
}
