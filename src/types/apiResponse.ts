/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponseType {
  statusCode: number,
  message: string,
  data: any
}


export interface DashboardResult {
  totalApplicants:number,
  summary:ExamSectionStat[],
  totalViolated:number
}
export interface ExamSectionStat {
  section: string; // e.g. "09:00AM - 10:00AM"
  status: 'EXAM_ONGOING' | 'EXAM_COMPLETED' | null;
  count: number; // total number of examinees in that section & status
}

export interface UserData {
  id: string;
  email: string;
  active: boolean;
  verified: boolean;
  borderLocation: string[];
  borderState: string[];
  borderPoints: string[];
  profile: {
    id: string;
    lastName: string;
    firstName: string;
    email: string;
    borderName: string;
    borderLocation: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  };
  role: {
    id: string;
    name: string;
  };
  userRole: any[]; // Replace `any` with a proper type if you have a structure for userRoles
}


export interface AuthData {
  accessToken: string;
  expiresIn: string;
  userInfo: UserData
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  archived: boolean;
}

export interface ICreateRole {
  name: string;
  description: string
}

export interface UserItem {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  borderLocation: string[];
  borderState: string[];
  borderPoints: string[];
  user: {
    id: string;
    email: string;
    active: boolean;
    verified: boolean;
    userRole: any[]; // Replace `any` if you have a proper type
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  };
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface MovementDirectionCount {
  movementDirectionId: "Entry" | "Exit"
  count: number;
}

export type MonthlyCount = {
  month: string; // e.g. "2025-04"
  count: number;
};

export type MovementMonthlyCounts = {
  movementDirectionId: string; // "Entry" | "Exit"
  monthlyCounts: MonthlyCount[];
};

export interface BorderPointDirection {
  movementDirectionId: "Entry" | "Exit";
  count: number;
}

export interface BorderPointData {
  borderPointId: string;
  directions: BorderPointDirection[];
}

export interface ResidenceCountryStat {
  id: number;
  name: string;
  count: number; // convert to number since SQL COUNT should be numeric
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  archived: boolean;
}

export interface PaginatedResponse<T> {
  totalItems: number;
  result: T[];
  totalPages: number;
  currentPage: number;
}

export interface RoleListResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface IAction {
  ID: number;
  ExternalID: string | null;
  UpdateDate: string | null;   // comes back as ISO string from API
  SortOrder: number | null;
  Revoke: boolean | null;
  RevokeDate: string | null;
}

export interface IDoubtablePerson {
  PassportRegistrationID: string;
  PhotoJustScanned: string | null; // Bytes usually serialized to base64 string
  Supervisor: string | null;
  SupervisorRegistrationTime: string | null;
  SupervisorPCNumber: string | null;
  Status: number | null;
  PersonStopID: string | null;
  DocumentStopID: string | null;
  InspectorsNote: string | null;
  SupervisorsNote: string | null;
  PerformedActionID: number | null;
  CheckingReason: string | null;
  lActions: IAction | null;
}

export interface IPersonsStopList {
  ID: string;
  OldID: string | null;
  Surname: string | null;
  GivenName: string | null;
  FathersName: string | null;
  SurnameAlt: string | null;
  GivenNameAlt: string | null;
  FathersNameAlt: string | null;
  DateOfBirth: string | null;
  SexID: number | null;
  Citizenship: number | null;
  WhoSetUp: string | null;
  SetUpDate: string | null;
  CancelDate: string | null;
  StopListSourceID: number | null;
  SourceDocument: string | null;
  Info: string | null;
  Photo: string | null;
  DocumentTypeID: number | null;
  DocumentNumber: string | null;
  PersonalNumber: string | null;
  ActionRequired: string | null;
  MatchInStopListActionID: number | null;
  UpdateDate: string | null;
  LastUpdateUser: string | null;
  Timestamp: string | null;
  CancelStopListSourceID: number | null;
  CancelSourceDocument: string | null;
  IsAuthorized: boolean | null;
  IsHit: string | null;
  HitTime: string | null;
  DoubtablePersons: IDoubtablePerson[];
}


export interface Meta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: Meta;
}
export type PersonsStopListResponse = IPersonsStopList[];
 




