export interface ContactPersonalInfoType {
  email: string;
  emailRetype: string;
  password?: string;
  passwordRetype?: string;
  yourName: string;
  kana: string;
  postalCode?: string;
  prefecture?: string;
  city?: string;
  address1?: string;
  address2?: string;
  phoneNumber?: string;
  // action?: string;
}

export interface ContactInquiryType {
  category: string;
  productName: string | undefined;
  orderCode: string | undefined;
  inquiry: string;
  // action?: string;
}
