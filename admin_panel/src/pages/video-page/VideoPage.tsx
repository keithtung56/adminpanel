import { Box, Button, Card, Checkbox } from "@mui/material";
import { memo, useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { AddButton, DeleteButton, GenericTable } from "../../components";
import { UploadVideoForm, ViewVideoForm } from "./components";
import { DATE_DISPLAY_FORMAT } from "../../constants";
import { useTranslation } from "react-i18next";
import { Video, useVideoCRUD } from "../../hooks";
import { ViewIcon } from "../../icons";

const StyledCard = styled(Card)`
  border-radius: 20px;
  overflow: auto;
  margin-top: 10px;
  height: 100%;
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
const StyledAddButton = styled(AddButton)``;
const StyledDeleteButton = styled(DeleteButton)``;
const LeftButtons = styled(Box)``;
const RightButtons = styled(Box)`
  display: flex;
  gap: 1vw;
  float: right;
`;
const ButtonWrapper = styled(Box)``;
const StyledViewIcon = styled(ViewIcon)`
  margin-right: 5px;
`;

export const VideoPage = memo(() => {
  const { t } = useTranslation();
  const { videoList, deleteVideo } = useVideoCRUD();

  const [showUploadVideoForm, setShowUploadVideoForm] =
    useState<boolean>(false);
  const [showViewVideoForm, setShowViewVideoForm] = useState<boolean>(false);

  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);
  const [viewVideo, setViewVideo] = useState<Video | null>(null);

  const AddButtonOnClick = useCallback(() => {
    setShowUploadVideoForm(true);
  }, [setShowUploadVideoForm]);

  const DeleteButtonOnClick = useCallback(async () => {
    await Promise.all(
      selectedVideoIds.map((selectedVideoId) => deleteVideo(selectedVideoId))
    );
  }, [selectedVideoIds, deleteVideo]);

  const CheckBoxOnClick = useCallback(
    (selectedId: string) => {
      if (selectedVideoIds.indexOf(selectedId) != -1) {
        setSelectedVideoIds(selectedVideoIds.filter((id) => id !== selectedId));
      } else {
        setSelectedVideoIds([...selectedVideoIds, selectedId]);
      }
    },
    [setSelectedVideoIds, selectedVideoIds]
  );

  const listGenerator = useMemo(
    () => [
      {
        key: "delete",
        header: "",
        render: (data: Video) => (
          <Checkbox
            checked={selectedVideoIds.indexOf(data.id) != -1}
            onClick={() => {
              CheckBoxOnClick(data.id);
            }}
          />
        ),
      },
      {
        key: "username",
        header: t("video.title"),
        render: (data: Video) => data.title,
      },
      {
        key: "created_time",
        header: t("video.created_time"),
        render: (data: Video) => data.created_time.format(DATE_DISPLAY_FORMAT),
      },
      {
        key: "edit",
        header: "",
        render: (data: Video) => (
          <Button
            variant="outlined"
            onClick={() => {
              setViewVideo(data);
              setShowViewVideoForm(true);
            }}
          >
            <StyledViewIcon />
            {t("button.view")}
          </Button>
        ),
      },
    ],
    [t, selectedVideoIds, CheckBoxOnClick]
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
          data={videoList}
          unique_col="id"
          //@ts-ignore
          generator={listGenerator}
        />
      </StyledCard>
      {showUploadVideoForm && (
        <UploadVideoForm
          showUploadVideoForm={showUploadVideoForm}
          setShowUploadVideoForm={setShowUploadVideoForm}
        />
      )}
      {showViewVideoForm && viewVideo && (
        <ViewVideoForm
          showViewVideoForm={showViewVideoForm}
          setShowViewVideoForm={setShowViewVideoForm}
          viewVideo={viewVideo}
        />
      )}
    </>
  );
});

VideoPage.displayName = "VideoPage";
