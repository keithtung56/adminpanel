import { useFormik } from "formik";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCategoryCRUD } from "../../../hooks";
import { Dialog, ImageUploader, Title } from "../../../components";
import styled from "styled-components";
import { Box, TextField } from "@mui/material";
import { AddCategorySchema } from "../../../yup";

const StyledBox = styled(Box)`
  display: flex;
  min-height: 40vh;
`;
const StyledTextField = styled(TextField)`
  margin-top: 10px;
`;

const LeftWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 70%;
`;
const RightWrapper = styled(Box)`
  width: 30%;
`;

type Props = {
  showAddForm: boolean;
  setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
};
export const AddCategoryForm = memo(
  ({ showAddForm, setShowAddForm }: Props) => {
    const { t } = useTranslation();
    const { createCategory } = useCategoryCRUD();
    const [imageFile, setImageFile] = useState<File | undefined>(undefined);
    const [imageChanged, setImageChanged] = useState<boolean>(false);

    const formik = useFormik({
      initialValues: {
        category_name: "",
      },
      validationSchema: AddCategorySchema,
      onSubmit: async (values) => {
        if (!imageFile) {
          return;
        }
        try {
          await createCategory(values.category_name, imageFile, imageChanged);
          setShowAddForm(false);
        } catch (e) {
          console.log(e);
        }
      },
    });

    return (
      <Dialog
        title={<Title>{t("form.addCategory.title")}</Title>}
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
          <LeftWrapper>
            <StyledTextField
              id="category_name"
              label={t("category.category_name")}
              name="category_name"
              value={formik.values.category_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.category_name &&
                Boolean(formik.errors.category_name)
              }
              helperText={
                formik.touched.category_name &&
                formik.errors.category_name &&
                t(formik.errors.category_name)
              }
              fullWidth
            />
          </LeftWrapper>
          <RightWrapper>
            <ImageUploader
              setImageFile={setImageFile}
              setImageChanged={setImageChanged}
            />
          </RightWrapper>
        </StyledBox>
      </Dialog>
    );
  }
);

AddCategoryForm.displayName = "AddCategoryForm";
