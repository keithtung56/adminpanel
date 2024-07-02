import * as yup from 'yup';
export const EditUserSchema = yup.object({
    username: yup
        .string()
        .required("form.error.required"),
    age: yup.number().integer("form.error.integer").positive("form.err.positive").required("form.error.required"),
    gender: yup.string().required().matches(/(male)|(female)/, "form.error.invalid")
});

export const AddUserSchema = yup.object({
    email: yup
        .string()
        .required("form.error.required"),
    username: yup
        .string()
        .required("form.error.required"),
    password: yup
        .string()
        .required("form.error.required"),
    phone: yup
        .string()
        .required("form.error.required"),
    age: yup.number().integer("form.error.integer").positive("form.error.positive").required("form.error.required"),
    gender: yup.string().required("form.error.required").matches(/(male)|(female)/, "form.error.invalid")
});