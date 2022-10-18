import * as yup from "yup";
import type { PersonalData } from "~/types/contactFormType";

export const contactInquirySchema = yup.object({
  category: yup.string().max(2, "max2").required("required"),
  productName: yup.string().max(128, "max128"),
  orderCode: yup.string().max(128, "max128"),
  inquiry: yup.string().max(1000, "max1000").required("required"),
});

export const personalDataFormSchema: yup.SchemaOf<PersonalData> = yup.object({
  email: yup.string().max(255, "max255").email("email").required("required"),
  emailRetype: yup
    .string()
    .oneOf([yup.ref("email")], "emailRetype")
    .required("required"),
  password: yup.string().min(8, "min8").max(255, "max255").required("required"),
  passwordRetype: yup
    .string()
    .oneOf([yup.ref("password")], "passwordRetype")
    .required("required"),
  lastName: yup.string().max(10, "max10").required("required"),
  firstName: yup.string().max(10, "max10").required("required"),
  lastNameKana: yup.string().max(10, "max10").required("required"),
  firstNameKana: yup.string().max(10, "max10").required("required"),
  postalCode: yup
    .string()
    .matches(/^([0-9]{7})$|^([0-9]{3}-[0-9]{4})$|/, "postalCode"),
  prefecture: yup.string().max(2, "max2"),
  city: yup.string().max(50, "max50"),
  address1: yup.string().max(50, "max50"),
  address2: yup.string().max(50, "max50"),
  phoneNumber: yup
    .string()
    .max(13, "max13")
    .matches(/^[0-9\\-]*$/, "tel"),
});

export const contactPersonalInfoSchema = personalDataFormSchema.omit([
  "password",
  "passwordRetype",
]);

export const signinSchema = yup.object({
  email: yup.string().max(255, "max255").email("email").required("required"),
  password: yup.string().max(255, "max255").required("required"),
});
