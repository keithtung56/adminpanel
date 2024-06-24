import { useFormik } from "formik";
import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Category,
  useCategoryCRUD,
  useCategoryImageCRUD,
} from "../../../hooks";
import { Dialog, ImageUploader, Title } from "../../../components";
import styled from "styled-components";
import { Box, TextField } from "@mui/material";

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
  showEditForm: boolean;
  setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>;
  category: Category;
};
export const EditCategoryForm = memo(
  ({ showEditForm, setShowEditForm, category }: Props) => {
    const { t } = useTranslation();
    const { updateCategory } = useCategoryCRUD();
    const { imageUrl, setCurrentImgId } = useCategoryImageCRUD();
    const [imageFile, setImageFile] = useState<File | undefined>(undefined);
    const [imageChanged, setImageChanged] = useState<boolean>(false);
    useEffect(() => {
      setCurrentImgId(category.img_id ?? "");
    }, [category, setCurrentImgId]);

    const formik = useFormik({
      initialValues: {
        category_name: category.category_name,
      },
      onSubmit: async (values) => {
        try {
          if (!imageFile) {
            return;
          }
          await updateCategory(
            category.category_id,
            values.category_name,
            imageFile,
            imageChanged
          );
          setShowEditForm(false);
        } catch (e) {
          console.log(e);
        }
      },
    });

    return (
      <Dialog
        title={<Title>{t("form.editCategory.title")}</Title>}
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
              setImageChanged={setImageChanged}
              setImageFile={setImageFile}
              defaultImgPath={imageUrl}
            />
          </RightWrapper>
        </StyledBox>
      </Dialog>
    );
  }
);

EditCategoryForm.displayName = "EditCategoryForm";
