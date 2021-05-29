export declare class PayByLink {
    secret: string;
    shopId: number;
    constructor(secret: string, shopId: number);
    generateTransaction(price: number, control?: string, description?: string, email?: string, notifyURL?: string, returnUrlSuccess?: string, returnUrlSuccessTidPass?: boolean, hideReceiver?: boolean, customFinishNote?: string): Promise<any>;
    cancelTransaction(transactionId: number, customReason: string): Promise<any>;
    validateTransaction(response: {
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
