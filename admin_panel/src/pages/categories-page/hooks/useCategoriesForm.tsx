import { useCallback, useEffect, useMemo, useState } from "react";
import { AddCategorySchema } from "../../../yup";
import {
  Category,
  useCategoryCRUD,
  useCategoryImageCRUD,
} from "../../../hooks";
import { FormikForm, FormikFormFields } from "../../../components";
import { useTranslation } from "react-i18next";
import { CategoryFormAction } from "../enum";

export const useCategoriesForm = (
  action: CategoryFormAction,
  selectedCategory: Category | undefined
) => {
  const { t } = useTranslation();
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imageChanged, setImageChanged] = useState<boolean>(false);
  const { updateCategory, createCategory } = useCategoryCRUD();
  const { imageUrl, setCurrentImgId } = useCategoryImageCRUD();

  useEffect(() => {
    setCurrentImgId(selectedCategory?.img_id ?? "");
  }, [selectedCategory, setCurrentImgId]);

  const fields: FormikForm[] = useMemo(
    () => [
      {
        label: "category_name",
        name: "category_name",
        disabled: false,
        fieldType: FormikFormFields.TextField,
      },
    ],
    [action]
  );

  const title = useMemo(() => {
    if (action === CategoryFormAction.Add) {
      return t("form.addCategory.title");
    }
    if (action === CategoryFormAction.Edit) {
      return t("form.editCategory.title");
    }
  }, [action, t]);
  const initValues = useMemo(() => {
    if (action === CategoryFormAction.Edit) {
      return {
        category_name: selectedCategory?.category_name,
      };
    }
    if (action === CategoryFormAction.Add) {
      return {
        category_name: "",
      };
    }
    return {};
  }, [selectedCategory, action]);

  const schema = useMemo(() => {
    if (action === CategoryFormAction.Edit) {
      return AddCategorySchema;
    }
    if (action === CategoryFormAction.Add) {
      return AddCategorySchema;
    }
    return undefined;
  }, [action]);

  const formOnSubmit = useCallback(
    async (values: any) => {
      if (action === CategoryFormAction.Edit && selectedCategory) {
        await updateCategory(
          selectedCategory.category_id,
          values.category_name,
          imageFile,
          imageChanged
        );
      }
      if (action === CategoryFormAction.Add) {
        await createCategory(values.category_name, imageFile, imageChanged);
      }
      return () => {};
    },
    [
      updateCategory,
      createCategory,
      action,
      imageChanged,
      imageFile,
      selectedCategory,
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
    title,
  };
};
