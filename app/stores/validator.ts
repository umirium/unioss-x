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
    yourName: yup.string().max(20).required(),
    kana: yup.string().max(20).required(),
    email: yup.string().max(255).email().required(),
    emailRetype: yup
      .string()
      .oneOf([yup.ref("email")])
      .required(),
    phoneNumber: yup
      .string()
      .max(13)
      .matches(/^[0-9\\-]*$/),
    postalCode: yup.string().max(7),
    prefecture: yup.string().max(2),
    city: yup.string().max(50),
    address1: yup.string().max(50),
    address2: yup.string().max(50),
  });

export const contactInquirySchema = (
  t: TFunction
): yup.SchemaOf<ContactInquiryType> =>
  yup.object({
    category: yup.string().max(2).required(),
    productName: yup.string().max(128),
    orderCode: yup.string().max(128),
    inquiry: yup.string().max(1000).required(),
  });
