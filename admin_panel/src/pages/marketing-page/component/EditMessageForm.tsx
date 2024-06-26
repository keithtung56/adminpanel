import { useFormik } from "formik";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Message, useMessageCRUD } from "../../../hooks";
import { Dialog, Title } from "../../../components";
import styled from "styled-components";
import { Box, TextField } from "@mui/material";

const StyledBox = styled(Box)`
  display: flex;
`;
const StyledTextField = styled(TextField)`
  margin-top: 10px;
`;

type Props = {
  showEditForm: boolean;
  setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>;
  message: Message;
};
export const EditMessageForm = memo(
  ({ showEditForm, setShowEditForm, message }: Props) => {
    const { t } = useTranslation();
    const { updateMessage } = useMessageCRUD();

    const formik = useFormik({
      initialValues: {
        content: message.content,
      },
      onSubmit: async (values) => {
        try {
          await updateMessage(message.message_id, values.content);
          setShowEditForm(false);
        } catch (e) {
          console.log(e);
        }
      },
    });

    return (
      <Dialog
        title={<Title>{t("form.editMessage.title")}</Title>}
        open={showEditForm}
        handleClose={(value: boolean) => {
          if (!value) {
            setShowEditForm(false);
          } else {
            formik.handleSubmit();
          }
        }}
        fullWidth
      >
        <StyledBox>
          <StyledTextField
            multiline
            minRows={6}
            id="content"
            label={t("category.content")}
            name="content"
            value={formik.values.content}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.content && Boolean(formik.errors.content)}
            helperText={
              formik.touched.content &&
              formik.errors.content &&
              t(formik.errors.content)
            }
            fullWidth
          />
        </StyledBox>
      </Dialog>
    );
  }
);

EditMessageForm.displayName = "EditMessageForm";
