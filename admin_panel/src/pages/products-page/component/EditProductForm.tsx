import { TextField, Box, Button } from "@mui/material";
import { useFormik } from "formik";
import { memo, useEffect, useState } from "react";
import styled from "styled-components";
import { Dialog, Title } from "../../../components";
import {
  Product,
  useCategoryCRUD,
  useProductCRUD,
  useProductImageCRUD,
} from "../../../hooks";
import { AddProductSchema } from "../../../yup";
import { useTranslation } from "react-i18next";
import { SelectCategoryField } from "./SelectCategoryField";
import { ImageUploader } from "../../../components";

const StyledBox = styled(Box)`
  display: flex;
  min-height: 40vh;
`;
const StyledTextField = styled(TextField)`
  margin-top: 10px;
`;

const StyledSelectCategoryField = styled(SelectCategoryField)`
  margin-top: 10px;
`;

const LeftWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 70%;
`;
const RightWrapper = styled(Box)`
  width: 30%;
`;
const OptionTextField = styled(TextField)<{ $width?: number }>`
  margin-top: 10px;
  width: ${({ $width }) => ($width ? `${$width}` : "100")}%;
`;

const OptionField = styled(Box)`
  display: flex;
`;
type Props = {
  showEditForm: boolean;
  setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>;
  product: Product;
};
export const EditProductForm = memo(
  ({ showEditForm, setShowEditForm, product }: Props) => {
    const { t } = useTranslation();
    const { updateProduct } = useProductCRUD();
    const { categoriesList } = useCategoryCRUD();
    const { imageUrl, setCurrentImgId } = useProductImageCRUD();
    const [imageFile, setImageFile] = useState<File | undefined>(undefined);
    const [imageChanged, setImageChanged] = useState<boolean>(false);
    useEffect(() => {
      setCurrentImgId(product.img_id ?? "");
    }, [product, setCurrentImgId]);

    const formik = useFormik({
      initialValues: {
        product_name: product.product_name,
        price: product.price,
        category_id: product.category_id,
        description: product.description,
        options: product.options.map(({ option_name, choices }) => ({
          option_name,
          choices: choices.join(","),
        })),
      },
      validationSchema: AddProductSchema,
      onSubmit: async (values) => {
        try {
          await updateProduct(
            product.product_id,
            values.product_name,
            values.price,
            values.category_id,
            values.description,
            imageFile,
            imageChanged,
            values.options
          );
          setShowEditForm(false);
        } catch (e) {
          console.log(e);
        }
      },
    });
    return (
      <Dialog
        title={<Title>{t("form.editProduct.title")}</Title>}
        open={showEditForm}
        handleClose={(value: boolean) => {
          if (!value) {
            setShowEditForm(false);
          } else {
            formik.handleSubmit();
          }
        }}
        fullWidth
      >
        <StyledBox>
          <LeftWrapper>
            <StyledTextField
              id="product_name"
              label={t("product.product_name")}
              name="product_name"
              value={formik.values.product_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.product_name &&
                Boolean(formik.errors.product_name)
              }
              helperText={
                formik.touched.product_name &&
                formik.errors.product_name &&
                t(formik.errors.product_name)
              }
              fullWidth
            />

            <StyledTextField
              id="price"
              type="number"
              label={t("product.price")}
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={
                formik.touched.price &&
                formik.errors.price &&
                t(formik.errors.price)
              }
              fullWidth
            />

            <StyledSelectCategoryField
              categoriesList={categoriesList}
              id={"category_id"}
              label={t("product.category")}
              name={"category_id"}
              value={formik.values.category_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.category_id && Boolean(formik.errors.category_id)
              }
              helperText={
                formik.touched.category_id &&
                formik.errors.category_id &&
                t(formik.errors.category_id)
              }
              fullWidth
            />
            <StyledTextField
              id="price"
              label={t("product.description")}
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              multiline
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description &&
                formik.errors.description &&
                t(formik.errors.description)
              }
              fullWidth
            />
            <Button
              onClick={() => {
                formik.setFieldValue("options", [
                  ...formik.values.options,
                  { option_name: "", choices: "" },
                ]);
              }}
            >
              Add Option
            </Button>
            {formik.values.options.map(({ option_name, choices }, index) => {
              console.log(index);
              return (
                <OptionField key={index}>
                  <OptionTextField
                    label={`option${index + 1}`}
                    $width={30}
                    value={option_name}
                    name={`options.${index}.option_name`}
                    onChange={formik.handleChange}
                  />
                  <OptionTextField
                    label={`option${index + 1} choices`}
                    placeholder="choice1,choice2,choice3..."
                    $width={60}
                    value={choices}
                    name={`options.${index}.choices`}
                    onChange={formik.handleChange}
                  />
                  <Button
                    onClick={() => {
                      formik.setFieldValue(
                        "options",
                        formik.values.options.filter((_, idx) => idx !== index),
                        true
                      );
                    }}
                  >
                    {t("button.delete")}
                  </Button>
                </OptionField>
              );
            })}
          </LeftWrapper>
          <RightWrapper>
            <ImageUploader
              setImageFile={setImageFile}
              defaultImgPath={imageUrl}
              setImageChanged={setImageChanged}
            />
          </RightWrapper>
        </StyledBox>
      </Dialog>
    );
  }
);

EditProductForm.displayName = "EditProductForm";
