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
export declare class Client {
    private readonly secret;
    private readonly shopId;
    constructor(secret: string, shopId: number);
    generateTransaction(options: TransactionOptions): Promise<TransactionResponse>;
    cancelTransaction(transactionId: number, customReason: string): Promise<boolean>;
    validateTransaction(notification: {
        transactionId: string;
        control: string;
        email: string;
        amountPaid: number;
        notificationAttempt: number;
        paymentType: string;
        apiVersion: number;
        signature: string;
    }): boolean;
}
export {};
