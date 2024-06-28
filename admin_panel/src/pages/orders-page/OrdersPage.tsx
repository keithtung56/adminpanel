import { memo, useCallback, useState, useMemo } from "react";
import { AddButton, DeleteButton, GenericTable } from "../../components";
import { Card, Box, Checkbox, Button } from "@mui/material";
import styled from "styled-components";
import { Order, useOrderCRUD } from "../../hooks";
import { AddOrderForm, EditOrderForm, ViewOrderForm } from "./component";
import { useProductCRUD, useUserCRUD } from "../../hooks";
import { useTranslation } from "react-i18next";
import { DATE_DISPLAY_FORMAT } from "../../constants";
import { EditIcon, ViewIcon } from "../../icons";

const StyledCard = styled(Card)`
  border-radius: 20px;
  overflow: auto;
  margin-top: 10px;
  height: 100%;
  padding: 20px;
`;

const StyledAddButton = styled(AddButton)``;
const StyledDeleteButton = styled(DeleteButton)``;
const LeftButtons = styled(Box)``;
const RightButtons = styled(Box)`
  display: flex;
  gap: 1vw;
  float: right;
`;
const ButtonWrapper = styled(Box)``;

const StyledTable = styled(GenericTable)`
  .MuiTableHead-root {
    background-color: ${({ theme }) => theme.colors.greys[4]};
    * {
      color: ${({ theme }) => theme.colors.white};
      font-size: ${({ theme }) => theme.fontSize.medium};
    }
  }
  .MuiTableBody-root {
    * {
      color: ${({ theme }) => theme.colors.black};
      font-size: ${({ theme }) => theme.fontSize.small};
    }
  }
`;

const StyledViewIcon = styled(ViewIcon)`
  margin-right: 5px;
`;
const StyledEditIcon = styled(EditIcon)`
  margin-right: 5px;
`;
export const OrdersPage = memo(() => {
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [showViewOrderForm, setShowViewOrderForm] = useState<boolean>(false);

  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [editOrder, setEditOrder] = useState<any>(null);

  const { orderList, deleteOrder } = useOrderCRUD();
  const { productList } = useProductCRUD();
  const { userList } = useUserCRUD();
  const AddButtonOnClick = useCallback(() => {
    setShowAddForm(true);
  }, [setShowAddForm]);

  const DeleteButtonOnClick = useCallback(async () => {
    await Promise.all(
      selectedOrderIds.map((selectedOrderId) => deleteOrder(selectedOrderId))
    );
  }, [selectedOrderIds, deleteOrder]);

  const CheckBoxOnClick = useCallback(
    (selectedId: string) => {
      if (selectedOrderIds.indexOf(selectedId) != -1) {
        setSelectedOrderIds(selectedOrderIds.filter((id) => id !== selectedId));
      } else {
        setSelectedOrderIds([...selectedOrderIds, selectedId]);
      }
    },
    [selectedOrderIds, setSelectedOrderIds]
  );

  const listGenerator = useMemo(
    () => [
      {
        key: "delete",
        header: "",
        render: (data: Order) => (
          <Checkbox
            checked={selectedOrderIds.indexOf(data.order_id) != -1}
            onClick={() => {
              CheckBoxOnClick(data.order_id);
            }}
          />
        ),
      },
      {
        key: "user",
        header: t("order.username"),
        render: (data: Order) =>
          userList.find((user) => user.uid === data.user_id)?.username ?? "",
      },
      {
        key: "products",
        header: t("order.products"),
        render: (data: Order) => {
          const products = data.products;
          let overflow = false;
          //@ts-ignore
          const productsString = products.reduce((acc, cur) => {
            const product = productList.find(
              ({ product_id }) => product_id === cur.product_id
            );

            if (
              product &&
              `${cur.quantity}x${product.product_name}, ${acc}`.length > 60
            ) {
              overflow = true;
            }
            return product && !overflow
              ? `${cur.quantity}x${product.product_name}, ${acc}`
              : acc;
          }, "");
          return overflow ? `${productsString}......` : productsString;
        },
      },
      {
        key: "total",
        header: t("order.total"),
        render: (data: Order) => data.total,
      },
      {
        key: "status",
        header: t("order.status"),
        render: (data: Order) => t(`order.${data.status}`),
      },
      {
        key: "created_time",
        header: t("order.created_time"),
        render: (data: Order) => data.created_time.format(DATE_DISPLAY_FORMAT),
      },
      {
        key: "modified_time",
        header: t("order.modified_time"),
        render: (data: Order) => data.modified_time.format(DATE_DISPLAY_FORMAT),
      },
      {
        key: "edit",
        header: "",
        render: (data: Order) => (
          <>
            <Button
              variant="outlined"
              onClick={() => {
                setEditOrder(data);
                setShowViewOrderForm(true);
              }}
            >
              <StyledViewIcon />
              {t("button.view")}
            </Button>
            {data.status === "unpaid" && (
              <Button
                variant="outlined"
                onClick={() => {
                  setEditOrder(data);
                  setShowEditForm(true);
                }}
              >
                <StyledEditIcon />
                {t("button.edit")}
              </Button>
            )}
          </>
        ),
      },
    ],
    [selectedOrderIds, CheckBoxOnClick, setEditOrder, productList, t, userList]
  );

  const sortedorderList = useMemo(
    () =>
      orderList.sort((a, b) =>
        a.created_time.isSameOrAfter(b.created_time) ? -1 : 1
      ),
    [orderList]
  );
  return (
    <>
      <ButtonWrapper>
        <LeftButtons></LeftButtons>
        <RightButtons>
          <StyledAddButton onClick={AddButtonOnClick}></StyledAddButton>
          <StyledDeleteButton onClick={DeleteButtonOnClick} />
        </RightButtons>
      </ButtonWrapper>
      <StyledCard>
        {
          <StyledTable
            data={sortedorderList}
            //@ts-ignore
            generator={listGenerator}
            unique_col={"order_id"}
          />
        }
      </StyledCard>

      {showAddForm && (
        <AddOrderForm
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
        />
      )}
      {showViewOrderForm && (
        <ViewOrderForm
          showViewOrderForm={showViewOrderForm}
          setShowViewOrderForm={setShowViewOrderForm}
          order={editOrder}
        />
      )}
      {showEditForm && (
        <EditOrderForm
          showEditOrderForm={showEditForm}
          setShowEditOrderForm={setShowEditForm}
          order={editOrder}
        />
      )}
    </>
  );
});
OrdersPage.displayName = "OrdersPage";
