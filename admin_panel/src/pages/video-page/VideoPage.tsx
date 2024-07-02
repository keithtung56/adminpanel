import { Box, Button, Card, Checkbox } from "@mui/material";
import { memo, useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import {
  AddButton,
  DeleteButton,
  GenericTable,
  usePagination,
} from "../../components";
import { VideoForm } from "./components";
import { DATE_DISPLAY_FORMAT } from "../../constants";
import { useTranslation } from "react-i18next";
import { Video, useVideoCRUD } from "../../hooks";
import { ViewIcon } from "../../icons";
import { VideoFormActions } from "./enum";

const StyledCard = styled(Card)`
  border-radius: 20px;
  overflow: auto;
  margin-top: 10px;
  height: 100%;
  padding: 0px 20px;
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

  const [formAction, setFormAction] = useState<VideoFormActions | undefined>(
    undefined
  );

  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);
  const [viewVideo, setViewVideo] = useState<Video | undefined>(undefined);

  const AddButtonOnClick = useCallback(() => {
    setViewVideo(undefined);
    setFormAction(VideoFormActions.Add);
  }, [setViewVideo, setFormAction]);

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
        key: "view",
        header: "",
        render: (data: Video) => (
          <Button
            variant="outlined"
            onClick={() => {
              setViewVideo(data);
              setFormAction(VideoFormActions.View);
            }}
          >
            <StyledViewIcon />
            {t("button.view")}
          </Button>
        ),
      },
    ],
    [t, selectedVideoIds, CheckBoxOnClick, setFormAction]
  );

  const sortedVideoList = useMemo(() => {
    return videoList.sort((a, b) =>
      a.created_time.isSameOrAfter(b.created_time) ? -1 : 1
    );
  }, [videoList]);
  const { displayData, paginationComponent } = usePagination(sortedVideoList);
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
          unique_col="id"
          //@ts-ignore
          generator={listGenerator}
        />
      </StyledCard>
      {paginationComponent}
      {formAction !== undefined && (
        <VideoForm
          formAction={formAction}
          setFormAction={setFormAction}
          selectedVideo={viewVideo}
        />
      )}
    </>
  );
});

VideoPage.displayName = "VideoPage";
