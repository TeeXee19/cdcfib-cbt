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
  phoneNumber: string;
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

export interface LoginResponseType{
    accessToken: string;
    candidate: Candidate;
  }

export interface Candidate {
  id: string;
  lastName: string;
  firstName: string;
  nin: string;
  phoneNumber: string;
  candidateNumber: string;
  status: string | null;
  lastSync: string | null;
  timeLeft: string | null;
  candidateType: string;
  examDate: string; // ISO date string
  examTime: string; // e.g. "08:00PM - 09:45PM"
  createdAt: string;
  updatedAt: string;
}


export interface VerificationDto {
  username: string;
  code: string;
  token: string;
}

