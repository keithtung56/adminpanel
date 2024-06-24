import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useUserCRUD } from "../../../hooks";

export const useUsersGenderData = () => {
  const { t } = useTranslation();
  const { userList } = useUserCRUD();
  const usersGenderData = useMemo(() => {
    let male_count = 0;
    let female_count = 0;
    userList.forEach((user) => {
      if (user.gender === "male") {
        male_count += 1;
      }
      if (user.gender === "female") {
        female_count += 1;
      }
    });
    return { [t("user.male")]: male_count, [t("user.female")]: female_count };
  }, [userList, t]);
  return { usersGenderData };
};
