import { TransactionResponse } from './transaction.response';
import { BlikNotificationResponse, BlikWhiteLabelTransactionOptions, TransactionNotificationResponse, TransactionOptions } from './transaction.types';
export declare class PblClient {
    private readonly secret;
    private readonly shopId;
    constructor(secret: string, shopId: number);
    generateTransaction(options: TransactionOptions): Promise<TransactionResponse>;
    generateBlikWhiteLabelTransaction(options: BlikWhiteLabelTransactionOptions): Promise<TransactionResponse>;
    cancelTransaction(transactionId: string, customReason: string): Promise<boolean>;
    validateTransactionNotification(notification: TransactionNotificationResponse): boolean;
    validateBlikNotification(notification: BlikNotificationResponse): boolean;
}
