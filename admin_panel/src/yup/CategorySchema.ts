import * as yup from 'yup';

export const AddCategorySchema = yup.object({
    category_name: yup
        .string()
        .required("form.error.required"),
});

export const EditCategorySchema = yup.object({
    category_name: yup
        .string()
        .required("form.error.required"),
});