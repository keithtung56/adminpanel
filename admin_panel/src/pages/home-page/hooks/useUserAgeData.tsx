import { useMemo } from "react";
import { useUserCRUD } from "../../../hooks";

export const useUsersAgeData = () => {
  const { userList } = useUserCRUD();
  const usersAgeData = useMemo(() => {
    const res: { [key: string]: number } = {
      "<10": 0,
      "10-19": 0,
      "20-29": 0,
      "30-39": 0,
      "40-49": 0,
      "50-59": 0,
      "60-69": 0,
    };
    userList.forEach(({ age }) => {
      switch (true) {
        case age < 10:
          res["<10"] += 1;
          break;
        case age < 20:
          res["10-19"] += 1;
          break;
        case age < 30:
          res["20-29"] += 1;
          break;
        case age < 40:
          res["30-39"] += 1;
          break;
        case age < 50:
          res["40-49"] += 1;
          break;
        case age < 60:
          res["50-59"] += 1;
          break;
        case age < 70:
          res["60-69"] += 1;
          break;
      }
    });
    return Object.keys(res).reduce((acc, cur) => {
      if (res[cur] === 0) {
        return acc;
      }
      return { ...acc, [cur]: res[cur] };
    }, {});
  }, [userList]);

  return { usersAgeData };
};
