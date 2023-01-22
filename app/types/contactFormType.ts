export interface ContactPersonalInfoType {
  email: string;
  emailRetype?: string;
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  postalCode?: string;
  prefecture?: string;
  city?: string;
  address1?: string;
  address2?: string;
  phoneNumber?: string;
  // action?: string;
}

export interface PersonalData extends ContactPersonalInfoType {
  password: string;
  passwordRetype?: string;
}

export interface ContactInquiryType {
  category: string;
  productName: string | undefined;
  orderCode: string | undefined;
  inquiry: string;
  // action?: string;
}
