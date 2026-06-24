import request from "./api";
// Authentication API functions

// Register a new user account
export const signup = (userData) =>
  request("/api/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });
//login user
export const signin = (userData) =>
  request("/api/signin", {
    method: "POST",
    body: JSON.stringify(userData),
  });
//logout user
export const logout = () =>
  request("/api/logout", {
    method: "POST",
  });
// Get currently authenticated user
export const getMe = () =>
  request("/api/me");
export const deleteAc = () =>
  request("/api/user",{method:"DELETE"});