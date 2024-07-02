import * as yup from 'yup';


export const AddMessageSchema = yup.object({
    content: yup
        .string()
        .required("form.error.required"),
});


export const EditMessageSchema = yup.object({
    content: yup
        .string()
        .required("form.error.required"),
});