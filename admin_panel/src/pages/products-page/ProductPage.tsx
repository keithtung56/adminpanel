import { Box, Button, Card, Checkbox } from "@mui/material";
import { memo, useCallback, useState, useMemo } from "react";
import { AddButton, DeleteButton, GenericTable } from "../../components";
import styled from "styled-components";
import {} from "../../components";
import { Product, useCategoryCRUD, useProductCRUD } from "../../hooks";
import { AddProductForm } from "./component";
import { EditProductForm } from "./component/EditProductForm";
import { useTranslation } from "react-i18next";
import { DATE_DISPLAY_FORMAT } from "../../constants";
import { EditIcon } from "../../icons";

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

const StyledEditIcon = styled(EditIcon)`
  margin-right: 5px;
`;
const ButtonWrapper = styled(Box)``;
export const ProductsPage = memo(() => {
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const { productList, deleteProduct } = useProductCRUD();
  const { categoriesList } = useCategoryCRUD();
  const [editProduct, setEditProduct] = useState<any>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const AddButtonOnClick = useCallback(() => {
    setShowAddForm(true);
  }, [setShowAddForm]);

  const DeleteButtonOnClick = useCallback(async () => {
    await Promise.all(
      selectedProductIds.map((selectedProductId) =>
        deleteProduct(selectedProductId)
      )
    );
  }, [selectedProductIds, deleteProduct]);

  const CheckBoxOnClick = useCallback(
    (selectedId: string) => {
      if (selectedProductIds.indexOf(selectedId) != -1) {
        setSelectedProductIds(
          selectedProductIds.filter((id) => id !== selectedId)
        );
      } else {
        setSelectedProductIds([...selectedProductIds, selectedId]);
      }
    },
    [setSelectedProductIds, selectedProductIds]
  );

  const listGenerator = useMemo(
    () => [
      {
        key: "delete",
        header: "",
        render: (data: Product) => (
          <Checkbox
            checked={selectedProductIds.indexOf(data.product_id) != -1}
            onClick={() => {
              CheckBoxOnClick(data.product_id);
            }}
          />
        ),
      },
      {
        key: "product_name",
        header: t("product.product_name"),
        render: (data: Product) => data.product_name,
      },
      {
        key: "price",
        header: t("product.price"),
        render: (data: Product) => data.price,
      },
      {
        key: "category",
        header: t("product.category"),
        render: (data: Product) => {
          const category = categoriesList.find(
            (category) => category.category_id === data.category_id
          );
          if (category) {
            return category.category_name;
          }
          return "";
        },
      },
      {
        key: "created_time",
        header: t("product.created_time"),
        render: (data: Product) =>
          data.created_time.format(DATE_DISPLAY_FORMAT),
      },
      {
        key: "modified_time",
        header: t("product.modified_time"),
        render: (data: Product) =>
          data.modified_time.format(DATE_DISPLAY_FORMAT),
      },
      {
        key: "edit",
        header: "",
        render: (data: Product) => (
          <Button
            variant="outlined"
            onClick={() => {
              setEditProduct(data);
              setShowEditForm(true);
            }}
          >
            <StyledEditIcon />
            {t("button.edit")}
          </Button>
        ),
      },
    ],
    [selectedProductIds, CheckBoxOnClick, setEditProduct, t, categoriesList]
  );

  const sortedproductList = useMemo(
    () =>
      productList.sort((a, b) =>
        a.created_time.isSameOrAfter(b.created_time) ? -1 : 1
      ),
    [productList]
  );

  return (
    <>
      <ButtonWrapper>
        <LeftButtons></LeftButtons>
        <RightButtons>
          <StyledAddButton onClick={AddButtonOnClick} />
          <StyledDeleteButton onClick={DeleteButtonOnClick} />
        </RightButtons>
      </ButtonWrapper>

      <StyledCard>
        {
          <StyledTable
            data={sortedproductList}
            //@ts-ignore
            generator={listGenerator}
            unique_col="product_id"
          />
        }
      </StyledCard>
      {showAddForm && (
        <AddProductForm
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
        />
      )}
      {showEditForm && (
        <EditProductForm
          showEditForm={showEditForm}
          setShowEditForm={setShowEditForm}
          product={editProduct}
        />
      )}
    </>
  );
});

ProductsPage.displayName = "ProductsPage";
