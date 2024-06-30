import { FormikProps } from "formik";
import { FormikFormFields } from "../enum";
import { NormalTextArea } from "../NormalTextArea";
import { NormalTextField } from "../NormalTextField";
import { NumberTextField } from "../NumberTextField";
import { SelectCategoryField } from "../SelectCategoryField";
import { SelectUserField } from "../SelectUserField";
import { SelectOrderStatusField } from "../SelectOrderStatusField";
import { SelectProductStatusField } from "../SelectProductStatusField";

export type FormikForm = {
  label: string;
  name: string;
  disabled: boolean;
  fieldType: FormikFormFields;
};

type Props = {
  fields: FormikForm[];
  formik: FormikProps<any>;
};
export const useFormikFields = ({ fields, formik }: Props) => {
  const fieldsCompoents = fields.map(({ name, disabled, fieldType, label }) => {
    switch (fieldType) {
      case FormikFormFields.TextField:
        return (
          <NormalTextField
            key={name}
            name={name}
            label={label}
            disabled={disabled}
            formik={formik}
            fullWidth
          />
        );
      case FormikFormFields.NumberField:
        return (
          <NumberTextField
            key={name}
            name={name}
            label={label}
            disabled={disabled}
            formik={formik}
            fullWidth
          />
        );
      case FormikFormFields.TextArea:
        return (
          <NormalTextArea
            key={name}
            name={name}
            label={label}
            disabled={disabled}
            formik={formik}
            fullWidth
          />
        );
      case FormikFormFields.SelectCategoryField:
        return (
          <SelectCategoryField
            key={name}
            name={name}
            label={label}
            disabled={disabled}
            formik={formik}
            fullWidth
          />
        );
      case FormikFormFields.SelectUserField:
        return (
          <SelectUserField
            key={name}
            name={name}
            label={label}
            disabled={disabled}
            formik={formik}
            fullWidth
          />
        );
      case FormikFormFields.SelectOrderStatusField:
        return (
          <SelectOrderStatusField
            key={name}
            name={name}
            label={label}
            disabled={disabled}
            formik={formik}
            fullWidth
          />
        );
      case FormikFormFields.SelectProductStatusField:
        return (
          <SelectProductStatusField
            key={name}
            name={name}
            label={label}
            disabled={disabled}
            formik={formik}
            fullWidth
          />
        );
      default:
        return <></>;
    }
  });

  return { fieldsCompoents };
};
