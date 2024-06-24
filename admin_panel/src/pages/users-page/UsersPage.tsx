import { memo, useCallback, useMemo, useState } from "react";
import { AddButton, DeleteButton, GenericTable } from "../../components";
import { Card, Box, Checkbox, Button } from "@mui/material";
import styled from "styled-components";
import { useUserCRUD } from "../../hooks";
import { AddUserForm, EditUserForm } from "./component";
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

const StyledEditIcon = styled(EditIcon)`
  margin-right: 5px;
`;
export const UsersPage = memo(() => {
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const { userList, deleteAuthUser, deleteUserFromDb } = useUserCRUD();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const AddButtonOnClick = useCallback(() => {
    setShowAddForm(true);
  }, [setShowAddForm]);

  const DeleteButtonOnClick = useCallback(async () => {
    for (const id of selectedUserIds) {
      await Promise.all([deleteAuthUser(id), deleteUserFromDb(id)]);
    }
  }, [selectedUserIds, deleteAuthUser, deleteUserFromDb]);

  const CheckBoxOnClick = useCallback(
    (selectedId: string) => {
      if (selectedUserIds.indexOf(selectedId) != -1) {
        setSelectedUserIds(selectedUserIds.filter((id) => id !== selectedId));
      } else {
        setSelectedUserIds([...selectedUserIds, selectedId]);
      }
    },
    [setSelectedUserIds, selectedUserIds]
  );

  const listGenerator = useMemo(
    () => [
      {
        key: "delete",
        header: "",
        render: (data: any) => (
          <Checkbox
            checked={selectedUserIds.indexOf(data.uid) != -1}
            onClick={() => {
              CheckBoxOnClick(data.uid);
            }}
          />
        ),
      },
      {
        key: "username",
        header: t("user.username"),
        render: (data: any) => data.username,
      },
      {
        key: "email",
        header: t("user.email"),
        render: (data: any) => data.email,
      },
      {
        key: "gender",
        header: t("user.gender"),
        render: (data: any) => t(`user.${data.gender}`),
      },
      {
        key: "age",
        header: t("user.age"),
        render: (data: any) => data.age,
      },
      {
        key: "created_time",
        header: t("user.created_time"),
        render: (data: any) => data.created_time.format(DATE_DISPLAY_FORMAT),
      },
      {
        key: "modified_time",
        header: t("user.modified_time"),
        render: (data: any) => data.modified_time.format(DATE_DISPLAY_FORMAT),
      },
      {
        key: "edit",
        header: "",
        render: (data: any) => (
          <Button
            variant="outlined"
            onClick={() => {
              setEditUser(data);
              setShowEditForm(true);
            }}
          >
            <StyledEditIcon />
            {t("button.edit")}
          </Button>
        ),
      },
    ],
    [selectedUserIds, CheckBoxOnClick, t]
  );

  const sortedUserList = useMemo(
    () =>
      userList.sort((a, b) =>
        a.created_time.isSameOrAfter(b.created_time) ? -1 : 1
      ),
    [userList]
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
            //@ts-ignore
            data={sortedUserList}
            generator={listGenerator}
            unique_col={"uid"}
          />
        }
      </StyledCard>
      {showAddForm && (
        <AddUserForm
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
        />
      )}
      {showEditForm && (
        <EditUserForm
          showEditForm={showEditForm}
          setShowEditForm={setShowEditForm}
          editUser={editUser}
        />
      )}
    </>
  );
});
UsersPage.displayName = "UsersPage";
