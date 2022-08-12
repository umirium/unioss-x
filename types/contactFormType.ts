export interface ContactPersonalInfoType {
  yourName: string;
  kana: string;
  email: string;
  emailRetype: string;
  phoneNumber: string | undefined;
  postalCode: string | undefined;
  prefecture: string | undefined;
  city: string | undefined;
  address1: string | undefined;
  address2: string | undefined;
}

export interface ContactInquiryType {
  category: string;
  productName: string | undefined;
  orderCode: string | undefined;
  inquiry: string;
}
