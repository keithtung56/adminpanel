import { ref, onValue, update, remove } from "firebase/database";
import { database } from "../firebase";
import { useCallback, useEffect, useState } from "react";
import uuid from "react-uuid";
import moment from "moment";
import { DATE_DB_FORMAT } from "../constants";
import { useProductCRUD } from "./useProductCRUD";

export type Order = {
  order_id: string;
  order_name: string;
  products: { product_id: string; quantity: number }[];
  created_time: moment.Moment;
  modified_time: moment.Moment;
  status: string;
  total: number;
};
export const useOrderCRUD = () => {
  const [orderList, setorderList] = useState<Order[]>([]);
  const { productList } = useProductCRUD();
  useEffect(() => {
    const unsubscribe = onValue(ref(database, "/Orders"), (snapshot) => {
      const res = snapshot.val();
      if (res) {
        const returnOrderList = Object.entries(res).reduce(
          (acc: string[], [id, attr]: [string, any]) => {
            const { created_time, modified_time, ...others } = attr;
            return [
              ...acc,
              {
                ...others,
                order_id: id,
                created_time: moment(created_time, DATE_DB_FORMAT),
                modified_time: moment(modified_time, DATE_DB_FORMAT),
              },
            ];
          },
          []
        );
        const expandedProducts = returnOrderList.map(
          //@ts-ignore
          ({ products, ...data }) => {
            if (!products) {
              return {
                ...data,
                products: [],
              };
            }
            const productIds = Object.keys(products);
            const expandedProduct = productIds.map((id) => ({
              product_id: id,
              ...products[id],
            }));
            return {
              ...data,
              products: expandedProduct,
            };
          }
        );

        setorderList(expandedProducts);
      } else {
        setorderList([]);
      }
    });
    return unsubscribe;
  }, [setorderList]);

  const createOrder = useCallback(
    async (
      order_name: string,
      selected_products: { product_id: string; quantity: number }[],
      total: number
    ) => {
      const random_id = uuid();

      await Promise.all([
        update(ref(database, `/Orders/${random_id}`), {
          order_name,
          total,
          status: "pending",
          created_time: moment().format(DATE_DB_FORMAT),
          modified_time: moment().format(DATE_DB_FORMAT),
        }),
        ...selected_products.map(({ product_id, quantity }) => {
          const product = productList.find(
            (product) => product.product_id === product_id
          );
          if (product) {
            update(
              ref(database, `/Orders/${random_id}/products/${product_id}`),
              {
                quantity,
                price: product.price,
              }
            );
          }
        }),
      ]);
    },
    [productList]
  );

  const deleteOrder = useCallback(async (order_id: string) => {
    await remove(ref(database, `/Orders/${order_id}`));
  }, []);

  const updateOrder = useCallback(
    async (
      order_id: string,
      order_name: string,
      total: number,
      selected_products: { product_id: string; quantity: number }[]
    ) => {
      await remove(ref(database, `/Orders/${order_id}/products`));
      await Promise.all([
        update(ref(database, `/Orders/${order_id}`), {
          order_name,
          total,
          modified_time: moment().format(DATE_DB_FORMAT),
        }),
        ...selected_products.map(({ product_id, quantity }) => {
          const product = productList.find(
            (product) => product.product_id === product_id
          );
          if (product) {
            update(
              ref(database, `/Orders/${order_id}/products/${product_id}`),
              {
                quantity,
                price: product.price,
              }
            );
          }
        }),
      ]);
    },
    [productList]
  );
  return { orderList, createOrder, deleteOrder, updateOrder };
};
