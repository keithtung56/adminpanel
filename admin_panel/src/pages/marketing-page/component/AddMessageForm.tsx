import { useFormik } from "formik";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useMessageCRUD } from "../../../hooks";
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
  showAddForm: boolean;
  setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
};
export const AddMessageForm = memo(({ showAddForm, setShowAddForm }: Props) => {
  const { t } = useTranslation();
  const { createMessage } = useMessageCRUD();

  const formik = useFormik({
    initialValues: {
      content: "",
    },
    onSubmit: async (values) => {
      try {
        await createMessage(values.content);
        setShowAddForm(false);
      } catch (e) {
        console.log(e);
      }
    },
  });

  return (
    <Dialog
      title={<Title>{t("form.addMessage.title")}</Title>}
      open={showAddForm}
      handleClose={(value: boolean) => {
        if (!value) {
          setShowAddForm(false);
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
          label={t("message.content")}
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
});

AddMessageForm.displayName = "AddMessageForm";
