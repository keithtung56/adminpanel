import { ref, onValue, update, remove, get } from "firebase/database";
import { database } from "../firebase";
import { useCallback, useEffect, useState } from "react";
import uuid from "react-uuid";
import moment from "moment";
import { DATE_DB_FORMAT } from "../constants";
import { useCategoryImageCRUD } from "./useCategoryImageCRUD";

export type Category = {
  category_id: string;
  img_id?: string;
  category_name: string;
  created_time: moment.Moment;
  modified_time: moment.Moment;
};
export const useCategoryCRUD = () => {
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const { uploadCategoryImage, deleteCategoryImage } = useCategoryImageCRUD();
  useEffect(() => {
    const unsubscribe = onValue(ref(database, "/Categories"), (snapshot) => {
      const res = snapshot.val();
      if (res) {
        setCategoriesList(
          //@ts-ignore
          Object.entries(res).reduce(
            (acc: string[], [id, attr]: [string, any]) => {
              const { created_time, modified_time, ...others } = attr;
              return [
                ...acc,
                {
                  ...others,
                  category_id: id,
                  created_time: moment(created_time, DATE_DB_FORMAT),
                  modified_time: moment(modified_time, DATE_DB_FORMAT),
                },
              ];
            },
            []
          )
        );
      } else {
        setCategoriesList([]);
      }
    });
    return unsubscribe;
  }, [setCategoriesList]);

  const createCategory = useCallback(
    async (
      category_name: string,
      img_file: File | undefined,
      img_need_update: boolean
    ) => {
      const category_random_id = uuid();
      let img_random_id;
      if (img_need_update && img_file) {
        img_random_id = uuid();
        await uploadCategoryImage(img_file, img_random_id);
      }
      const newCategory = {
        category_name,
        created_time: moment().format(DATE_DB_FORMAT),
        modified_time: moment().format(DATE_DB_FORMAT),
        img_id: img_random_id ? img_random_id : {},
      };

      await update(
        ref(database, `/Categories/${category_random_id}`),
        newCategory
      );
    },
    [uploadCategoryImage]
  );

  const deleteCategory = useCallback(
    async (category_id: string) => {
      const snapshot = await get(
        ref(database, `/Categories/${category_id}/img_id`)
      );
      const img_id: string = snapshot.val();
      if (img_id) {
        deleteCategoryImage(img_id);
      }

      await remove(ref(database, `/Categories/${category_id}`));
    },
    [deleteCategoryImage]
  );

  const updateCategory = useCallback(
    async (
      category_id: string,
      category_name: string,
      img_file: File | undefined,
      img_need_update: boolean
    ) => {
      let newCategory = {};

      if (!img_need_update) {
        newCategory = {
          category_name,
          modified_time: moment().format(DATE_DB_FORMAT),
        };
      }

      if (img_need_update && img_file) {
        const snapshot = await get(
          ref(database, `/Categories/${category_id}/img_id`)
        );
        const img_id: string = snapshot.val();
        if (img_id) {
          deleteCategoryImage(img_id);
        }
        const img_random_id = uuid();
        await uploadCategoryImage(img_file, img_random_id);
        newCategory = {
          category_name,
          modified_time: moment().format(DATE_DB_FORMAT),
          img_id: img_random_id,
        };
      }

      if (img_need_update && img_file === undefined) {
        const snapshot = await get(
          ref(database, `/Categories/${category_id}/img_id`)
        );
        const img_id: string = snapshot.val();
        if (img_id) {
          deleteCategoryImage(img_id);
        }
        newCategory = {
          category_name,
          modified_time: moment().format(DATE_DB_FORMAT),
          img_id: {},
        };
      }

      await update(ref(database, `/Categories/${category_id}`), newCategory);
    },
    [deleteCategoryImage, uploadCategoryImage]
  );

  return { categoriesList, createCategory, deleteCategory, updateCategory };
};
