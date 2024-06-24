import { TextField, Box, Button } from "@mui/material";
import { useFormik } from "formik";
import { memo, useMemo } from "react";
import styled from "styled-components";
import { Dialog, Title } from "../../../components";
import { useOrderCRUD, useProductCRUD } from "../../../hooks";
import { AddOrderSchema } from "../../../yup";
import { useTranslation } from "react-i18next";
import { SelectProductField } from "./SelectProductField";

const StyledBox = styled(Box)`
  dispaly: flex;
  flex-direction: column;
`;
const StyledTextField = styled(TextField)`
  margin-top: 10px;
`;

const SelectTable = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2vh;
`;

const SelectTableRow = styled(Box)`
  width: 100%;
  display: flex;
  gap: 5vw;
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
      order_name: "",
      selected_products: [] as { product_id: string; quantity: number }[],
    },
    enableReinitialize: false,
    validationSchema: AddOrderSchema,
    onSubmit: async (values) => {
      try {
        await createOrder(values.order_name, values.selected_products, total);
        setShowAddForm(false);
      } catch (e) {
        console.log(e);
      }
    },
  });

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
        <StyledTextField
          id="order_name"
          label={t("order.order_name")}
          name="order_name"
          value={formik.values.order_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.order_name && Boolean(formik.errors.order_name)}
          helperText={
            formik.touched.order_name &&
            formik.errors.order_name &&
            t(formik.errors.order_name)
          }
          fullWidth
        />
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
                    },
                  ]);
                }}
              >
                {t("form.addOrder.body.addProduct")}
              </AddProductButton>
            </Box>
            {formik.values.selected_products.map(
              ({ product_id, quantity }, index) => {
                const product_unit_price =
                  productList.find(({ product_id: id }) => product_id === id)
                    ?.price ?? 0;
                return (
                  <SelectTableRow key={index}>
                    <StyledSelectProductField
                      productList={productList}
                      $width={60}
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
                      name={`selected_products.${index}.quantity`}
                      disabled
                    />
                    <Button
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
                    </Button>
                  </SelectTableRow>
                );
              }
            )}
          </>
        </SelectTable>
        {t("order.total")}: ${total}
      </StyledBox>
    </Dialog>
  );
});

AddOrderForm.displayName = "AddOrderForm";
