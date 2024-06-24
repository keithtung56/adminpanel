import * as yup from 'yup';
export const AddCustomerSchema = yup.object({
    email: yup
        .string()
        .email("form.error.email")
        .required("form.error.required"),
    username: yup
        .string()
        .required("form.error.required"),
    password: yup
        .string()
        .required("form.error.required"),
    age: yup.number().integer("form.error.integer").min(0).required("form.error.required"),
    gender: yup.string().required("form.error.required").matches(/(male)|(female)/, "form.error.invalid")
});