import { matchPath, useLocation } from "react-router-dom";
import { ROUTES } from "../constants";

export const useCurrentPath = () => {
  const { pathname } = useLocation();
  const matchpath = (Object.keys(ROUTES) as Array<keyof typeof ROUTES>).find(
    (page) => matchPath(pathname, ROUTES[page].path)
  );
  return { matchpath };
};
