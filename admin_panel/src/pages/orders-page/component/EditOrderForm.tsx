import { TextField, Box, MenuItem } from "@mui/material";
import { useFormik } from "formik";
import { memo, useMemo } from "react";
import styled from "styled-components";
import { Dialog, Title } from "../../../components";
import { Order, useOrderCRUD, useProductCRUD } from "../../../hooks";
import { useTranslation } from "react-i18next";
import { SelectProductField } from "./SelectProductField";

const StyledBox = styled(Box)`
  dispaly: flex;
  flex-direction: column;
`;

const SelectTable = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const StyledSelectTextField = styled(TextField)<{ $width?: number }>`
  width: ${({ $width }) => ($width ? $width : 30)}%;
`;
const StyledSelectField = styled(SelectProductField)<{ $width?: number }>`
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
const BottomWrapper = styled(Box)`
  padding: 10px;
`;

type Props = {
  showEditOrderForm: boolean;
  setShowEditOrderForm: React.Dispatch<React.SetStateAction<boolean>>;
  order: Order;
};
export const EditOrderForm = memo(
  ({ showEditOrderForm, setShowEditOrderForm, order }: Props) => {
    const { t } = useTranslation();
    const { productList } = useProductCRUD();
    const { updateOrderStatus } = useOrderCRUD();
    //@ts-ignore
    const formik = useFormik({
      initialValues: {
        selected_products: order.products,
        status: order.status,
      },
      onSubmit: async (values) => {
        await updateOrderStatus(order.order_id, values.status);
        setShowEditOrderForm(false);
      },
    });

    const total = useMemo(() => {
      return formik.values.selected_products.reduce((acc, cur) => {
        return acc + cur.price * cur.quantity;
      }, 0);
    }, [formik.values]);

    return (
      <Dialog
        title={<Title>{t("form.viewOrder.title")}</Title>}
        open={showEditOrderForm}
        handleClose={(value: boolean) => {
          if (!value) {
            setShowEditOrderForm(false);
          } else {
            formik.handleSubmit();
          }
        }}
        fullWidth
      >
        <StyledBox>
          <SelectTable>
            <>
              {formik.values.selected_products.map(
                ({ product_id, quantity, price, options }, index) => {
                  return (
                    <SelectTableRow key={index}>
                      <StyledSelectField
                        productList={productList}
                        $width={45}
                        select
                        id={`product_name`}
                        label={t("product.product_name")}
                        name={`selected_products.${index}.product_id`}
                        value={product_id}
                        disabled
                      />

                      <StyledSelectTextField
                        $width={10}
                        type="number"
                        value={quantity}
                        label={t("product.quantity")}
                        name={`selected_products.${index}.quantity`}
                        disabled
                      />
                      <StyledSelectTextField
                        $width={15}
                        type="number"
                        value={price}
                        label={t("product.price")}
                        name={`selected_products.${index}.price`}
                        disabled
                      />
                      {Object.entries(options).map(([optionName, choice]) => {
                        return (
                          <StyledSelectTextField
                            $width={20}
                            value={choice}
                            label={optionName}
                            name={`selected_products.${index}.${optionName}`}
                            disabled
                          />
                        );
                      })}
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
  }
);

EditOrderForm.displayName = "EditOrderForm";
