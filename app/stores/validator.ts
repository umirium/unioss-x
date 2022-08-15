import * as yup from "yup";

export const contactPersonalInfoSchema = yup.object({
  yourName: yup.string().max(20, "max20").required("required"),
  kana: yup.string().max(20, "max20").required("required"),
  email: yup.string().max(255, "max255").email("email").required("required"),
  emailRetype: yup
    .string()
    .oneOf([yup.ref("email")])
    .required("required"),
  phoneNumber: yup
    .string()
    .max(13, "max13")
    .matches(/^[0-9\\-]*$/, "tel"),
  postalCode: yup
    .string()
    .matches(/^[0-9]*$/, "postalCode")
    .max(7, "max7"),
  prefecture: yup.string().max(2, "max2"),
  city: yup.string().max(50, "max50"),
  address1: yup.string().max(50, "max50"),
  address2: yup.string().max(50, "max50"),
});

export const contactInquirySchema = yup.object({
  category: yup.string().max(2, "max2").required("required"),
  productName: yup.string().max(128, "max128"),
  orderCode: yup.string().max(128, "max128"),
  inquiry: yup.string().max(1000, "max1000").required("required"),
});
