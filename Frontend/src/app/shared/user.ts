export interface User {
    SSN: number;
    Name: string;
    PhoneNo: number;
    PhoneVerified: boolean;
    Password: string;
    EmailIds: [email];
    Balance: number;
    PBAVerified: boolean;
    BankID: number;
    BANumber: number;
    AddBankAccs: [AddBankAccs];
}

export interface email  {
    EmailAdd: string;
    Verified: boolean;
}

export interface AddBankAccs {
    BankID: number;
    BANumber: number;
    Verified: boolean;
}