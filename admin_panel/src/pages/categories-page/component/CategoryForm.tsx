import { memo } from "react";
import {
  Dialog,
  FormikFormFields,
  ImageUploader,
  NormalTextField,
  Title,
} from "../../../components";
import { CategoriesFormAction } from "../enum";
import { useCategoriesForm } from "../hooks";
import { Category } from "../../../hooks";
import { useFormik } from "formik";
import styled from "styled-components";
import { Box } from "@mui/material";

type Props = {
  title: string;
  selectedCategory: Category | undefined;
  formAction: CategoriesFormAction;
  setFormAction: React.Dispatch<
    React.SetStateAction<CategoriesFormAction | undefined>
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
  ({ title, formAction, selectedCategory, setFormAction }: Props) => {
    const {
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
          <LeftWrapper>
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
                    />
                  );
                default:
                  return <></>;
              }
            })}
          </LeftWrapper>
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
