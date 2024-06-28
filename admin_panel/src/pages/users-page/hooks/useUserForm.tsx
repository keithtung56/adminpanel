import { useCallback, useMemo } from "react";
import { AddCustomerSchema } from "../../../yup";
import { User, useUserCRUD } from "../../../hooks";
import { FormikFormFields } from "../../../components";
import { UserFormAction } from "../enum/UserFormAction";

export type CategoryFormField = {
  label: string;
  name: string;
  disabled: boolean;
  fieldType: FormikFormFields;
};
export const useUserForm = (
  action: UserFormAction,
  selectedUser: User | undefined
) => {
  const { createUser, createAuthUser, updateUser } = useUserCRUD();

  const fields: CategoryFormField[] = useMemo(
    () => [
      {
        label: "email",
        name: "email",
        disabled: action in [UserFormAction.Edit],
        fieldType: FormikFormFields.TextField,
      },
      {
        label: "username",
        name: "username",
        disabled: action in [],
        fieldType: FormikFormFields.TextField,
      },
      {
        label: "password",
        name: "password",
        disabled: action in [],
        fieldType: FormikFormFields.TextField,
      },
      {
        label: "phone",
        name: "phone",
        disabled: action in [UserFormAction.Edit],
        fieldType: FormikFormFields.TextField,
      },
      {
        label: "age",
        name: "age",
        disabled: action in [],
        fieldType: FormikFormFields.NumberField,
      },
    ],
    [action]
  );

  const initValues = useMemo(() => {
    console.log(selectedUser?.username);

    if (action === UserFormAction.Edit) {
      return {
        email: selectedUser?.email,
        username: selectedUser?.username,
        password: selectedUser?.password,
        phone: selectedUser?.phone,
        gender: selectedUser?.gender,
        age: selectedUser?.age,
      };
    }
    if (action === UserFormAction.Add) {
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
    if (action === UserFormAction.Add) {
      return AddCustomerSchema;
    }
    return undefined;
  }, [action, AddCustomerSchema]);

  const formOnSubmit = useCallback(
    async (values: any) => {
      if (action === UserFormAction.Add) {
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
      if (action === UserFormAction.Edit && selectedUser) {
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
    [
      createAuthUser,
      createUser,
      updateUser,
      AddCustomerSchema,
      action,
      selectedUser,
    ]
  );

  return {
    fields,
    initValues,
    schema,
    formOnSubmit,
  };
};
