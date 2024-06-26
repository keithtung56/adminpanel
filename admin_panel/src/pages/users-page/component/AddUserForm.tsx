import { TextField, Box, MenuItem } from "@mui/material";
import { useFormik } from "formik";
import { memo } from "react";
import styled from "styled-components";
import { Dialog, Title } from "../../../components";
import { AddCustomerSchema } from "../../../yup";
import { useUserCRUD } from "../../../hooks";
import { useTranslation } from "react-i18next";

const StyledBox = styled(Box)`
  dispaly: flex;
  flex-direction: column;
`;
const StyledTextField = styled(TextField)`
  margin-top: 10px;
`;
type Props = {
  showAddForm: boolean;
  setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
};
export const AddUserForm = memo(({ showAddForm, setShowAddForm }: Props) => {
  const { t } = useTranslation();
  const { createUser, createAuthUser } = useUserCRUD();
  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      phone: "",
      gender: "",
      age: 0,
    },
    validationSchema: AddCustomerSchema,
    onSubmit: async (values) => {
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
      setShowAddForm(false);
    },
  });

  return (
    <Dialog
      title={<Title>{t("form.addUser.title")}</Title>}
      open={showAddForm}
      handleClose={(value: boolean) => {
        if (!value) {
          setShowAddForm(false);
        }
        formik.handleSubmit();
      }}
      fullWidth
    >
      <StyledBox>
        <StyledTextField
          id="email"
          label={t("user.email")}
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={
            formik.touched.email &&
            formik.errors.email &&
            t(formik.errors.email)
          }
          fullWidth
        />
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
          id="password"
          label={t("user.password")}
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={
            formik.touched.password &&
            formik.errors.password &&
            t(formik.errors.password)
          }
          fullWidth
        />
        <StyledTextField
          id="password"
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
});

AddUserForm.displayName = "AddUserForm";
