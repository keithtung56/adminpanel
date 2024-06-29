import { TextField, TextFieldProps } from "@mui/material";
import { FormikProps } from "formik";
import { TFunction } from "i18next";
import { memo } from "react";
import { useTranslation } from "react-i18next";

type NormalTextAreaProps = TextFieldProps & {
  formik: FormikProps<any>;
  name: string;
};

export const NormalTextArea = memo(
  ({ formik, ...props }: NormalTextAreaProps) => {
    const { t } = useTranslation();
    const { name, className, label, disabled } = props;

    return (
      <TextField
        minRows={6}
        multiline
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
      />
    );
  }
);

NormalTextArea.displayName = "NormalTextArea";
