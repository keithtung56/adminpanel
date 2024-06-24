import * as yup from 'yup';
export const AddOrderSchema = yup.object({
    order_name: yup
        .string()
        .required("form.error.required"),
    selected_product: yup.array().of(
        yup.object().shape({
            product_id: yup.string().required("form.error.required"),
            quantity: yup.number().min(1, "form.error.atLeast1").required("form.error.required"),
        })
    )
});