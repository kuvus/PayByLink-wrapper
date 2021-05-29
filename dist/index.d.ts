export declare class Client {
    private readonly secret;
    private readonly shopId;
    constructor(secret: string, shopId: number);
    generateTransaction(options: {
        price: number;
        control?: string;
        description?: string;
        email?: string;
        notifyURL?: string;
        returnUrlSuccess?: string;
        returnUrlSuccessTidPass?: boolean;
        hideReceiver?: boolean;
        customFinishNote?: string;
    }): Promise<any>;
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
