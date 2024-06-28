import { useCallback, useEffect, useMemo, useState } from "react";
import { AddCategorySchema } from "../../../yup";
import {
  Category,
  useCategoryCRUD,
  useCategoryImageCRUD,
} from "../../../hooks";
import { CategoriesFormAction } from "../enum";
import { FormikFormFields } from "../../../components";

export type CategoryFormField = {
  label: string;
  name: string;
  disabled: boolean;
  fieldType: FormikFormFields;
};
export const useCategoriesForm = (
  action: CategoriesFormAction,
  selectedCategory: Category | undefined
) => {
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imageChanged, setImageChanged] = useState<boolean>(false);
  const { updateCategory, createCategory } = useCategoryCRUD();
  const { imageUrl, setCurrentImgId } = useCategoryImageCRUD();

  useEffect(() => {
    setCurrentImgId(selectedCategory?.img_id ?? "");
  }, [selectedCategory, setCurrentImgId]);

  const fields: CategoryFormField[] = useMemo(
    () => [
      {
        label: "category_name",
        name: "category_name",
        disabled: action in [],
        fieldType: FormikFormFields.TextField,
      },
    ],
    [action]
  );

  const initValues = useMemo(() => {
    if (action === CategoriesFormAction.Edit) {
      return {
        category_name: selectedCategory?.category_name,
      };
    }
    if (action === CategoriesFormAction.Add) {
      return {
        category_name: "",
      };
    }
    return {};
  }, [selectedCategory, action]);

  const schema = useMemo(() => {
    if (action === CategoriesFormAction.Edit) {
      return AddCategorySchema;
    }
    if (action === CategoriesFormAction.Add) {
      return AddCategorySchema;
    }
    return undefined;
  }, [action]);

  const formOnSubmit = useCallback(
    async (values: any) => {
      if (action === CategoriesFormAction.Edit && selectedCategory) {
        await updateCategory(
          selectedCategory.category_id,
          values.category_name,
          imageFile,
          imageChanged
        );
      }
      if (action === CategoriesFormAction.Add) {
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
  };
};
