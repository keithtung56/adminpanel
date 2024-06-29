import { MenuItem, TextField, TextFieldProps } from "@mui/material";
import { FormikProps } from "formik";
import { TFunction } from "i18next";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useCategoryCRUD } from "../../hooks";

type SelectCategoryFieldProps = TextFieldProps & {
  formik: FormikProps<any>;
  name: string;
};

export const SelectCategoryField = memo(
  ({ formik, ...props }: SelectCategoryFieldProps) => {
    const { t } = useTranslation();
    const { name, className, label, disabled } = props;
    const { categoryList, isLoading } = useCategoryCRUD();

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
        {categoryList.map(({ category_id, category_name }) => {
          return (
            <MenuItem value={category_id} key={category_id}>
              {category_name}
            </MenuItem>
          );
        })}
      </TextField>
    );
  }
);

SelectCategoryField.displayName = "SelectCategoryField";
