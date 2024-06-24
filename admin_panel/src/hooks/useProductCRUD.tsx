import { ref, onValue, update, remove, get } from "firebase/database";
import { database } from "../firebase";
import { useCallback, useEffect, useState } from "react";
import uuid from "react-uuid";
import moment from "moment";
import { DATE_DB_FORMAT } from "../constants";
import { useProductImageCRUD } from "./useProductImageCRUD";

type ProcessedOptions = {
  option_name: string;
  choices: string[];
}[];
export type Product = {
  product_id: string;
  category_id: string;
  product_name: string;
  price: number;
  created_time: moment.Moment;
  modified_time: moment.Moment;
  description: string;
  img_id?: string;
  options: ProcessedOptions;
};
export const useProductCRUD = () => {
  const [productList, setproductList] = useState<Product[]>([]);
  const { deleteProductImage, uploadProductImage } = useProductImageCRUD();

  useEffect(() => {
    const unsubscribe = onValue(ref(database, "/Products"), (snapshot) => {
      const res = snapshot.val();
      if (res) {
        setproductList(
          //@ts-ignore
          Object.entries(res).reduce(
            (acc: string[], [id, attr]: [string, any]) => {
              const { created_time, modified_time, options, ...others } = attr;

              let processed_options = [] as ProcessedOptions;
              if (options) {
                processed_options = Object.entries(options).map(
                  ([option_name, choicesObj]: [string, any]) => ({
                    option_name,
                    choices: Object.keys(choicesObj),
                  })
                );
              }

              return [
                ...acc,
                {
                  ...others,
                  product_id: id,
                  created_time: moment(created_time, DATE_DB_FORMAT),
                  modified_time: moment(modified_time, DATE_DB_FORMAT),
                  options: processed_options,
                },
              ];
            },
            []
          )
        );
      } else {
        setproductList([]);
      }
    });
    return unsubscribe;
  }, [setproductList]);

  const createProduct = useCallback(
    async (
      product_name: string,
      price: number,
      category_id: string,
      description: string,
      img_file: File | undefined,
      img_need_update: boolean,
      options: { option_name: string; choices: string }[]
    ) => {
      const product_random_id = uuid();
      let img_random_id;
      if (img_need_update && img_file) {
        img_random_id = uuid();
        await uploadProductImage(img_file, img_random_id);
      }

      const newProduct = {
        product_name,
        price,
        category_id,
        description,
        created_time: moment().format(DATE_DB_FORMAT),
        modified_time: moment().format(DATE_DB_FORMAT),
        img_id: img_random_id ? img_random_id : {},
      };

      await update(ref(database, `/Products/${product_random_id}`), newProduct);
      await Promise.all(
        options.map(async ({ option_name, choices }) => {
          const choices_arr = choices.split(",");
          await Promise.all(
            choices_arr.map(async (choice) => {
              await update(
                ref(
                  database,
                  `/Products/${product_random_id}/options/${option_name}`
                ),
                { [choice]: "" }
              );
            })
          );
        })
      );
    },
    []
  );

  const deleteProduct = useCallback(async (product_id: string) => {
    const snapshot = await get(ref(database, `/Products/${product_id}/img_id`));
    const img_id: string = snapshot.val();
    if (img_id) {
      deleteProductImage(img_id);
    }
    await remove(ref(database, `/Products/${product_id}`));
  }, []);

  const updateProduct = useCallback(
    async (
      product_id: string,
      product_name: string,
      price: number,
      category_id: string,
      description: string,
      img_file: File | undefined,
      img_need_update: boolean,
      options: { option_name: string; choices: string }[]
    ) => {
      let newProduct = {};

      if (!img_need_update) {
        newProduct = {
          product_name,
          price,
          category_id,
          description,
          modified_time: moment().format(DATE_DB_FORMAT),
        };
      }
      //upload new image
      if (img_need_update && img_file) {
        const snapshot = await get(
          ref(database, `/Products/${product_id}/img_id`)
        );
        const img_id: string = snapshot.val();
        if (img_id) {
          deleteProductImage(img_id);
        }
        const img_random_id = uuid();
        await uploadProductImage(img_file, img_random_id);
        newProduct = {
          product_name,
          price,
          category_id,
          description,
          modified_time: moment().format(DATE_DB_FORMAT),
          img_id: img_random_id,
        };
      }
      //remove current image
      if (img_need_update && img_file === undefined) {
        const snapshot = await get(
          ref(database, `/Products/${product_id}/img_id`)
        );
        const img_id: string = snapshot.val();
        if (img_id) {
          deleteProductImage(img_id);
        }
        newProduct = {
          product_name,
          price,
          category_id,
          description,
          modified_time: moment().format(DATE_DB_FORMAT),
          img_id: {},
        };
      }
      await update(ref(database, `/Products/${product_id}`), newProduct);
      await update(ref(database, `/Products/${product_id}`), {
        options: {},
      });
      await Promise.all(
        options.map(async ({ option_name, choices }) => {
          const choices_arr = choices.split(",");
          await Promise.all(
            choices_arr.map(async (choice) => {
              await update(
                ref(database, `/Products/${product_id}/options/${option_name}`),
                { [choice]: "" }
              );
            })
          );
        })
      );
    },
    []
  );

  return { productList, createProduct, deleteProduct, updateProduct };
};
