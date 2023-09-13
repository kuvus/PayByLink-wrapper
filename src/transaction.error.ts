export class PayByLinkError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'PayByLinkError'
    }
}
