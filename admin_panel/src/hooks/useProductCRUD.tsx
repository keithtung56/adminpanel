import { ref, onValue, update, remove, get } from "firebase/database";
import { database } from "../firebase";
import { useCallback, useEffect, useState } from "react";
import uuid from "react-uuid";
import moment from "moment";
import { DATE_DB_FORMAT } from "../constants";
import { useProductImageCRUD } from "./useProductImageCRUD";

export type DBOptions = {
  option_name: string;
  choices: string[];
}[];

export type FormOptions = {
  option_name: string;
  choices: string;
}[];
export type Product = {
  product_id: string;
  category_id: string;
  product_name: string;
  status: "listed" | "unlisted";
  stock: number;
  price: number;
  created_time: moment.Moment;
  modified_time: moment.Moment;
  description: string;
  img_id?: string;
  options: DBOptions;
};

export const productStatusOptions: Product["status"][] = ["listed", "unlisted"];

const formOptionsToDBOptions = (
  notProcessedOptions: FormOptions
): DBOptions => {
  return notProcessedOptions.map(({ option_name, choices }) => ({
    option_name: option_name,
    choices: choices.split(","),
  }));
};
export const useProductCRUD = () => {
  const [productList, setproductList] = useState<Product[]>([]);
  const { deleteProductImage, uploadProductImage } = useProductImageCRUD();

  useEffect(() => {
    const unsubscribe = onValue(ref(database, "/Products"), (snapshot) => {
      const res = snapshot.val();
      if (!res) {
        setproductList([]);
        return;
      }
      setproductList(
        //@ts-ignore
        Object.entries(res).reduce(
          (acc: string[], [id, attr]: [string, any]) => {
            const {
              created_time,
              modified_time,
              options: optionsObj,
              ...others
            } = attr;
            let options: DBOptions = [];
            if (optionsObj) {
              options = Object.entries(optionsObj).map(([key, value]) => {
                return {
                  option_name: key,
                  choices: value,
                };
              }) as DBOptions;
            }
            return [
              ...acc,
              {
                ...others,
                product_id: id,
                created_time: moment(created_time, DATE_DB_FORMAT),
                modified_time: moment(modified_time, DATE_DB_FORMAT),
                options: options,
              },
            ];
          },
          []
        )
      );
    });
    return unsubscribe;
  }, [setproductList]);

  const createProduct = useCallback(
    async (
      product_name: Product["product_name"],
      price: Product["price"],
      status: Product["status"],
      stock: Product["stock"],
      category_id: Product["category_id"],
      description: Product["description"],
      img_file: File,
      options: FormOptions
    ) => {
      const product_random_id = uuid();
      const img_random_id = uuid();
      await uploadProductImage(img_file, img_random_id);

      const newProduct = {
        product_name,
        price,
        status,
        stock,
        category_id,
        description,
        created_time: moment().format(DATE_DB_FORMAT),
        modified_time: moment().format(DATE_DB_FORMAT),
        img_id: img_random_id,
      };

      await update(ref(database, `/Products/${product_random_id}`), newProduct);

      const dBOptions = formOptionsToDBOptions(options);
      await Promise.all(
        dBOptions.map(async ({ option_name, choices }) => {
          await Promise.all(
            choices.map(async (choice, index) => {
              await update(
                ref(
                  database,
                  `/Products/${product_random_id}/options/${option_name}`
                ),
                { [index]: choice }
              );
            })
          );
        })
      );
    },
    [uploadProductImage]
  );

  const deleteProduct = useCallback(
    async (product_id: string) => {
      const snapshot = await get(
        ref(database, `/Products/${product_id}/img_id`)
      );
      const img_id: string = snapshot.val();
      if (img_id) {
        deleteProductImage(img_id);
      }
      await remove(ref(database, `/Products/${product_id}`));
    },
    [deleteProductImage]
  );

  const updateProduct = useCallback(
    async (
      product_id: string,
      product_name: string,
      price: number,
      status: string,
      category_id: string,
      description: string,
      img_file: File | undefined,
      img_need_update: boolean,
      options: FormOptions
    ) => {
      let newProduct = {};

      if (!img_need_update) {
        newProduct = {
          product_name,
          price,
          status,
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
      await update(ref(database, `/Products/${product_id}`), newProduct);
      await update(ref(database, `/Products/${product_id}`), {
        options: {},
      });
      if (options) {
        const dBOptions = formOptionsToDBOptions(options);
        await Promise.all(
          dBOptions.map(async ({ option_name, choices }) => {
            await Promise.all(
              choices.map(async (choice, index) => {
                await update(
                  ref(
                    database,
                    `/Products/${product_id}/options/${option_name}`
                  ),
                  { [index]: choice }
                );
              })
            );
          })
        );
      }
    },
    [deleteProductImage, uploadProductImage]
  );

  return { productList, createProduct, deleteProduct, updateProduct };
};
