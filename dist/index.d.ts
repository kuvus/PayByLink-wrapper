import { TransactionResponse } from './transaction.response';
declare type TransactionOptions = {
    price: number;
    control?: string;
    description?: string;
    email?: string;
    notifyURL?: string;
    returnUrlSuccess?: string;
    returnUrlSuccessTidPass?: boolean;
    hideReceiver?: boolean;
    customFinishNote?: string;
};
declare type BlikWhiteLabelTransactionOptions = {
    price: number;
    code: string;
    customerIP: string;
    control?: string;
    notifyPaymentURL?: string;
    notifyStatusURL?: string;
};
export declare class PblClient {
    private readonly secret;
    private readonly shopId;
    constructor(secret: string, shopId: number);
    generateTransaction(options: TransactionOptions): Promise<TransactionResponse>;
    generateBlikWhiteLabelTransaction(options: BlikWhiteLabelTransactionOptions): Promise<TransactionResponse>;
    cancelTransaction(transactionId: number, customReason: string): Promise<boolean>;
    validateTransactionNotification(notification: {
        transactionId: string;
        control: string;
        email: string;
        amountPaid: number;
        notificationAttempt: number;
        paymentType: string;
        apiVersion: number;
        signature: string;
    }): boolean;
    validateBlikNotification(notification: {
        transactionId: string;
        control: string;
        price: number;
        status: string;
        signature: string;
    }): boolean;
}
export {};
