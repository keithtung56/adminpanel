import * as yup from 'yup';
export const EditCustomerSchema = yup.object({
    username: yup
        .string()
        .required("form.error.required"),
    age: yup.number().integer("form.error.integer").positive("form.err.positive").required("form.error.required"),
    gender: yup.string().required().matches(/(male)|(female)/, "form.error.invalid")
});