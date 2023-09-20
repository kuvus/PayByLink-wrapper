export declare type TransactionOptions = {
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
export declare type BlikWhiteLabelTransactionOptions = {
    price: number;
    code: string;
    customerIP: string;
    control?: string;
    notifyPaymentURL?: string;
    notifyStatusURL?: string;
};
export declare type SuccessResponse = {
    url: string;
    transactionId: string;
};
export declare type ErrorResponse = {
    errorCode: number;
    error: string;
};
export declare type TransactionNotificationResponse = {
    transactionId: string;
    control: string;
    email: string;
    amountPaid: number;
    notificationAttempt: number;
    paymentType: string;
    apiVersion: number;
    signature: string;
};
export declare type BlikNotificationResponse = {
    transactionId: string;
    control: string;
    price: number;
    status: string;
    signature: string;
};
