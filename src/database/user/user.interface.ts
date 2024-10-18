export interface UserDbModel {
  _email: string;
  givenName: string;
  familyName: string;
  createdDate: Date;
  createdBy: string;
  cognitoId: string;
  sex?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  updatedBy: string;
  updatedDate: Date;
  postcode?: string;
  country?: string;
  isAdmin: boolean;
}
