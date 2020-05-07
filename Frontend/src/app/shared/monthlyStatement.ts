export interface SendTransactionMonthlyStatement {
    Month: number;
    Month_Name: string;
    STid: number;
    Date_Time: Date;
    Amount: number;
    Memo: string;
    Cancel_Reason: string;
    Identifier: string;
    SSN: number;
}

export interface RequestTransactionMonthlyStatement {
    Month: number;
    Month_Name: string;
    RTid: number;
    Date_Time: Date;
    Amount: number;
    memo: string;
    SSN: number;
    Identifier: string;
    Percentage: number;
}