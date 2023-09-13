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
    generateTransaction(options: TransactionOptions): Promise<void>;
}
export {};
