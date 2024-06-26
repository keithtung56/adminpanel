import { memo, useCallback, useRef } from "react";
import { Dialog, Title } from "../../../components";
import { useTranslation } from "react-i18next";
import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import styled from "styled-components";

type Props = {
  showAddVideoFileForm: boolean;
  setShowAddVideoFileForm: React.Dispatch<React.SetStateAction<boolean>>;
};
const StyledTextField = styled(TextField)`
  margin-top: 10px;
`;
const StyledInput = styled.input`
  display: none;
`;
export const AddVideoFileForm = memo(
  ({ showAddVideoFileForm, setShowAddVideoFileForm }: Props) => {
    const uploadInput = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();
    // const [videoFile, setVideoFile] = useState<File | undefined>(undefined);
    const formik = useFormik({
      initialValues: {
        title: "",
      },
      onSubmit: async (values) => {
        console.log(values);

        setShowAddVideoFileForm(false);
      },
    });

    const UploadButtonOnClick = useCallback(() => {
      if (uploadInput.current) {
        uploadInput.current.click();
      }
    }, [uploadInput]);
    return (
      <Dialog
        title={<Title>{t("form.addVideo.title")}</Title>}
        open={showAddVideoFileForm}
        handleClose={(value: boolean) => {
          if (!value) {
            setShowAddVideoFileForm(false);
          }
        }}
        fullWidth
      >
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
          fullWidth
        />
        <Button
          onClick={() => {
            UploadButtonOnClick();
          }}
        >
          Upload Video
        </Button>
        <StyledInput
          ref={uploadInput}
          type="file"
          onChange={() => {}}
          accept="video/*"
        ></StyledInput>
      </Dialog>
    );
  }
);
AddVideoFileForm.displayName = "AddVideoFileForm";
