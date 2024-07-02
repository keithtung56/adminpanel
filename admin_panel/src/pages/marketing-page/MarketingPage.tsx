import { Box, Button, Card, Checkbox } from "@mui/material";
import { memo, useCallback, useMemo, useState } from "react";
import { EditIcon, SendIcon } from "../../icons";
import styled from "styled-components";
import {
  AddButton,
  DeleteButton,
  GenericTable,
  usePagination,
} from "../../components";
import { Message, useMessageCRUD } from "../../hooks";
import { useTranslation } from "react-i18next";
import { MessageForm, SelectUserForm } from "./component";
import { MarketingFormActions } from "./enum";

const StyledCard = styled(Card)`
  border-radius: 20px;
  overflow: auto;
  margin-top: 10px;
  height: 100%;
  padding: 0px 20px;
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
const StyledSendIcon = styled(SendIcon)`
  margin-right: 5px;
`;
const ButtonWrapper = styled(Box)``;
const StyledAddButton = styled(AddButton)``;
const StyledDeleteButton = styled(DeleteButton)``;

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

export const MarketingPage = memo(() => {
  const { t } = useTranslation();
  const [formAction, setFormAction] = useState<
    MarketingFormActions | undefined
  >(undefined);
  const [showSelectUserForm, setShowSelectUserForm] = useState(false);
  const [editMessage, setEditMessage] = useState<Message | undefined>(
    undefined
  );
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const { messageList, deleteMessage } = useMessageCRUD();
  const AddButtonOnClick = useCallback(() => {
    setEditMessage(undefined);
    setFormAction(MarketingFormActions.Add);
  }, [setFormAction, setEditMessage]);

  const DeleteButtonOnClick = useCallback(async () => {
    await Promise.all(
      selectedMessageIds.map((selectedMessageId) =>
        deleteMessage(selectedMessageId)
      )
    );
  }, [selectedMessageIds, deleteMessage]);

  const CheckBoxOnClick = useCallback(
    (selectedId: string) => {
      if (selectedMessageIds.indexOf(selectedId) != -1) {
        setSelectedMessageIds(
          selectedMessageIds.filter((id) => id !== selectedId)
        );
      } else {
        setSelectedMessageIds([...selectedMessageIds, selectedId]);
      }
    },
    [setSelectedMessageIds, selectedMessageIds]
  );

  const listGenerator = useMemo(
    () => [
      {
        key: "delete",
        header: "",
        render: (data: Message) => (
          <Checkbox
            checked={selectedMessageIds.indexOf(data.message_id) != -1}
            onClick={() => {
              CheckBoxOnClick(data.message_id);
            }}
          />
        ),
      },
      {
        key: "content",
        header: t("message.content"),
        render: (data: Message) => data.content,
      },
      {
        key: "edit/send",
        header: "",
        render: (data: Message) => (
          <>
            <Button
              variant="outlined"
              onClick={() => {
                setEditMessage(data);
                setFormAction(MarketingFormActions.Edit);
              }}
            >
              <StyledEditIcon />
              {t("button.edit")}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setEditMessage(data);
                setShowSelectUserForm(true);
              }}
            >
              <StyledSendIcon />
              {t("button.send")}
            </Button>
          </>
        ),
      },
    ],
    [
      selectedMessageIds,
      CheckBoxOnClick,
      t,
      setEditMessage,
      setFormAction,
      setShowSelectUserForm,
    ]
  );

  const sortedMessageList = useMemo(
    () =>
      messageList.sort((a, b) =>
        a.created_time.isSameOrAfter(b.created_time) ? -1 : 1
      ),
    [messageList]
  );
  const { displayData, paginationComponent } = usePagination(sortedMessageList);
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
          data={displayData}
          //@ts-ignore
          generator={listGenerator}
          unique_col={"message_id"}
        />
      </StyledCard>
      {paginationComponent}
      {formAction !== undefined && (
        <MessageForm
          formAction={formAction}
          setFormAction={setFormAction}
          selectedMessage={editMessage}
        />
      )}
      {showSelectUserForm && editMessage && (
        <SelectUserForm
          showSelectUserForm={showSelectUserForm}
          setShowSelectUserForm={setShowSelectUserForm}
          message={editMessage}
        />
      )}
    </>
  );
});
MarketingPage.displayName = "MarketingPage";
