import { MenuItem, TextField, TextFieldProps } from "@mui/material";
import { FormikProps } from "formik";
import { TFunction } from "i18next";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useUserCRUD } from "../../hooks";

type SelectUserFieldProps = TextFieldProps & {
  formik: FormikProps<any>;
  name: string;
};

export const SelectUserField = memo(
  ({ formik, ...props }: SelectUserFieldProps) => {
    const { t } = useTranslation();
    const { name, className, label, disabled } = props;
    const { userList, isLoading } = useUserCRUD();

    if (isLoading) {
      return <></>;
    }
    return (
      <TextField
        select
        name={name}
        className={className}
        id={name}
        label={label}
        disabled={disabled}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched[name] && Boolean(formik.errors[name])}
        helperText={
          formik.touched[name] &&
          formik.errors[name] &&
          t(formik.errors[name] as keyof TFunction)
        }
        fullWidth
      >
        {userList.map(({ uid, username }) => {
          return (
            <MenuItem value={uid} key={uid}>
              {username}
            </MenuItem>
          );
        })}
      </TextField>
    );
  }
);

SelectUserField.displayName = "SelectUserField";
