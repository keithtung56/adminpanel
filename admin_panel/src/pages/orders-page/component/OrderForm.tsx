import { TextField, Box, Button } from "@mui/material";
import { useFormik } from "formik";
import { memo, useMemo } from "react";
import styled from "styled-components";
import { Dialog, Title, useFormikFields } from "../../../components";
import { Order, useProductCRUD } from "../../../hooks";
import { useTranslation } from "react-i18next";
import { SelectProductField } from "./SelectProductField";
import { SelectOptionField } from "./SelectOptionField";
import { useOrderForm } from "../hooks";
import { OrderFormActions } from "../enum";

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

const ProductRow = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.greys[3]};
  padding: 10px;
`;

const ProductOptionsRow = styled(Box)`
  display: flex;
  gap: 10px;
`;
const ProductDetailsRow = styled(Box)`
  display: flex;
  gap: 10px;
  jutify-content: space-between;
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
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 50%;
`;
type Props = {
  selectedOrder: Order | undefined;
  formAction: OrderFormActions;
  setFormAction: React.Dispatch<
    React.SetStateAction<OrderFormActions | undefined>
  >;
};
export const OrderForm = memo(
  ({ selectedOrder, formAction, setFormAction }: Props) => {
    const { t } = useTranslation();
    const { productList } = useProductCRUD();
    const { fields, initValues, schema, formOnSubmit, title } = useOrderForm(
      formAction,
      selectedOrder
    );

    //@ts-ignore
    const formik = useFormik({
      initialValues: initValues,
      validationSchema: schema,
      onSubmit: formOnSubmit,
    });
    const { fieldsCompoents } = useFormikFields({ fields, formik });
    const total = useMemo(() => {
      return formik.values.selected_products!.reduce((acc, cur) => {
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
        title={<Title>{title}</Title>}
        open
        handleClose={async (value: boolean) => {
          if (!value) {
            setFormAction(undefined);
          } else {
            formik.handleSubmit();
            setFormAction(undefined);
          }
        }}
        fullWidth
      >
        <StyledBox>
          <SelectTable>
            <>
              <Box>
                {[OrderFormActions.Add].includes(formAction) && (
                  <AddProductButton
                    onClick={() => {
                      formik.setFieldValue("selected_products", [
                        ...formik.values.selected_products!,
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
                )}
              </Box>
              {formik.values.selected_products!.map(
                ({ product_id, quantity }, index) => {
                  const product = productList.find(
                    ({ product_id: id }) => product_id === id
                  );
                  const product_unit_price = product ? product.price : 0;
                  const product_options = product ? product.options : [];
                  return (
                    <ProductRow key={index}>
                      <ProductDetailsRow>
                        <StyledSelectProductField
                          productList={productList}
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
                          disabled={[
                            OrderFormActions.Edit,
                            OrderFormActions.View,
                          ].includes(formAction)}
                        />

                        <StyledSelectTextField
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
                          disabled={[
                            OrderFormActions.Edit,
                            OrderFormActions.View,
                          ].includes(formAction)}
                        />
                        <StyledSelectTextField
                          type="number"
                          value={product_unit_price}
                          label={t("product.price")}
                          name={`selected_products.${index}.price`}
                          disabled
                        />
                        {[OrderFormActions.Add].includes(formAction) && (
                          <DeleteProductButton
                            onClick={() => {
                              formik.setFieldValue(
                                "selected_products",
                                formik.values.selected_products!.filter(
                                  (_, idx) => idx !== index
                                ),
                                true
                              );
                            }}
                          >
                            {t("button.delete")}
                          </DeleteProductButton>
                        )}
                      </ProductDetailsRow>

                      <ProductOptionsRow>
                        {product_options.map(({ option_name, choices }) => {
                          return (
                            <StyledSelectOptionField
                              key={option_name}
                              $width={20}
                              choices={choices}
                              name={`selected_products.${index}.options.${option_name}`}
                              label={option_name}
                              value={
                                formik.values.selected_products![index].options[
                                  option_name
                                ]
                              }
                              onChange={formik.handleChange}
                              disabled={formAction === OrderFormActions.View}
                            />
                          );
                        })}
                      </ProductOptionsRow>
                    </ProductRow>
                  );
                }
              )}
            </>
          </SelectTable>
          <BottomWrapper>
            {fieldsCompoents}
            <Box>
              {t("order.total")}: ${total}
            </Box>
          </BottomWrapper>
        </StyledBox>
      </Dialog>
    );
  }
);

OrderForm.displayName = "OrderForm";
