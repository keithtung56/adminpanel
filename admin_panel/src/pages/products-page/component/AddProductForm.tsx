import { TextField, Box, Button } from "@mui/material";
import { useFormik } from "formik";
import { memo, useState } from "react";
import styled from "styled-components";
import { Dialog, Title } from "../../../components";
import { useCategoryCRUD, useProductCRUD } from "../../../hooks";
import { AddProductSchema } from "../../../yup";
import { useTranslation } from "react-i18next";
import { SelectCategoryField } from "./SelectCategoryField";
import { ImageUploader } from "../../../components/image-uploader/ImageUploader";

const StyledBox = styled(Box)`
  display: flex;
  min-height: 40vh;
  padding: 20px;
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
  showAddForm: boolean;
  setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
};
export const AddProductForm = memo(({ showAddForm, setShowAddForm }: Props) => {
  const { t } = useTranslation();
  const { createProduct } = useProductCRUD();
  const { categoriesList } = useCategoryCRUD();
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imageChanged, setImageChanged] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      product_name: "",
      price: 1,
      category_id: "",
      description: "",
      options: [] as { option_name: string; choices: string }[],
    },
    enableReinitialize: false,
    validationSchema: AddProductSchema,
    onSubmit: async (values) => {
      try {
        await createProduct(
          values.product_name,
          values.price,
          values.category_id,
          values.description,
          imageFile,
          imageChanged,
          values.options
        );

        setShowAddForm(false);
      } catch (e) {
        console.log(e);
      }
    },
  });

  return (
    <Dialog
      title={<Title>{t("form.addProduct.title")}</Title>}
      open={showAddForm}
      handleClose={(value: boolean) => {
        if (!value) {
          setShowAddForm(false);
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
              formik.touched.product_name && Boolean(formik.errors.product_name)
            }
            helperText={
              formik.touched.product_name &&
              formik.errors.product_name &&
              t(formik.errors.product_name)
            }
            fullWidth
          />

          <StyledTextField
            type="number"
            id="price"
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
            setImageChanged={setImageChanged}
          />
        </RightWrapper>
      </StyledBox>
    </Dialog>
  );
});

AddProductForm.displayName = "AddProductForm";
