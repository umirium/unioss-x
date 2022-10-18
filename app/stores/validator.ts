import type { SchemaOf } from "yup";
import { object, string, ref } from "yup";
import type { PersonalData } from "~/types/contactFormType";

// for sign-up
export const personalDataFormSchema: SchemaOf<PersonalData> = object({
  email: string().max(255, "max255").email("email").required("required"),
  emailRetype: string()
    .oneOf([ref("email")], "emailRetype")
    .required("required"),
  password: string().min(8, "min8").max(255, "max255").required("required"),
  passwordRetype: string()
    .oneOf([ref("password")], "passwordRetype")
    .required("required"),
  lastName: string().max(10, "max10").required("required"),
  firstName: string().max(10, "max10").required("required"),
  lastNameKana: string().max(10, "max10").required("required"),
  firstNameKana: string().max(10, "max10").required("required"),
  postalCode: string().matches(
    /^([0-9]{7})$|^([0-9]{3}-[0-9]{4})$|/,
    "postalCode"
  ),
  prefecture: string().max(2, "max2"),
  city: string().max(50, "max50"),
  address1: string().max(50, "max50"),
  address2: string().max(50, "max50"),
  phoneNumber: string()
    .max(13, "max13")
    .matches(/^[0-9\\-]*$/, "tel"),
});

export const signinSchema = personalDataFormSchema.pick(["email", "password"]);

// for contact
export const contactPersonalSchema = personalDataFormSchema.omit([
  "password",
  "passwordRetype",
]);

export const contactInquirySchema = object({
  category: string().max(2, "max2").required("required"),
  productName: string().max(128, "max128"),
  orderCode: string().max(128, "max128"),
  inquiry: string().max(1000, "max1000").required("required"),
});
