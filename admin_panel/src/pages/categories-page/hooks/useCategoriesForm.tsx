import { useCallback, useMemo, useState } from "react";
import { AddCategorySchema } from "../../../yup";
import { Category, useCategoryCRUD } from "../../../hooks";

export enum CategoriesFormAction {
  Edit,
  Add,
  View,
}

type CategoriesForm = {
  name: string;
  enable: boolean;
};
export const useCategoriesForm = (
  action: CategoriesFormAction,
  selectedCategory: Category | undefined
) => {
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imageChanged, setImageChanged] = useState<boolean>(false);
  const { updateCategory, createCategory } = useCategoryCRUD();
  const fields: CategoriesForm[] = useMemo(
    () => [
      {
        name: "category_name",
        enable: action in [CategoriesFormAction.Edit, CategoriesFormAction.Add],
      },
    ],
    []
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
  }, [selectedCategory]);

  const schema = useMemo(() => {
    if (action === CategoriesFormAction.Edit) {
      return AddCategorySchema;
    }
    if (action === CategoriesFormAction.Add) {
      return AddCategorySchema;
    }
    return undefined;
  }, []);

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
    [updateCategory, createCategory]
  );

  return {
    fields,
    initValues,
    schema,
    formOnSubmit,
    setImageFile,
    setImageChanged,
    createCategory,
  };
};
