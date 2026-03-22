import apiClient from "@/lib/apiClient";

export const loginApi = (email: string, password: string) => {
  return apiClient.post("/auth/login", { email, password });
};

export const signupApi = (data: {
  email: string;
  password: string;
  username: string;
}) => {
  return apiClient.post("/auth/signup", {
    email: data.email,
    password: data.password,
    name: data.username,
  });
};