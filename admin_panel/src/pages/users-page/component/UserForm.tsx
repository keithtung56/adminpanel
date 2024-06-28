import { memo } from "react";
import {
  Dialog,
  FormikFormFields,
  NormalTextField,
  NumberTextField,
  Title,
} from "../../../components";
import { User } from "../../../hooks";
import { useFormik } from "formik";
import styled from "styled-components";
import { Box, MenuItem, TextField } from "@mui/material";
import { UserFormAction } from "../enum";
import { useUserForm } from "../hooks";
import { useTranslation } from "react-i18next";

type Props = {
  title: string;
  selectedUser: User | undefined;
  formAction: UserFormAction;
  setFormAction: React.Dispatch<
    React.SetStateAction<UserFormAction | undefined>
  >;
};

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
`;
export const UserForm = memo(
  ({ title, formAction, selectedUser, setFormAction }: Props) => {
    const { t } = useTranslation();
    const { fields, initValues, schema, formOnSubmit } = useUserForm(
      formAction,
      selectedUser
    );

    const formik = useFormik({
      initialValues: initValues,
      validationSchema: schema,
      onSubmit: formOnSubmit,
    });
    return (
      <Dialog
        title={<Title>{title}</Title>}
        open
        handleClose={(value: boolean) => {
          if (!value) {
            setFormAction(undefined);
          } else {
            formik.handleSubmit();
            setFormAction(undefined);
          }
        }}
        fullWidth
      >
        <StyledBox>
          {fields.map(({ name, disabled, fieldType, label }) => {
            switch (fieldType) {
              case FormikFormFields.TextField:
                return (
                  <NormalTextField
                    key={name}
                    name={name}
                    label={label}
                    disabled={disabled}
                    formik={formik}
                    fullWidth
                  />
                );
              case FormikFormFields.NumberField:
                return (
                  <NumberTextField
                    key={name}
                    name={name}
                    label={label}
                    disabled={disabled}
                    formik={formik}
                    fullWidth
                  />
                );
              default:
                return <></>;
            }
          })}
          <TextField
            select
            id="gender"
            label={t("user.gender")}
            name="gender"
            value={formik.values.gender}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.gender && Boolean(formik.errors.gender)}
            helperText={
              formik.touched.gender &&
              formik.errors.gender &&
              t(formik.errors.gender)
            }
            fullWidth
          >
            <MenuItem value={"male"}>{t("user.male")}</MenuItem>
            <MenuItem value={"female"}>{t("user.female")}</MenuItem>
          </TextField>
        </StyledBox>
      </Dialog>
    );
  }
);

UserForm.displayName = "UserForm";
