export const getUserId = () => {
  return window.localStorage.getItem("userId") || "";
};

export const setUserId = (userId: string) => {
  window.localStorage.setItem("userId", userId);
};
