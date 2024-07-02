import { useCallback, useMemo } from "react";
import {
  Order,
  OrderProduct,
  useOrderCRUD,
  useProductCRUD,
} from "../../../hooks";
import { FormikForm, FormikFormFields } from "../../../components";
import { OrderFormActions } from "../enum";
import { useTranslation } from "react-i18next";
import { AddOrderSchema, EditOrderSchema } from "../../../yup";

export const useOrderForm = (
  action: OrderFormActions,
  selectedOrder: Order | undefined
) => {
  const { t } = useTranslation();
  const { createOrder, updateOrderStatus } = useOrderCRUD();
  const { productList } = useProductCRUD();
  const title = useMemo(() => {
    if (action === OrderFormActions.Add) {
      return t("form.addOrder.title");
    }
    if (action === OrderFormActions.Edit) {
      return t("form.editOrder.title");
    }
    if (action === OrderFormActions.View) {
      return t("form.viewOrder.title");
    }
  }, [action, t]);
  const fields: FormikForm[] = useMemo(
    () => [
      {
        label: t("order.username"),
        name: "user_id",
        disabled: [OrderFormActions.Edit, OrderFormActions.View].includes(
          action
        ),
        fieldType: FormikFormFields.SelectUserField,
      },
      {
        label: t("order.status"),
        name: "status",
        disabled: [OrderFormActions.View].includes(action),
        fieldType: FormikFormFields.SelectOrderStatusField,
      },
    ],
    [action, t]
  );

  const initValues = useMemo(() => {
    if (action === OrderFormActions.Add) {
      return {
        selected_products: [
          {
            product_id: "",
            quantity: 0,
          },
        ] as Omit<OrderProduct, "price">[],
        status: "unpaid" as Order["status"],
        user_id: "",
      };
    }

    if (action === OrderFormActions.Edit || action === OrderFormActions.View) {
      return {
        selected_products: selectedOrder?.products,
        status: selectedOrder?.status,
        user_id: selectedOrder?.user_id,
      };
    }

    return {};
  }, [selectedOrder, action]);

  const schema = useMemo(() => {
    if (action === OrderFormActions.Add) {
      return AddOrderSchema;
    }
    if (action === OrderFormActions.Edit) {
      return EditOrderSchema;
    }
  }, [action]);

  const formOnSubmit = useCallback(
    async (values: any) => {
      if (action === OrderFormActions.Add) {
        try {
          if (
            values.selected_products.some((selected_product: any) => {
              const product = productList.find(
                (product) => product.product_id === selected_product.product_id
              );
              if (!product || product.status === "unlisted") return true;
            })
          )
            return;
          const total = values.selected_products.reduce(
            (acc: number, selected_product: any) => {
              const product = productList.find(
                (product) => product.product_id === selected_product.product_id
              );
              if (!product) {
                return acc;
              }
              return acc + selected_product.quantity * product.price;
            },
            0
          );
          await createOrder(
            values.selected_products,
            values.status,
            total,
            values.user_id
          );
        } catch (e) {
          console.log(e);
        }
      }
      if (action === OrderFormActions.Edit && selectedOrder) {
        await updateOrderStatus(selectedOrder.order_id, values.status);
      }
      return () => {};
    },
    [createOrder, updateOrderStatus, action, selectedOrder, productList]
  );

  return {
    fields,
    initValues,
    schema,
    formOnSubmit,
    title,
  };
};
