import { useCallback, useMemo } from "react";
import { Message, useMessageCRUD } from "../../../hooks";
import { FormikForm, FormikFormFields } from "../../../components";
import { MarketingFormActions } from "../enum";
import { useTranslation } from "react-i18next";
import { AddMessageSchema, EditMessageSchema } from "../../../yup";

export const useMarketingForm = (
  action: MarketingFormActions,
  selectedMessage: Message | undefined
) => {
  const { t } = useTranslation();
  const { createMessage, updateMessage } = useMessageCRUD();

  const title = useMemo(() => {
    if (action === MarketingFormActions.Add) {
      return t("form.addMessage.title");
    }
    if (action === MarketingFormActions.Edit) {
      return t("form.editMessage.title");
    }
  }, [action, t]);

  const fields: FormikForm[] = useMemo(
    () => [
      {
        label: t("message.content"),
        name: "content",
        disabled: false,
        fieldType: FormikFormFields.TextArea,
      },
    ],
    [t]
  );

  const initValues = useMemo(() => {
    if (action === MarketingFormActions.Add) {
      return {
        content: "",
      };
    }
    if (action === MarketingFormActions.Edit) {
      return {
        content: selectedMessage?.content,
      };
    }
    return {};
  }, [selectedMessage, action]);

  const schema = useMemo(() => {
    if (action === MarketingFormActions.Add) {
      return AddMessageSchema;
    }
    if (action === MarketingFormActions.Edit) {
      return EditMessageSchema;
    }
    return undefined;
  }, [action]);

  const formOnSubmit = useCallback(
    async (values: any) => {
      if (action === MarketingFormActions.Add) {
        await createMessage(values.content);
      }
      if (action === MarketingFormActions.Edit && selectedMessage) {
        await updateMessage(selectedMessage.message_id, values.content);
      }
      return () => {};
    },
    [createMessage, updateMessage, action, selectedMessage]
  );

  return {
    fields,
    initValues,
    schema,
    formOnSubmit,
    title,
  };
};
