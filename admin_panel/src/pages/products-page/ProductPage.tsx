import {
  Box,
  Button,
  Card,
  Checkbox,
  MenuItem,
  TextField,
} from "@mui/material";
import { memo, useCallback, useState, useMemo } from "react";
import {
  AddButton,
  DeleteButton,
  GenericTable,
  usePagination,
} from "../../components";
import styled from "styled-components";
import {
  Product,
  productStatusOptions,
  useCategoryCRUD,
  useProductCRUD,
} from "../../hooks";
import { useTranslation } from "react-i18next";
import { DATE_DISPLAY_FORMAT } from "../../constants";
import { EditIcon } from "../../icons";
import { ProductFormActions } from "./enum";
import { ProductForm } from "./component";

const StyledCard = styled(Card)`
  border-radius: 20px;
  margin-top: 10px;
  height: 100%;
  padding: 20px;
`;

const StyledAddButton = styled(AddButton)``;
const StyledDeleteButton = styled(DeleteButton)``;
const LeftButtons = styled(Box)`
  display: flex;
  gap: 1vw;
  width: 100%;
`;
const RightButtons = styled(Box)`
  display: flex;
  justify-content: flex-end;
  gap: 1vw;
  width: 100%;
`;

const StyledTable = styled(GenericTable)`
  .MuiTableHead-root,
  .MuiTableHead-root * {
    background-color: ${({ theme }) => theme.colors.greys[4]};
    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.fontSize.medium};
  }

  .MuiTableBody-root,
  .MuiTableBody-root * {
    color: ${({ theme }) => theme.colors.black};
    font-size: ${({ theme }) => theme.fontSize.small};
  }
`;

const StyledSelectStatusField = styled(TextField)<{ $width?: number }>`
  width: ${({ $width }) => ($width ? `${$width}` : 100)}%;
  background-color: ${({ theme }) => theme.colors.white};
`;
const StyledEditIcon = styled(EditIcon)`
  margin-right: 5px;
`;
const ButtonWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
`;
export const ProductsPage = memo(() => {
  const { t } = useTranslation();

  const { productList, deleteProduct } = useProductCRUD();
  const { categoryList } = useCategoryCRUD();

  const [formAction, setFormAction] = useState<ProductFormActions | undefined>(
    undefined
  );
  const [viewingProductStatus, setViewingProductStatus] = useState<
    Product["status"] | "all"
  >("all");
  const [editProduct, setEditProduct] = useState<any>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const AddButtonOnClick = useCallback(() => {
    setEditProduct(undefined);
    setFormAction(ProductFormActions.Add);
  }, [setFormAction, setEditProduct]);

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
          const category = categoryList.find(
            (category) => category.category_id === data.category_id
          );
          if (category) {
            return category.category_name;
          }
          return "";
        },
      },
      {
        key: "status",
        header: t("product.status"),
        render: (data: Product) => t(`product.${data.status}`),
      },
      {
        key: "stock",
        header: t("product.stock"),
        render: (data: Product) => data.stock,
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
              setFormAction(ProductFormActions.Edit);
            }}
          >
            <StyledEditIcon />
            {t("button.edit")}
          </Button>
        ),
      },
    ],
    [selectedProductIds, CheckBoxOnClick, setEditProduct, t, categoryList]
  );

  const sortedproductList = useMemo(() => {
    const filteredByStatus = productList.filter(
      (product) =>
        viewingProductStatus === "all" ||
        product.status === viewingProductStatus
    );
    return filteredByStatus.sort((a, b) =>
      a.created_time.isSameOrAfter(b.created_time) ? -1 : 1
    );
  }, [productList, viewingProductStatus]);

  const { displayData, paginationComponent } = usePagination(sortedproductList);
  return (
    <>
      <ButtonWrapper>
        <LeftButtons>
          <StyledSelectStatusField
            select
            $width={30}
            label={t("product.status")}
            value={viewingProductStatus}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSelectedProductIds([]);
              setViewingProductStatus(
                event.target.value as Product["status"] | "all"
              );
            }}
          >
            <MenuItem value={"all"}>{t("product.all")}</MenuItem>
            {productStatusOptions.map((status) => {
              return (
                <MenuItem value={status} key={status}>
                  {t(`product.${status}`)}
                </MenuItem>
              );
            })}
          </StyledSelectStatusField>
        </LeftButtons>
        <RightButtons>
          <StyledAddButton onClick={AddButtonOnClick} />
          <StyledDeleteButton onClick={DeleteButtonOnClick} />
        </RightButtons>
      </ButtonWrapper>

      <StyledCard>
        {
          <StyledTable
            data={displayData}
            //@ts-ignore
            generator={listGenerator}
            unique_col="product_id"
          />
        }
      </StyledCard>
      {paginationComponent}
      {formAction !== undefined && (
        <ProductForm
          formAction={formAction}
          selectedProduct={editProduct}
          setFormAction={setFormAction}
        />
      )}
    </>
  );
});

ProductsPage.displayName = "ProductsPage";
