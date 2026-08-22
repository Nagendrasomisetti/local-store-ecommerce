export interface RetailerRegistrationInput {
  storeName: string;
  uniqueStoreName: string;
  storePhoto?: string | null;
  storeAddress: string;
  ownerName: string;
  countryCode: string;
  mobileNumber: string;
  email: string;
}

export interface RetailerRegistrationResponse {
  success: boolean;
  message?: string;
  storeId: string;
  username: string;
  uniqueStoreName: string;
  storeName: string;
  storeAddress: string;
  ownerName: string;
  mobileNumber: string;
  email: string;
  temporaryPassword: string;
  storeLink: string;
  qrDataUrl: string;
  createdAt: string;
  status: 'ACTIVE' | 'PENDING';
}

export interface StoreSummary {
  storeId: string;
  uniqueStoreName: string;
  storeName: string;
  storeAddress: string;
  ownerName: string;
  mobileNumber: string;
  email: string;
  storeLink: string;
  qrDataUrl: string;
  createdAt: string;
  status: 'ACTIVE' | 'PENDING';
}

