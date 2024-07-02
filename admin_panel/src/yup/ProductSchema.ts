import * as yup from 'yup';
export const AddProductSchema = yup.object({
    product_name: yup
        .string()
        .required("form.error.required"),
    price: yup
        .number().positive("form.error.positive")
        .required("form.error.required"),
    stock: yup
        .number().positive("form.error.positive")
        .required("form.error.required"),
    category_id: yup.string().required("form.error.required"),
    status: yup.string().required("form.error.required").matches(/(listed)|(unlisted)/, "form.error.invalid"),
    description: yup.string().optional(),
});


export const EditProductSchema = yup.object({
    product_name: yup
        .string()
        .required("form.error.required"),
    price: yup
        .number().positive("form.error.positive")
        .required("form.error.required"),
    // stock: yup
    //     .number().positive("form.error.positive")
    //     .required("form.error.required"),
    category_id: yup.string().required("form.error.required"),
    status: yup.string().required("form.error.required").matches(/(listed)|(unlisted)/, "form.error.invalid"),
    description: yup.string().optional(),
});