import { memo, useCallback, useRef } from "react";
import { Dialog, Title, useFormikFields } from "../../../components";
import { useTranslation } from "react-i18next";
import { Box, Button } from "@mui/material";
import { useFormik } from "formik";
import styled from "styled-components";
import { VideoDisplayer } from "./VideoDisplayer";
import { Video } from "../../../hooks";
import { VideoFormActions } from "../enum";
import { useVideoForm } from "../hooks";

const StyledInput = styled.input`
  display: none;
`;
const VideoWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ButtonWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Wrapper = styled(Box)`
  padding: 10px;
`;
type Props = {
  selectedVideo: Video | undefined;
  formAction: VideoFormActions;
  setFormAction: React.Dispatch<
    React.SetStateAction<VideoFormActions | undefined>
  >;
};

export const VideoForm = memo(
  ({ selectedVideo, formAction, setFormAction }: Props) => {
    const { t } = useTranslation();
    const uploadInput = useRef<HTMLInputElement>(null);

    const {
      fields,
      initValues,
      schema,
      formOnSubmit,
      setVideoFile,
      videoFileUrl,
      videoFile,
      title,
    } = useVideoForm(formAction, selectedVideo);

    const formik = useFormik({
      initialValues: initValues,
      validationSchema: schema,
      onSubmit: formOnSubmit,
    });

    const { fieldsCompoents } = useFormikFields({ fields, formik });

    const VideoOnChange = useCallback(() => {
      if (uploadInput.current?.files && uploadInput.current?.files[0]) {
        setVideoFile(uploadInput.current.files[0]);
      }
    }, [setVideoFile]);
    const UploadButtonOnClick = useCallback(() => {
      if (uploadInput.current) {
        uploadInput.current.click();
      }
    }, [uploadInput]);
    return (
      <Dialog
        title={<Title>{title}</Title>}
        open
        handleClose={(value: boolean) => {
          if (!value) {
            setFormAction(undefined);
          } else {
            formik.handleSubmit();
          }
        }}
        fullWidth
      >
        <Wrapper>
          <StyledInput
            ref={uploadInput}
            type="file"
            onChange={() => {
              VideoOnChange();
            }}
            accept="video/*"
          ></StyledInput>

          {fieldsCompoents}

          {(videoFileUrl || videoFile) && (
            <VideoWrapper>
              <VideoDisplayer
                src={videoFile ? URL.createObjectURL(videoFile) : videoFileUrl}
              />
            </VideoWrapper>
          )}
          <ButtonWrapper>
            <Button
              onClick={() => {
                UploadButtonOnClick();
              }}
            >
              {videoFileUrl ? t("button.replace") : t("button.upload")}
            </Button>
          </ButtonWrapper>
        </Wrapper>
      </Dialog>
    );
  }
);
VideoForm.displayName = "VideoForm";
