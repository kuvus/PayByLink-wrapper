import { sha256 } from 'js-sha256'
import axios, { AxiosError } from 'axios'
import { PayByLinkError } from './transaction.error'
import { TransactionResponse } from './transaction.response'
import {
    BlikNotificationResponse,
    BlikWhiteLabelTransactionOptions,
    ErrorResponse,
    TransactionNotificationResponse,
    TransactionOptions,
} from './transaction.types'

export class PblClient {
    private readonly secret!: string
    private readonly shopId!: number

    public constructor(secret: string, shopId: number) {
        if (secret) this.secret = secret
        else throw new Error('No PayByLink secret provided.')

        if (shopId) this.shopId = shopId
        else throw new Error('No PayByLink shop ID provided.')
    }

    public async generateTransaction(options: TransactionOptions): Promise<TransactionResponse> {
        const formattedPrice: string = options.price.toFixed(2)

        const transactionParams = [
            this.secret,
            this.shopId,
            formattedPrice,
            options.control,
            options.description,
            options.email,
            options.notifyURL,
            options.returnUrlSuccess,
            options.returnUrlSuccessTidPass,
            options.hideReceiver,
            options.customFinishNote,
        ]
            .filter(val => val)
            .join('|')

        const signature: string = sha256(transactionParams)

        const requestBody: object = {
            shopId: this.shopId,
            ...options,
            signature,
        }

        const response = await axios
            .post('https://secure.paybylink.pl/api/v1/transfer/generate', requestBody)
            .catch((e: Error | AxiosError) => {
                if (axios.isAxiosError(e) && e.response) {
                    const response = e.response.data as ErrorResponse
                    throw new PayByLinkError(response.error || e.message)
                }
                throw new PayByLinkError(e.message)
            })

        if (response.status !== 200) throw new PayByLinkError(response.data.error)

        return new TransactionResponse(response.data.transactionId, response.data.url)
    }

    public async generateBlikWhiteLabelTransaction(
        options: BlikWhiteLabelTransactionOptions
    ): Promise<TransactionResponse> {
        const formattedPrice: string = options.price.toFixed(2)

        const transactionParams = [
            this.secret,
            this.shopId,
            formattedPrice,
            options.code,
            options.customerIP,
            options.control,
            options.notifyPaymentURL,
            options.notifyStatusURL,
        ]
            .filter(val => val)
            .join('|')

        const signature: string = sha256(transactionParams)

        const requestBody: object = {
            shopId: this.shopId,
            ...options,
            signature,
        }

        const response = await axios
            .post('https://secure.paybylink.pl/api/v1/transfer/blikauth', requestBody)
            .catch((e: Error | AxiosError) => {
                if (axios.isAxiosError(e) && e.response) {
                    const response = e.response.data as ErrorResponse
                    throw new PayByLinkError(response.error || e.message)
                }
                throw new PayByLinkError(e.message)
            })

        if (response.status !== 200) throw new PayByLinkError(response.data.error)

        return new TransactionResponse(response.data.transactionId)
    }

    public async cancelTransaction(transactionId: number, customReason: string) {
        if (!transactionId) throw new Error(`No transaction ID provided.`)
        if (!customReason) throw new Error(`No cancellation reason provided.`)

        const signature: string = sha256(
            [this.secret, this.shopId, transactionId, customReason].filter(val => val).join('|')
        )
        const requestBody: object = {
            shopId: this.shopId,
            transactionId,
            customReason,
            signature,
        }

        const response = await axios
            .post('https://secure.paybylink.pl/api/v1/transfer/cancel', requestBody)
            .catch((e: Error | AxiosError) => {
                if (axios.isAxiosError(e) && e.response) {
                    const response = e.response.data as ErrorResponse
                    throw new PayByLinkError(response.error || e.message)
                }
                throw new PayByLinkError(e.message)
            })

        if (!response.data.cancelled) {
            throw new PayByLinkError(
                `Transaction with ID ${transactionId} could not be cancelled. ${response.data.cancleerror}`
            )
        }

        return true
    }

    public validateTransactionNotification(notification: TransactionNotificationResponse) {
        if (!notification) throw new Error(`No notification body provided.`)

        const localSignature = sha256(
            [
                this.secret,
                notification.transactionId,
                notification.control,
                notification.email,
                notification.amountPaid.toFixed(2),
                notification.notificationAttempt,
                notification.paymentType,
                notification.apiVersion,
            ]
                .filter(val => val)
                .join('|')
        )

        return notification.signature === localSignature
    }

    public validateBlikNotification(notification: BlikNotificationResponse) {
        if (!notification) throw new Error(`No notification body provided.`)

        const localSignature = sha256(
            [
                this.secret,
                notification.transactionId,
                notification.control,
                notification.price.toFixed(2),
                notification.status,
            ]
                .filter(val => val)
                .join('|')
        )

        return notification.signature === localSignature
    }
}
