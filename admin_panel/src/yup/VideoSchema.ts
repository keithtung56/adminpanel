import * as yup from 'yup';

export const AddVideoSchema = yup.object({
    title: yup
        .string()
        .required("form.error.required"),
});

export const EditVideoSchema = yup.object({
    title: yup
        .string()
        .required("form.error.required"),
});