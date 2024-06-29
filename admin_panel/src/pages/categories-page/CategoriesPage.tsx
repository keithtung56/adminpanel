import { Box, Button, Card, Checkbox } from "@mui/material";
import { memo, useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { AddButton, DeleteButton, GenericTable } from "../../components";
import { useTranslation } from "react-i18next";
import { CategoryForm } from "./component";
import { Category, useCategoryCRUD } from "../../hooks";
import { DATE_DISPLAY_FORMAT } from "../../constants";
import { EditIcon } from "../../icons";
import { CategoryFormAction } from "./enum";

const StyledCard = styled(Card)`
  border-radius: 20px;
  overflow: auto;
  margin-top: 10px;
  height: 100%;
  padding: 20px;
`;

const LeftButtons = styled(Box)``;
const RightButtons = styled(Box)`
  display: flex;
  gap: 1vw;
  float: right;
`;
const StyledEditIcon = styled(EditIcon)`
  margin-right: 5px;
`;
const ButtonWrapper = styled(Box)``;
const StyledAddButton = styled(AddButton)``;
const StyledDeleteButton = styled(DeleteButton)``;

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

export const CategoriesPage = memo(() => {
  const { t } = useTranslation();
  const [formAction, setFormAction] = useState<CategoryFormAction | undefined>(
    undefined
  );
  const [editCategory, setEditCategory] = useState<any>(null);
  const [selectedCategoryIds, setSelectedCatergoryIds] = useState<string[]>([]);
  const { categoryList, deleteCategory } = useCategoryCRUD();
  const AddButtonOnClick = useCallback(() => {
    setFormAction(CategoryFormAction.Add);
    setEditCategory(undefined);
  }, [setFormAction, setEditCategory]);

  const DeleteButtonOnClick = useCallback(async () => {
    await Promise.all(
      selectedCategoryIds.map((selectedCategoryId) =>
        deleteCategory(selectedCategoryId)
      )
    );
  }, [selectedCategoryIds, deleteCategory]);

  const CheckBoxOnClick = useCallback(
    (selectedId: string) => {
      if (selectedCategoryIds.indexOf(selectedId) != -1) {
        setSelectedCatergoryIds(
          selectedCategoryIds.filter((id) => id !== selectedId)
        );
      } else {
        setSelectedCatergoryIds([...selectedCategoryIds, selectedId]);
      }
    },
    [setSelectedCatergoryIds, selectedCategoryIds]
  );

  const listGenerator = useMemo(
    () => [
      {
        key: "delete",
        header: "",
        render: (data: Category) => (
          <Checkbox
            checked={selectedCategoryIds.indexOf(data.category_id) != -1}
            onClick={() => {
              CheckBoxOnClick(data.category_id);
            }}
          />
        ),
      },
      {
        key: "category_name",
        header: t("category.category_name"),
        render: (data: Category) => data.category_name,
      },
      {
        key: "created_time",
        header: t("category.created_time"),
        render: (data: Category) =>
          data.created_time.format(DATE_DISPLAY_FORMAT),
      },
      {
        key: "modified_time",
        header: t("category.modified_time"),
        render: (data: Category) =>
          data.modified_time.format(DATE_DISPLAY_FORMAT),
      },
      {
        key: "edit",
        header: "",
        render: (data: Category) => (
          <Button
            variant="outlined"
            onClick={() => {
              setEditCategory(data);
              setFormAction(CategoryFormAction.Edit);
            }}
          >
            <StyledEditIcon />
            {t("button.edit")}
          </Button>
        ),
      },
    ],
    [selectedCategoryIds, CheckBoxOnClick, setEditCategory, setFormAction, t]
  );

  const sortedcategoryList = useMemo(
    () =>
      categoryList.sort((a, b) =>
        a.created_time.isSameOrAfter(b.created_time) ? -1 : 1
      ),
    [categoryList]
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
        <StyledTable
          data={sortedcategoryList}
          //@ts-ignore
          generator={listGenerator}
          unique_col={"category_id"}
        />
      </StyledCard>

      {formAction != undefined && (
        <CategoryForm
          formAction={formAction}
          setFormAction={setFormAction}
          selectedCategory={editCategory}
        />
      )}
    </>
  );
});

CategoriesPage.displayName = "CategoriesPage";
