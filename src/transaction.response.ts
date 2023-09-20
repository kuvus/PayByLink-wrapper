export class TransactionResponse {
    transactionId: string
    url?: string

    constructor(transactionId: string, url?: string) {
        this.transactionId = transactionId
        this.url = url
    }
}
