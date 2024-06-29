import { memo } from "react";
import {
  Dialog,
  ImageUploader,
  Title,
  useFormikFields,
} from "../../../components";
import { CategoryFormAction } from "../enum";
import { useCategoriesForm } from "../hooks";
import { Category } from "../../../hooks";
import { useFormik } from "formik";
import styled from "styled-components";
import { Box } from "@mui/material";

type Props = {
  selectedCategory: Category | undefined;
  formAction: CategoryFormAction;
  setFormAction: React.Dispatch<
    React.SetStateAction<CategoryFormAction | undefined>
  >;
};

const StyledBox = styled(Box)`
  display: flex;
  min-height: 40vh;
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
export const CategoryForm = memo(
  ({ formAction, selectedCategory, setFormAction }: Props) => {
    const {
      title,
      fields,
      initValues,
      schema,
      formOnSubmit,
      setImageFile,
      setImageChanged,
      imageUrl,
    } = useCategoriesForm(formAction, selectedCategory);

    const formik = useFormik({
      initialValues: initValues,
      validationSchema: schema,
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
            setFormAction(undefined);
          }
        }}
        fullWidth
      >
        <StyledBox>
          <LeftWrapper>{fieldsCompoents}</LeftWrapper>
          <RightWrapper>
            <ImageUploader
              setImageFile={setImageFile}
              setImageChanged={setImageChanged}
              defaultImgPath={imageUrl}
            />
          </RightWrapper>
        </StyledBox>
      </Dialog>
    );
  }
);
CategoryForm.displayName = "CategoryForm";
