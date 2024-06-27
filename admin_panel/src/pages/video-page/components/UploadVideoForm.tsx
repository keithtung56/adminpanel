import { memo, useCallback, useRef, useState } from "react";
import { Dialog, Title } from "../../../components";
import { useTranslation } from "react-i18next";
import { Box, Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import styled from "styled-components";
import { VideoDisplayer } from "./VideoDisplayer";
import { useVideoCRUD } from "../../../hooks";
const StyledTextField = styled(TextField)`
  margin: 20px;
  width: 80%;
`;
const TextFieldWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
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

type Props = {
  showUploadVideoForm: boolean;
  setShowUploadVideoForm: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UploadVideoForm = memo(
  ({ showUploadVideoForm, setShowUploadVideoForm }: Props) => {
    const uploadInput = useRef<HTMLInputElement>(null);
    const { createVideo } = useVideoCRUD();
    const { t } = useTranslation();
    const [videoFile, setVideoFile] = useState<File | undefined>(undefined);
    const formik = useFormik({
      initialValues: {
        title: "",
      },
      onSubmit: async (values) => {
        await createVideo(values.title, videoFile, true);
        setShowUploadVideoForm(false);
      },
    });

    const VideoOnChange = useCallback(() => {
      if (uploadInput.current?.files && uploadInput.current?.files[0]) {
        setVideoFile(uploadInput.current.files[0]);
      }
    }, []);
    const UploadButtonOnClick = useCallback(() => {
      if (uploadInput.current) {
        uploadInput.current.click();
      }
    }, [uploadInput]);
    return (
      <Dialog
        title={<Title>{t("form.addVideo.title")}</Title>}
        open={showUploadVideoForm}
        handleClose={(value: boolean) => {
          if (!value) {
            setShowUploadVideoForm(false);
          } else {
            formik.handleSubmit();
          }
        }}
        fullWidth
      >
        <StyledInput
          ref={uploadInput}
          type="file"
          onChange={() => {
            VideoOnChange();
          }}
          accept="video/*"
        ></StyledInput>

        <TextFieldWrapper>
          <StyledTextField
            id="title"
            label={t("video.title")}
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={
              formik.touched.title &&
              formik.errors.title &&
              t(formik.errors.title)
            }
          />
        </TextFieldWrapper>

        {videoFile && (
          <VideoWrapper>
            <VideoDisplayer src={URL.createObjectURL(videoFile)} />
          </VideoWrapper>
        )}
        <ButtonWrapper>
          <Button
            onClick={() => {
              UploadButtonOnClick();
            }}
          >
            {videoFile ? t("button.replace") : t("button.upload")}
          </Button>
        </ButtonWrapper>
      </Dialog>
    );
  }
);
UploadVideoForm.displayName = "UploadVideoForm";
