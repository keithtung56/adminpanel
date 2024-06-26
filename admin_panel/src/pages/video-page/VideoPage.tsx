import { Box, Card } from "@mui/material";
import { memo, useCallback, useState } from "react";
import styled from "styled-components";
import { AddButton } from "../../components";
import { AddVideoFileForm } from "./components";

const StyledCard = styled(Card)`
  border-radius: 20px;
  overflow: auto;
  margin-top: 10px;
  height: 100%;
  padding: 20px;
`;

const StyledAddButton = styled(AddButton)``;
const LeftButtons = styled(Box)``;
const RightButtons = styled(Box)`
  display: flex;
  gap: 1vw;
  float: right;
`;
const ButtonWrapper = styled(Box)``;

export const VideoPage = memo(() => {
  const [showAddVideoFileForm, setShowAddVideoFileForm] =
    useState<boolean>(false);
  const AddButtonOnClick = useCallback(() => {
    setShowAddVideoFileForm(true);
  }, [setShowAddVideoFileForm]);

  return (
    <>
      <ButtonWrapper>
        <LeftButtons></LeftButtons>
        <RightButtons>
          <StyledAddButton onClick={AddButtonOnClick}></StyledAddButton>
        </RightButtons>
      </ButtonWrapper>
      <StyledCard></StyledCard>
      {showAddVideoFileForm && (
        <AddVideoFileForm
          showAddVideoFileForm={showAddVideoFileForm}
          setShowAddVideoFileForm={setShowAddVideoFileForm}
        />
      )}
      {/* {showEditForm && (
        <EditUserForm
          showEditForm={showEditForm}
          setShowEditForm={setShowEditForm}
          editUser={editUser}
        />
      )} */}
    </>
  );
});

VideoPage.displayName = "VideoPage";
