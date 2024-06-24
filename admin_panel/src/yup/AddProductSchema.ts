import * as yup from 'yup';
export const AddProductSchema = yup.object({
    product_name: yup
        .string()
        .required("form.error.required"),
    price: yup
        .number().positive("form.error.positive")
        .required("form.error.required"),
    category_id: yup.string().required("form.error.required"),
});