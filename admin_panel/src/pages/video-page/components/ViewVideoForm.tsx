import { memo, useEffect } from "react";
import { Dialog, Title } from "../../../components";
import { useTranslation } from "react-i18next";
import { Box, TextField } from "@mui/material";
import { useFormik } from "formik";
import styled from "styled-components";
import { VideoDisplayer } from "./VideoDisplayer";
import { Video, useVideoFileCRUD } from "../../../hooks";

const StyledTextField = styled(TextField)`
  margin: 20px;
  width: 80%;
`;
const TextFieldWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const VideoWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
type Props = {
  showViewVideoForm: boolean;
  setShowViewVideoForm: React.Dispatch<React.SetStateAction<boolean>>;
  viewVideo: Video;
};
export const ViewVideoForm = memo(
  ({ showViewVideoForm, setShowViewVideoForm, viewVideo }: Props) => {
    const { t } = useTranslation();
    const { videoFileUrl, setCurrentVideoFileId } = useVideoFileCRUD();
    const formik = useFormik({
      initialValues: {
        title: viewVideo.title,
      },
      onSubmit: () => {},
    });
    useEffect(() => {
      setCurrentVideoFileId(viewVideo.video_file_id ?? "");
    }, [viewVideo, setCurrentVideoFileId]);
    return (
      <Dialog
        title={<Title>{t("form.addVideo.title")}</Title>}
        open={showViewVideoForm}
        handleClose={(value: boolean) => {
          if (!value) {
            setShowViewVideoForm(false);
          }
        }}
        fullWidth
      >
        <TextFieldWrapper>
          <StyledTextField
            id="title"
            label={t("video.title")}
            name="title"
            value={formik.values.title}
            disabled
          />
        </TextFieldWrapper>

        {videoFileUrl && (
          <VideoWrapper>
            <VideoDisplayer src={videoFileUrl} />
          </VideoWrapper>
        )}
      </Dialog>
    );
  }
);
ViewVideoForm.displayName = "ViewVideoForm";
