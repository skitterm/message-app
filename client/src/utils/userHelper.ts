export const signOutUser = () => {
  // @ts-ignore
  const gapi = window.gapi;
  const auth2 = gapi.auth2.getAuthInstance();
  if (auth2) {
    auth2.signOut().then(() => {
      window.location.reload();
    });
  }
};
