import fetch from 'node-fetch'
import { sha256 } from 'js-sha256'

export class Client {
    private readonly secret!: string
    private readonly shopId!: number

    public constructor(secret: string, shopId: number) {
        if (secret) this.secret = secret
        else throw new Error(`You didn't provide PBL secret.`)

        if (shopId) this.shopId = shopId
        else throw new Error(`You didn't provide PBL shopId.`)
    }

    public async generateTransaction(options: {
        price: number
        control?: string
        description?: string
        email?: string
        notifyURL?: string
        returnUrlSuccess?: string
        returnUrlSuccessTidPass?: boolean
        hideReceiver?: boolean
        customFinishNote?: string
    }) {
        const formattedPrice: string = options.price.toFixed(2)

        const transactionText = `${this.secret}|${this.shopId}|${formattedPrice}${
            options.control ? `|${options.control}` : ''
        }${options.description ? `|${options.description}` : ''}${
            options.email ? `|${options.email}` : ''
        }${options.notifyURL ? `|${options.notifyURL}` : ''}${
            options.returnUrlSuccess ? `|${options.returnUrlSuccess}` : ''
        }${options.returnUrlSuccessTidPass ? `|${options.returnUrlSuccessTidPass}` : ''}${
            options.hideReceiver ? `|${options.hideReceiver}` : ''
        }${options.customFinishNote ? `|${options.customFinishNote}` : ''}`

        const signature: string = sha256(transactionText.trim())

        const requestBody: object = {
            shopId: this.shopId,
            price: options.price,
            ...(options.control && { control: options.control }),
            ...(options.description && { description: options.description }),
            ...(options.email && { email: options.email }),
            ...(options.notifyURL && { notifyURL: options.notifyURL }),
            ...(options.returnUrlSuccess && { returnUrlSuccess: options.returnUrlSuccess }),
            ...(options.returnUrlSuccessTidPass && {
                returnUrlSuccessTidPass: options.returnUrlSuccessTidPass,
            }),
            ...(options.hideReceiver && { hideReceiver: options.hideReceiver }),
            ...(options.customFinishNote && { customFinishNote: options.customFinishNote }),
            signature,
        }

        return await fetch('https://secure.paybylink.pl/api/v1/transfer/generate', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => {
                return res.json()
            })
            .catch(e => {
                throw new Error(e)
            })
    }

    public async cancelTransaction(transactionId: number, customReason: string) {
        if (!transactionId) throw new Error(`You didn't provide transaction ID.`)
        if (!customReason) throw new Error(`You didn't provide cancel reason.`)

        const signature: string = sha256(
            `${this.secret}|${this.shopId}|${transactionId}|${customReason}`
        )
        const requestBody: object = {
            shopId: this.shopId,
            transactionId,
            customReason,
            signature,
        }

        return await fetch('https://secure.paybylink.pl/api/v1/transfer/cancel', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => {
                if (!res.ok) throw new Error(`An error occurred while calling the API`)
                return res.json()
            })
            .catch(e => {
                throw new Error(e)
            })
    }

    public validateTransaction(response: {
        transactionId: string
        control: string
        email: string
        amountPaid: number
        notificationAttempt: number
        paymentType: string
        apiVersion: number
        signature: string
    }) {
        if (!response) throw new Error(`You didn't provide API response.`)
        const localSignature: string = sha256(
            `${this.secret}|${response.transactionId}|${response.control}|${response.email}|${response.amountPaid}|${response.notificationAttempt}|${response.paymentType}|${response.apiVersion}`
        )

        return response.signature === localSignature
    }
}
