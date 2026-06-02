import axios from "axios";

const api = axios.create({
  baseURL: "https://git-hub-repo-explorer-inky.vercel.app/",
});

export const getUser = async (username) => {
  const response = await api.get(`/api/github/user/${username}`);
  return response.data.data;
};

export const getRepos = async (username, page = 1) => {
  const response = await api.get(
    `/api/github/user/${username}/repos?page=${page}`
  );

  return response.data.data;
};