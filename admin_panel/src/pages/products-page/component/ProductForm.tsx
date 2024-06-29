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
import { Box, Button, MenuItem, TextField } from "@mui/material";
import { ProductFormActions } from "../enum";
import { useProductForm } from "../hooks";
import { useTranslation } from "react-i18next";

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

const OptionFieldRow = styled(Box)`
  display: flex;
  justify-content: space-between;
`;

export const ProductForm = memo(
  ({ formAction, selectedProduct, setFormAction }: Props) => {
    const { t } = useTranslation();
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
          <LeftWrapper>
            {fieldsCompoents}
            <TextField
              select
              id="status"
              label={t("product.status")}
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.status && Boolean(formik.errors.status)}
              helperText={
                formik.touched.status &&
                formik.errors.status &&
                t(formik.errors.status)
              }
              fullWidth
            >
              <MenuItem value={"listed"}>{t("product.listed")}</MenuItem>
              <MenuItem value={"unlisted"}>{t("product.unlisted")}</MenuItem>
            </TextField>
            {
              <Button
                onClick={() => {
                  formik.setFieldValue("options", [
                    ...formik.values.options!,
                    { option_name: "", choices: "" },
                  ]);
                }}
                variant="contained"
              >
                Add Option
              </Button>
            }
            {formik.values.options!.map(({ option_name, choices }, index) => {
              return (
                <OptionFieldRow key={index}>
                  <TextField
                    label={`option${index + 1}`}
                    value={option_name}
                    name={`options[${index}].option_name`}
                    onChange={formik.handleChange}
                  />
                  <TextField
                    label={`option${index + 1} choices`}
                    placeholder="choice1,choice2,choice3..."
                    value={choices}
                    name={`options[${index}].choices`}
                    onChange={formik.handleChange}
                  />
                  <Button
                    onClick={() => {
                      formik.setFieldValue(
                        "options",
                        formik.values.options!.filter(
                          (_, idx) => idx !== index
                        ),
                        true
                      );
                    }}
                    variant="outlined"
                  >
                    {t("button.delete")}
                  </Button>
                </OptionFieldRow>
              );
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
ProductForm.displayName = "ProductForm";
