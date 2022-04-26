export const AUTH = () => {
    if (localStorage.getItem("token")) {
      return true;
    } else {
      return false;
    }
  };
  