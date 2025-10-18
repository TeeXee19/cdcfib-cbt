interface PasswordType {
  password: string;
  confirm_password?: string;
}

export interface LoginType extends PasswordType {
  username: string;
}

export interface ForgotPasswordType {
  username: string;
}

export interface ExamineeAccessPayload {
  phone_number: string;
  nin: string;
}


export interface SignupType extends PasswordType {
  email: string;
  firstname: string;
  lastname: string;
  phone_number: string;
}

export interface InitiateRegistration {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  roleId?: string;
  borderLocation: string[];
  borderState: string[];
  borderPoints: string[];
}


export interface ResetPasswordType extends PasswordType {
  token?: string;
  email: string;
  code:string
}

export interface VerificationDto {
  username: string;
  code: string;
  token: string;
}

