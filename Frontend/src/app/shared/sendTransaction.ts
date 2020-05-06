export interface SendTransaction {
    Amount: number;
    Date_Time: Date;
    Memo: string;
    Cancel_Reason: string;
    SSN: number;
    Identifier: string;
    Balance: number;    // current balance
}