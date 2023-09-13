export class TransactionResponse {
    transactionId: number
    url?: string

    constructor(transactionId: number, url?: string) {
        this.transactionId = transactionId
        this.url = url
    }
}
