export type OTP = {
  code: string;
  cipher: string;
};

export type OTPResponse = {
  isValid: boolean;
  httpCode: number;
};
