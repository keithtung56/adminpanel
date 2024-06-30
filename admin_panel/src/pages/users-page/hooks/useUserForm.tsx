import { useCallback, useMemo } from "react";
import { AddCustomerSchema } from "../../../yup";
import { User, useUserCRUD } from "../../../hooks";
import { FormikForm, FormikFormFields } from "../../../components";
import { UserFormActions } from "../enum/UserFormActions";
import { useTranslation } from "react-i18next";

export const useUserForm = (
  action: UserFormActions,
  selectedUser: User | undefined
) => {
  const { t } = useTranslation();
  const { createUser, createAuthUser, updateUser } = useUserCRUD();

  const fields: FormikForm[] = useMemo(
    () => [
      {
        label: t("user.email"),
        name: "email",
        disabled: [UserFormActions.Edit].includes(action),
        fieldType: FormikFormFields.TextField,
      },
      {
        label: t("user.username"),
        name: "username",
        disabled: false,
        fieldType: FormikFormFields.TextField,
      },
      {
        label: t("user.password"),
        name: "password",
        disabled: [UserFormActions.Edit].includes(action),
        fieldType: FormikFormFields.TextField,
      },
      {
        label: t("user.phone"),
        name: "phone",
        disabled: [UserFormActions.Edit].includes(action),
        fieldType: FormikFormFields.TextField,
      },
      {
        label: t("user.age"),
        name: "age",
        disabled: false,
        fieldType: FormikFormFields.NumberField,
      },
    ],
    [action, t]
  );

  const title = useMemo(() => {
    if (action === UserFormActions.Add) {
      return t("form.addUser.title");
    }
    if (action === UserFormActions.Edit) {
      return t("form.editUser.title");
    }
  }, [action, t]);
  const initValues = useMemo(() => {
    if (action === UserFormActions.Edit) {
      return {
        email: selectedUser?.email,
        username: selectedUser?.username,
        password: selectedUser?.password,
        phone: selectedUser?.phone,
        gender: selectedUser?.gender,
        age: selectedUser?.age,
      };
    }
    if (action === UserFormActions.Add) {
      return {
        email: "",
        username: "",
        password: "",
        phone: "",
        gender: "",
        age: 0,
      };
    }
    return {};
  }, [selectedUser, action]);

  const schema = useMemo(() => {
    if (action === UserFormActions.Add) {
      return AddCustomerSchema;
    }
    return undefined;
  }, [action]);

  const formOnSubmit = useCallback(
    async (values: any) => {
      if (action === UserFormActions.Add) {
        const res = await createAuthUser(values.email, values.password);
        await createUser(
          values.username,
          values.email,
          values.password,
          values.phone,
          values.age,
          values.gender,
          res.user.uid
        );
      }
      if (action === UserFormActions.Edit && selectedUser) {
        await updateUser(
          selectedUser.uid,
          values.username,
          values.gender,
          values.age,
          values.phone
        );
      }
      return () => {};
    },
    [createAuthUser, createUser, updateUser, action, selectedUser]
  );

  return {
    fields,
    initValues,
    schema,
    formOnSubmit,
    title,
  };
};
