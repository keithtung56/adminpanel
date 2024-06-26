import { TextField, Box, MenuItem } from "@mui/material";
import { useFormik } from "formik";
import { memo } from "react";
import styled from "styled-components";
import { Dialog, Title } from "../../../components";
import { EditCustomerSchema } from "../../../yup";
import { User, useUserCRUD } from "../../../hooks";
import { useTranslation } from "react-i18next";

const StyledBox = styled(Box)`
  dispaly: flex;
  flex-direction: column;
`;
const StyledTextField = styled(TextField)`
  margin-top: 10px;
`;
type Props = {
  showEditForm: boolean;
  setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>;
  editUser: User;
};
export const EditUserForm = memo(
  ({ showEditForm, setShowEditForm, editUser }: Props) => {
    const { t } = useTranslation();
    const { updateUser } = useUserCRUD();
    const formik = useFormik({
      initialValues: {
        username: editUser.username,
        gender: editUser.gender,
        age: editUser.age,
        phone: editUser.phone,
      },
      validationSchema: EditCustomerSchema,
      onSubmit: async (values) => {
        await updateUser(
          editUser.uid,
          values.username,
          values.gender,
          values.age,
          values.phone
        );
        setShowEditForm(false);
      },
    });

    return (
      <Dialog
        title={<Title>{t("form.editUser.title")}</Title>}
        open={showEditForm}
        handleClose={(value: boolean) => {
          if (!value) {
            setShowEditForm(false);
          }
          formik.handleSubmit();
        }}
        fullWidth
      >
        <StyledBox>
          <StyledTextField
            id="username"
            label={t("user.username")}
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={
              formik.touched.username &&
              formik.errors.username &&
              t(formik.errors.username)
            }
            fullWidth
          />
          <StyledTextField
            type="number"
            id="age"
            label={t("user.age")}
            name="age"
            value={formik.values.age}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.age && Boolean(formik.errors.age)}
            helperText={
              formik.touched.age && formik.errors.age && t(formik.errors.age)
            }
            fullWidth
          />

          <StyledTextField
            id="phone"
            label={t("user.phone")}
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={
              formik.touched.phone &&
              formik.errors.phone &&
              t(formik.errors.phone)
            }
            fullWidth
          />

          <StyledTextField
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
          </StyledTextField>
        </StyledBox>
      </Dialog>
    );
  }
);

EditUserForm.displayName = "EditUserForm";
