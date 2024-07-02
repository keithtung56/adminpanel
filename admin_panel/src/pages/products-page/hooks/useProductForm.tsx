import { useCallback, useEffect, useMemo, useState } from "react";
import { Product, useProductCRUD, useProductImageCRUD } from "../../../hooks";
import { FormikForm, FormikFormFields } from "../../../components";
import { ProductFormActions } from "../enum";
import { useTranslation } from "react-i18next";
import { AddProductSchema, EditProductSchema } from "../../../yup";

export const useProductForm = (
  action: ProductFormActions,
  selectedProduct: Product | undefined
) => {
  const { t } = useTranslation();
  const { createProduct, updateProduct } = useProductCRUD();
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imageChanged, setImageChanged] = useState<boolean>(false);
  const { imageUrl, setCurrentImgId } = useProductImageCRUD();

  useEffect(() => {
    setCurrentImgId(selectedProduct?.img_id ?? "");
  }, [selectedProduct, setCurrentImgId]);

  const title = useMemo(() => {
    if (action === ProductFormActions.Add) {
      return t("form.addProduct.title");
    }
    if (action === ProductFormActions.Edit) {
      return t("form.editProduct.title");
    }
  }, [action, t]);
  const fields: FormikForm[] = useMemo(
    () => [
      {
        label: t("product.product_name"),
        name: "product_name",
        disabled: action in [],
        fieldType: FormikFormFields.TextField,
      },
      {
        label: t("product.price"),
        name: "price",
        disabled: action in [],
        fieldType: FormikFormFields.NumberField,
      },
      {
        label: t("product.stock"),
        name: "stock",
        disabled: [ProductFormActions.Edit, ProductFormActions.View].includes(
          action
        ),
        fieldType: FormikFormFields.NumberField,
      },
      {
        label: t("product.category"),
        name: "category_id",
        disabled: action in [],
        fieldType: FormikFormFields.SelectCategoryField,
      },
      {
        label: t("product.status"),
        name: "status",
        disabled: action in [],
        fieldType: FormikFormFields.SelectProductStatusField,
      },
      {
        label: t("product.description"),
        name: "description",
        disabled: action in [],
        fieldType: FormikFormFields.TextArea,
      },
    ],
    [action, t]
  );

  const initValues = useMemo(() => {
    if (action === ProductFormActions.Add) {
      return {
        product_name: "",
        price: 0,
        status: "listed" as Product["status"],
        stock: 0,
        category_id: "",
        description: "",
      };
    }
    if (action === ProductFormActions.Edit) {
      return {
        product_name: selectedProduct?.product_name,
        price: selectedProduct?.price,
        status: selectedProduct?.status,
        stock: selectedProduct?.stock,
        category_id: selectedProduct?.category_id,
        description: selectedProduct?.description,
      };
    }
    return {};
  }, [selectedProduct, action]);

  const schema = useMemo(() => {
    if (action === ProductFormActions.Add) {
      return AddProductSchema;
    }
    if (action === ProductFormActions.Edit) {
      return EditProductSchema;
    }
    return undefined;
  }, [action]);

  const formOnSubmit = useCallback(
    async (values: any) => {
      if (action === ProductFormActions.Add) {
        if (!imageFile) return;
        await createProduct(
          values.product_name,
          values.price,
          values.status,
          values.stock,
          values.category_id,
          values.description,
          imageFile
        );
      }
      if (action === ProductFormActions.Edit && selectedProduct) {
        if (imageChanged && imageFile === undefined) return;
        await updateProduct(
          selectedProduct.product_id,
          values.product_name,
          values.price,
          values.status,
          values.category_id,
          values.description,
          imageFile,
          imageChanged
        );
      }
      return () => {};
    },
    [
      createProduct,
      updateProduct,
      action,
      selectedProduct,
      imageChanged,
      imageFile,
    ]
  );

  return {
    fields,
    initValues,
    schema,
    formOnSubmit,
    setImageFile,
    setImageChanged,
    imageUrl,
    setCurrentImgId,
    title,
  };
};
