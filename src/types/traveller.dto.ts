export interface Visa {
  ID: string;
  Number: string;
  VisaTypeID: number;
  VisaEntryID: number;
  IssueDate: string; // ISO date string
  ExpireDate: string; // ISO date string
  Duration: number;
  DocumentID: string;
  LastUpdateUser: string;
  UpdateDate: string; // ISO date string
  BorderPointID: number;
  CreatorUser: string;
  CreateDate: string; // ISO date string
  ReferenceNumber: string | null;
  ReceiptID: string | null;
  Address: string | null;
  ContactNumber: string | null;
  Employer: string | null;
  InvitedByVisa: string | null;
  RelationID: number | null;
  UniversityID: number | null;
  PermitStatusID: number | null;
  Occupation: string | null;
  PeriodTypeID: number | null;
  Note: string | null;
  VoucherNumber: string | null;
  PermitConditionID: number | null;
  UpdatedFrom: string | null;
  ProvinceID: number | null;
  CameraPhoto: string | null; // assuming base64 or URL
  PCNumber: string | null;
  Barcode: string | null;
  lVisaTypes: {
    ID: number;
    ExternalID: string;
    UpdateDate: string; // ISO date string
    SortOrder: number;
    Revoke: boolean;
    RevokeDate: string | null;
    EntryDocumentTypeID: number;
    VisaPermitType: number;
  };
}

export interface Traveller {
    ID: string;
    OldID: string | null;
    DocumentID: string;
    TravelDate: string;
    TransportTypeID: number;
    TransportCrossBorderID: number | null;
    MovementDirectionID: number;
    IsDriver: boolean | null;
    PersonID: string;
    TravelReasonID: number;
    Granted: boolean;
    DeportationReasonID: number | null;
    IsTransit: boolean;
    HasVisa: boolean;
    VisaID: number | null;
    ChildrenCount: number;
    Note: string;
    ResidentCountryID: number;
    DestinationCountryID: number | null;
    Occupation: string;
    AccomodationAddress: string;
    AccomodationTypeID: number | null;
    DurationOfStay: number;
    Inspector: string;
    PCNumber: string;
    RegistrationTime: string;
    UpdateDate: string;
    BorderPointID: number;
    CameraPhoto: string | null;

    Persons: {
        ID: string;
        UpdateUser: string;
        UpdateDate: string;
        BorderPointID: number;
    };

    lTravelReasons: {
        OldID: string;
        ID: number;
        ExternalID: string;
        SortOrder: number;
        UpdateDate: string;
        Revoke: boolean;
        RevokeDate: string | null;
    };

    lTransportTypes: {
        OldID: string;
        ID: number;
        ExternalID: string;
        UpdateDate: string | null;
        SortOrder: number;
        Revoke: boolean;
        RevokeDate: string | null;
    };
    Documents: {
        ID: string;
        DocumentTypeID: number;
        DocumentNumber: string;
        DocumentCountryOfIssueID: number;
        DocumentIssueDate: string | null;
        DocumentExpireDate: string | null;
        Surname: string;
        GivenName: string;
        FatherName: string | null;
        DateOfBirth: string | null;
        SexID: number | null;
        Citizenship: number | null;
        UpdateDate: string | null;
        BorderPointID: number | null;
        UpdateUser: string | null;
        PersonalNumber: string | null;
        CreateDate: string | null;
        CreatorUser: string | null;
    },


    Visa: Visa; // currently always null in your sample

    lCountries_PassportRegistrationData_ResidentCountryIDTolCountries: {
        OldID: string;
        ID: number;
        ExternalID: string;
        Name: string;
        Alpha2: string;
        Alpha3: string;
        SortOrder: number;
        VisaNecessityID: number | null;
        RegionID: number | null;
        UpdateDate: string;
        Revoke: boolean;
        RevokeDate: string | null;
        MaxDays: number | null;
    };

    lCountries_PassportRegistrationData_DestinationCountryIDTolCountries: {
        OldID: string;
        ID: number;
        ExternalID: string;
        Name: string;
        Alpha2: string;
        Alpha3: string;
        SortOrder: number;
        VisaNecessityID: number | null;
        RegionID: number | null;
        UpdateDate: string;
        Revoke: boolean;
        RevokeDate: string | null;
        MaxDays: number | null;
    } | null;

    lAccomodationTypes: null; // no data in sample

    lMovementDirections: {
        ID: number;
        OldID: string;
        ExternalID: string;
        UpdateDate: string;
        SortOrder: number;
        Revoke: boolean;
        RevokeDate: string | null;
    };

    lBorderPoints: {
        OldID: string | null;
        ID: number;
        ExternalID: string;
        UpdateDate: string;
        SortOrder: number;
        Revoke: boolean;
        RevokeDate: string | null;
    };
}

export interface Person {
  ID: string;
  UpdateUser: string;
  UpdateDate: string; // ISO datetime
  BorderPointID: number;
  PassportRegistrationData: Traveller[]; // from your earlier type
}

export interface PaginatedResponse2<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
};
// export interface Passportresponse {
//     data: Traveller[];
//     meta: {
//         total: number;
//         page: number;
//         lastPage: number;
//     };
// };

type Country = {
  OldID: string;
  ID: number;
  ExternalID: string;
  Name: string;
  Alpha2: string;
  Alpha3: string;
  SortOrder: number;
  VisaNecessityID: number | null;
  RegionID: number | null;
  UpdateDate: string; // ISO date string
  Revoke: boolean;
  RevokeDate: string | null;
  MaxDays: number | null;
};

export type TravelHistory = {
  ID: number;
  RegistrationID: string | null;
  PersonID: string;
  DocumentTypeID: number | null;
  DocumentNumber: string;
  DocumentCountryOfIssueID: number;
  DocumentIssueDate: string | null;   // ISO date or null
  DocumentExpireDate: string | null;  // ISO date or null
  Surname: string | null;
  GivenName: string | null;
  FatherName: string | null;
  DateOfBirth: string | null;         // ISO date or null
  SexID: number | null;
  location: string | null;
  Citizenship: string | null;
  DurationOfStay: string | null;
  BorderCrossDate: string | null;     // ISO date or null
  BorderPointID: number | null;
  BorderCrossDirectionID: number | null;
  PCNumber: string | null;
  UpdateUser: string | null;
  PersonalNamber: string | null;
  UpdateDate: string | null;
  VisaNumber: string | null;
  DocumentType: string | null;
  lBorderPoints: unknown | null;
  CountryIssued: Country | null;
};



