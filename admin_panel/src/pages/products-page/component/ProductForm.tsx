import { memo } from "react";
import {
  Dialog,
  ImageUploader,
  Title,
  useFormikFields,
} from "../../../components";
import { Product } from "../../../hooks";
import { useFormik } from "formik";
import styled from "styled-components";
import { Box } from "@mui/material";
import { ProductFormActions } from "../enum";
import { useProductForm } from "../hooks";

type Props = {
  selectedProduct: Product | undefined;
  formAction: ProductFormActions;
  setFormAction: React.Dispatch<
    React.SetStateAction<ProductFormActions | undefined>
  >;
};

const StyledBox = styled(Box)`
  display: flex;
  min-height: 40vh;
  padding: 10px;
`;

const LeftWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 70%;
  gap: 10px;
`;
const RightWrapper = styled(Box)`
  width: 30%;
`;

export const ProductForm = memo(
  ({ formAction, selectedProduct, setFormAction }: Props) => {
    const {
      fields,
      initValues,
      schema,
      formOnSubmit,
      setImageFile,
      setImageChanged,
      imageUrl,
      title,
    } = useProductForm(formAction, selectedProduct);

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
ProductForm.displayName = "ProductForm";
