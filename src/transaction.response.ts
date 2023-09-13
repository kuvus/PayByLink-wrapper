export class TransactionResponse {
    url: string
    transactionId: number

    constructor(url: string, transactionId: number) {
        this.url = url
        this.transactionId = transactionId
    }
}
