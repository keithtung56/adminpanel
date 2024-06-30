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
import { Box, Button, TextField } from "@mui/material";
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
                {t("button.addOption")}
              </Button>
            }
            {formik.values.options!.map(({ option_name, choices }, index) => {
              return (
                <OptionFieldRow key={index}>
                  <TextField
                    label={`${t("product.option")}${index + 1}`}
                    value={option_name}
                    name={`options[${index}].option_name`}
                    onChange={formik.handleChange}
                  />
                  <TextField
                    label={t("product.choice")}
                    placeholder={`${t("product.choice")}1,${t(
                      "product.choice"
                    )}2,${t("product.choice")}3...`}
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
