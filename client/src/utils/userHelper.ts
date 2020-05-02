export const getUserId = () => {
  return window.localStorage.getItem("userId") || "";
};

export const setUserId = (userId: string) => {
  window.localStorage.setItem("userId", userId);
};

export const signOutUser = () => {
  // @ts-ignore
  const gapi = window.gapi;
  const auth2 = gapi.auth2.getAuthInstance();
  if (auth2) {
    auth2.signOut().then(() => {
      console.log("Signed out");
    });
  }
};
