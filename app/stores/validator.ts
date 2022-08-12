import type { TFunction } from "react-i18next";
import type {
  ContactInquiryType,
  ContactPersonalInfoType,
} from "types/contactFormType";
import * as yup from "yup";

export const contactPersonalInfoSchema = (
  t: TFunction
): yup.SchemaOf<ContactPersonalInfoType> =>
  yup.object({
    yourName: yup.string().max(20, t("max20")).required(t("required")),
    kana: yup.string().max(20, t("max20")).required(t("required")),
    email: yup
      .string()
      .max(255, t("max255"))
      .email(t("email"))
      .required(t("required")),
    emailRetype: yup
      .string()
      .oneOf([yup.ref("email")])
      .required(t("required")),
    phoneNumber: yup
      .string()
      .max(13, t("max13"))
      .matches(/^[0-9\\-]*$/, t("tel")),
    postalCode: yup
      .string()
      .matches(/^[0-9]*$/, t("postalCode"))
      .max(7, t("max7")),
    prefecture: yup.string().max(2, t("max2")),
    city: yup.string().max(50, t("max50")),
    address1: yup.string().max(50, t("max50")),
    address2: yup.string().max(50, t("max50")),
  });

export const contactInquirySchema = (
  t: TFunction
): yup.SchemaOf<ContactInquiryType> =>
  yup.object({
    category: yup.string().max(2, t("max2")).required(t("required")),
    productName: yup.string().max(128, t("max128")),
    orderCode: yup.string().max(128, t("max128")),
    inquiry: yup.string().max(1000, t("max1000")).required(t("required")),
  });
