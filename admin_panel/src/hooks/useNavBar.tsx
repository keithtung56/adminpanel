import { useCallback, useState } from "react";

export const useNavBar = () => {
  const [showNavBar, setShowNavBar] = useState(true);

  const listIconOnClick = useCallback(() => {
    setShowNavBar(!showNavBar);
  }, [showNavBar, setShowNavBar]);

  return { showNavBar, listIconOnClick };
};
