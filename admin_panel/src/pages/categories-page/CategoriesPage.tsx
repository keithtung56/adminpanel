import { Box, Button, Card, Checkbox } from "@mui/material";
import { memo, useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { AddButton, DeleteButton, GenericTable } from "../../components";
import { useTranslation } from "react-i18next";
import { AddCategoryForm, EditCategoryForm } from "./component";
import { useCategoryCRUD } from "../../hooks";
import { DATE_DISPLAY_FORMAT } from "../../constants";
import { EditIcon } from "../../icons";

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editCategory, setEditCategory] = useState<any>(null);
  const [selectedCategoryIds, setSelectedCatergoryIds] = useState<string[]>([]);
  const { categoriesList, deleteCategory } = useCategoryCRUD();
  const AddButtonOnClick = useCallback(() => {
    setShowAddForm(true);
  }, [setShowAddForm]);

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
        render: (data: any) => (
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
        render: (data: any) => data.category_name,
      },
      {
        key: "created_time",
        header: t("category.created_time"),
        render: (data: any) => data.created_time.format(DATE_DISPLAY_FORMAT),
      },
      {
        key: "modified_time",
        header: t("category.modified_time"),
        render: (data: any) => data.modified_time.format(DATE_DISPLAY_FORMAT),
      },
      {
        key: "edit",
        header: "",
        render: (data: any) => (
          <Button
            variant="outlined"
            onClick={() => {
              setEditCategory(data);
              setShowEditForm(true);
            }}
          >
            <StyledEditIcon />
            {t("button.edit")}
          </Button>
        ),
      },
    ],
    [selectedCategoryIds, CheckBoxOnClick, setEditCategory, setShowEditForm, t]
  );

  const sortedCategoriesList = useMemo(
    () =>
      categoriesList.sort((a, b) =>
        a.created_time.isSameOrAfter(b.created_time) ? -1 : 1
      ),
    [categoriesList]
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
          data={sortedCategoriesList}
          generator={listGenerator}
          unique_col={"category_id"}
        />
      </StyledCard>

      {showAddForm && (
        <AddCategoryForm
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
        />
      )}

      {showEditForm && (
        <EditCategoryForm
          showEditForm={showEditForm}
          setShowEditForm={setShowEditForm}
          category={editCategory}
        />
      )}
    </>
  );
});

CategoriesPage.displayName = "CategoriesPage";
