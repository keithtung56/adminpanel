import { memo, useCallback, useMemo, useState } from "react";
import { Message, User, useMessage, useUserCRUD } from "../../../hooks";
import { Dialog, GenericTable, Title } from "../../../components";
import { useTranslation } from "react-i18next";
import { Box, Checkbox } from "@mui/material";
import styled from "styled-components";

type Props = {
  showSelectUserForm: boolean;
  setShowSelectUserForm: React.Dispatch<React.SetStateAction<boolean>>;
  message: Message;
};
const Body = styled(Box)`
  padding: 20px;
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

export const SelectUserForm = memo(
  ({ showSelectUserForm, setShowSelectUserForm, message }: Props) => {
    const { t } = useTranslation();
    const { userList } = useUserCRUD();
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const { sendSms } = useMessage();
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

    const AllCheckBoxOnClick = useCallback(() => {
      if (selectedUserIds.length === userList.length) {
        setSelectedUserIds([]);
      } else {
        setSelectedUserIds(userList.map((user) => user.uid));
      }
    }, [userList, selectedUserIds, setSelectedUserIds]);

    const listGenerator = useMemo(
      () => [
        {
          key: "delete",
          header: () => (
            <Checkbox
              checked={selectedUserIds.length === userList.length}
              onClick={() => {
                AllCheckBoxOnClick();
              }}
            />
          ),
          render: (data: User) => (
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
          render: (data: User) => data.username,
        },
        {
          key: "email",
          header: t("user.email"),
          render: (data: User) => data.email,
        },
        {
          key: "phone",
          header: t("user.phone"),
          render: (data: User) => data.phone,
        },
        {
          key: "gender",
          header: t("user.gender"),
          render: (data: User) => t(`user.${data.gender}`),
        },
        {
          key: "age",
          header: t("user.age"),
          render: (data: User) => data.age,
        },
      ],
      [selectedUserIds, CheckBoxOnClick, t, userList, AllCheckBoxOnClick]
    );

    const sortedUserList = useMemo(
      () =>
        userList.sort((a, b) =>
          a.created_time.isSameOrAfter(b.created_time) ? -1 : 1
        ),
      [userList]
    );

    return (
      <Dialog
        title={<Title>{t("form.sendMessage.title")}</Title>}
        open={showSelectUserForm}
        handleClose={async (value: boolean) => {
          if (!value) {
            setShowSelectUserForm(false);
          } else {
            await Promise.all(
              selectedUserIds.map(async (user_id) => {
                const phone = userList.find(
                  (user) => user.uid === user_id
                )?.phone;
                if (phone) {
                  await sendSms(message.content, phone);
                }
              })
            );
            setShowSelectUserForm(false);
          }
        }}
        fullWidth
      >
        <Body>
          <StyledTable
            data={sortedUserList}
            //@ts-ignore
            generator={listGenerator}
            unique_col={"uid"}
          />
        </Body>
      </Dialog>
    );
  }
);

SelectUserForm.displayName = "SelectUserForm";
