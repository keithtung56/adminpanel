import { TextField, Box, Button, MenuItem } from "@mui/material";
import { useFormik } from "formik";
import { memo, useMemo } from "react";
import styled from "styled-components";
import { Dialog, Title } from "../../../components";
import {
  Order,
  OrderProduct,
  useOrderCRUD,
  useProductCRUD,
} from "../../../hooks";
import { AddOrderSchema } from "../../../yup";
import { useTranslation } from "react-i18next";
import { SelectProductField } from "./SelectProductField";
import { SelectOptionField } from "./SelectOptionField";

const StyledBox = styled(Box)`
  dispaly: flex;
  flex-direction: column;
`;

const SelectTable = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2vh;
`;

const StyledSelectOptionField = styled(SelectOptionField)<{ $width?: number }>`
  width: ${({ $width }) => ($width ? $width : 30)}%;
`;

const SelectTableRow = styled(Box)`
  width: 100%;
  display: flex;
  gap: 1.5vw;
  border-bottom: 1px solid ${({ theme }) => theme.colors.greys[3]};
  padding: 10px;
  flex-wrap: wrap;
`;

const StyledSelectTextField = styled(TextField)<{ $width?: number }>`
  width: ${({ $width }) => ($width ? $width : 30)}%;
`;
const StyledSelectProductField = styled(SelectProductField)<{
  $width?: number;
}>`
  width: ${({ $width }) => ($width ? $width : 30)}%;
`;
const AddProductButton = styled(Button)`
  float: left;
`;
const DeleteProductButton = styled(Button)`
  float: right;
`;
const BottomWrapper = styled(Box)`
  padding: 10px;
`;
type Props = {
  showAddForm: boolean;
  setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
};
export const AddOrderForm = memo(({ showAddForm, setShowAddForm }: Props) => {
  const { t } = useTranslation();
  const { createOrder } = useOrderCRUD();
  const { productList } = useProductCRUD();
  //@ts-ignore

  const formik = useFormik({
    initialValues: {
      selected_products: [] as Omit<OrderProduct, "price">[],
      status: "unpaid" as Order["status"],
    },
    validationSchema: AddOrderSchema,
    enableReinitialize: false,
    onSubmit: async (values) => {
      console.log("asd");

      try {
        if (
          values.selected_products.some((selected_product) => {
            const product = productList.find(
              (product) => product.product_id === selected_product.product_id
            );
            if (!product) return true;
            return (
              Object.keys(selected_product.options).length !==
              product.options.length
            );
          })
        )
          return;
        await createOrder(values.selected_products, values.status, total);
        setShowAddForm(false);
      } catch (e) {
        console.log(e);
      }
    },
  });
  console.log(formik.values);

  const total = useMemo(() => {
    return formik.values.selected_products.reduce((acc, cur) => {
      if (cur.product_id === "") {
        return acc;
      }
      const selected_product = productList.find(
        ({ product_id }) => product_id === cur.product_id
      );
      const product_price = Number(selected_product?.price) ?? 0;
      return acc + product_price * cur.quantity;
    }, 0);
  }, [formik.values, productList]);

  return (
    <Dialog
      //@ts-ignore
      title={<Title>{t("form.addOrder.title")}</Title>}
      open={showAddForm}
      handleClose={(value: boolean) => {
        if (!value) {
          setShowAddForm(false);
        } else {
          formik.handleSubmit();
        }
      }}
      fullWidth
    >
      <StyledBox>
        <SelectTable>
          <>
            <Box>
              <AddProductButton
                onClick={() => {
                  formik.setFieldValue("selected_products", [
                    ...formik.values.selected_products,
                    {
                      product_id: "",
                      quantity: 0,
                      options: {},
                    },
                  ]);
                }}
              >
                {t("form.addOrder.body.addProduct")}
              </AddProductButton>
            </Box>
            {formik.values.selected_products.map(
              ({ product_id, quantity }, index) => {
                const product = productList.find(
                  ({ product_id: id }) => product_id === id
                );
                const product_unit_price = product ? product.price : 0;
                const product_options = product ? product.options : [];
                return (
                  <SelectTableRow key={index}>
                    <StyledSelectProductField
                      productList={productList}
                      $width={45}
                      select
                      id={`product_name`}
                      label={t("product.product_name")}
                      name={`selected_products.${index}.product_id`}
                      value={product_id}
                      onChange={formik.handleChange}
                      onBlur={() => {
                        formik.setFieldTouched(
                          `selected_products.${index}.product_id`
                        );
                      }}
                    />

                    <StyledSelectTextField
                      $width={10}
                      type="number"
                      value={quantity}
                      label={t("product.quantity")}
                      name={`selected_products.${index}.quantity`}
                      onChange={formik.handleChange}
                      onBlur={() => {
                        formik.setFieldTouched(
                          `selected_products.${index}.quantity`
                        );
                      }}
                    />
                    <StyledSelectTextField
                      $width={15}
                      type="number"
                      value={product_unit_price}
                      label={t("product.price")}
                      name={`selected_products.${index}.price`}
                      disabled
                    />
                    {product_options.map(({ option_name, choices }) => {
                      return (
                        <StyledSelectOptionField
                          key={option_name}
                          $width={20}
                          choices={choices}
                          name={`selected_products.${index}.options.${option_name}`}
                          label={option_name}
                          value={
                            formik.values.selected_products[index].options[
                              option_name
                            ]
                          }
                          onChange={formik.handleChange}
                        />
                      );
                    })}
                    <DeleteProductButton
                      onClick={() => {
                        formik.setFieldValue(
                          "selected_products",
                          formik.values.selected_products.filter(
                            (_, idx) => idx !== index
                          ),
                          true
                        );
                      }}
                    >
                      {t("button.delete")}
                    </DeleteProductButton>
                  </SelectTableRow>
                );
              }
            )}
          </>
        </SelectTable>
        <BottomWrapper>
          <StyledSelectTextField
            select
            label="status"
            value={formik.values.status}
            name={`status`}
            onChange={formik.handleChange}
          >
            {["paid", "unpaid"].map((status) => {
              return (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              );
            })}
          </StyledSelectTextField>
          <Box>
            {t("order.total")}: ${total}
          </Box>
        </BottomWrapper>
      </StyledBox>
    </Dialog>
  );
});

AddOrderForm.displayName = "AddOrderForm";
