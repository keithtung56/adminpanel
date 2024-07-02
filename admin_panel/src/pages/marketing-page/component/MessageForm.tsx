import { memo } from "react";
import { Dialog, Title, useFormikFields } from "../../../components";
import { Message } from "../../../hooks";
import { useFormik } from "formik";
import styled from "styled-components";
import { Box } from "@mui/material";

import { MarketingFormActions } from "../enum";
import { useMarketingForm } from "../hooks";

type Props = {
  selectedMessage: Message | undefined;
  formAction: MarketingFormActions;
  setFormAction: React.Dispatch<
    React.SetStateAction<MarketingFormActions | undefined>
  >;
};

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
`;
export const MessageForm = memo(
  ({ formAction, selectedMessage, setFormAction }: Props) => {
    const { title, fields, initValues, schema, formOnSubmit } =
      useMarketingForm(formAction, selectedMessage);

    const formik = useFormik({
      initialValues: initValues,
      validationSchema: schema,
      validateOnMount: true,
      onSubmit: formOnSubmit,
    });

    const { fieldsCompoents } = useFormikFields({ fields, formik });
    return (
      <Dialog
        title={<Title>{title}</Title>}
        open
        handleClose={(value: boolean) => {
          if (!value) {
            setFormAction(undefined);
          } else {
            formik.handleSubmit();
            if (Object.keys(formik.errors).length === 0)
              setFormAction(undefined);
          }
        }}
        fullWidth
      >
        <StyledBox>{fieldsCompoents}</StyledBox>
      </Dialog>
    );
  }
);

MessageForm.displayName = "MessageForm";
