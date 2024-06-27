import { ref, onValue, update, remove } from "firebase/database";
import { auth, database } from "../firebase";
import { useCallback, useEffect, useState } from "react";
import uuid from "react-uuid";
import moment from "moment";
import { DATE_DB_FORMAT } from "../constants";
import { useProductCRUD } from "./useProductCRUD";

export type OrderProduct = {
  product_id: string;
  quantity: number;
  price: number;
  options: {
    [key: string]: string;
  };
};
export type Order = {
  order_id: string;
  products: OrderProduct[];
  created_time: moment.Moment;
  modified_time: moment.Moment;
  status: "paid" | "unpaid";
  total: number;
  user_id: string;
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
            const { created_time, modified_time, user, ...others } = attr;
            return [
              ...acc,
              {
                ...others,
                user_id: user,
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
      selected_products: Omit<OrderProduct, "price">[],
      status: Order["status"],
      total: number,
      user_id: string
    ) => {
      const random_order_id = uuid();

      await Promise.all([
        update(ref(database, `/Orders/${random_order_id}`), {
          total,
          status: status,
          created_time: moment().format(DATE_DB_FORMAT),
          modified_time: moment().format(DATE_DB_FORMAT),
          user: user_id,
        }),
        update(ref(database, `/Users/${user_id}/orders/`), {
          [random_order_id]: "",
        }),
        ...selected_products.map(({ product_id, quantity, options }) => {
          const product = productList.find(
            (product) => product.product_id === product_id
          );
          if (product) {
            const random_order_product_id = uuid();
            update(
              ref(
                database,
                `/Orders/${random_order_id}/products/${random_order_product_id}`
              ),
              {
                product_id,
                quantity,
                price: product.price,
                options,
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
    await remove(
      ref(database, `/Users/${auth.currentUser?.uid}/orders/${order_id}`)
    );
  }, []);

  const updateOrder = useCallback(
    async (
      order_id: string,
      total: number,
      selected_products: { product_id: string; quantity: number }[]
    ) => {
      await remove(ref(database, `/Orders/${order_id}/products`));
      await Promise.all([
        update(ref(database, `/Orders/${order_id}`), {
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

  const updateOrderStatus = useCallback(
    async (order_id: string, status: Order["status"]) => {
      await update(ref(database, `/Orders/${order_id}`), { status });
    },
    []
  );
  return {
    orderList,
    createOrder,
    deleteOrder,
    updateOrder,
    updateOrderStatus,
  };
};
