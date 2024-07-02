import { memo } from "react";
import { Dialog, Title, useFormikFields } from "../../../components";
import { User } from "../../../hooks";
import { useFormik } from "formik";
import styled from "styled-components";
import { Box, MenuItem, TextField } from "@mui/material";
import { UserFormActions } from "../enum";
import { useUserForm } from "../hooks";
import { useTranslation } from "react-i18next";

type Props = {
  selectedUser: User | undefined;
  formAction: UserFormActions;
  setFormAction: React.Dispatch<
    React.SetStateAction<UserFormActions | undefined>
  >;
};

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
`;
export const UserForm = memo(
  ({ formAction, selectedUser, setFormAction }: Props) => {
    const { t } = useTranslation();
    const { title, fields, initValues, schema, formOnSubmit } = useUserForm(
      formAction,
      selectedUser
    );

    const formik = useFormik({
      initialValues: initValues,
      validationSchema: schema,
      validateOnMount: true,
      onSubmit: formOnSubmit,
    });

    const { fieldsCompoents } = useFormikFields({ fields, formik });
    return (
      <Dialog
        title={<Title>{title}</Title>}
        open
        handleClose={(value: boolean) => {
          if (!value) {
            setFormAction(undefined);
          } else {
            formik.handleSubmit();
            if (Object.keys(formik.errors).length === 0)
              setFormAction(undefined);
          }
        }}
        fullWidth
      >
        <StyledBox>
          {fieldsCompoents}
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
