import {
    CreatePaymentResponse,
    GetPaymentRequest, Language,
    NotificationResponse,
    NotificationType,
    Payment, PaymentChannelsResponse,
    PaymentGatewayConfig,
    PaymentResponse,
    PutPaymentRequest
} from "@/types";
import "node:crypto"

export class Payments {
    private readonly REST_URL: string
    private readonly ENCODER = new TextEncoder()
    private readonly DECODER = new TextDecoder()

    constructor(private readonly configuration: PaymentGatewayConfig) {
        this.REST_URL = configuration.environment == "production" ? "https://pay.cashbill.pl/ws/rest/" : "https://pay.cashbill.pl/testws/rest/"

    }

    async verifyNotify(notify: NotificationType): Promise<NotificationResponse> {
        if (notify.command !== "transactionStatusChanged") {
            throw new Error("Invalid command")
        }

        const hash = this.DECODER.decode(await crypto.subtle.digest({
            name: "MD5"
        }, this.ENCODER.encode(notify.command + notify.arguments)))

        if (notify.signature != hash) {
            throw new Error("Invalid signature")
        }

        return {
            orderId: notify.arguments
        }
    }

    async createPayment(payment: Payment): Promise<CreatePaymentResponse> {
        if (payment.referer == null) {
            payment.referer = "@robalmeister/cashbill"
        }

        let optionList = ""
        if (payment.options != null) {
            payment.options.forEach(value => {
                optionList += value.name + value.value
            })
        }
        payment.sign = this.DECODER.decode(await crypto.subtle.digest({
                name: "SHA-1"
            },
            this.ENCODER.encode(payment.title + payment.amount.value +
                payment.amount.currencyCode +
                payment.returnUrl ?? "" +
                payment.description ?? "" +
                payment.negativeReturnUrl ?? "" +
                payment.additionalData ?? "" +
                payment.paymentChannel ?? "" +
                payment.languageCode ?? "" +
                payment.referer ?? "" +
                payment.personalData?.firstName ?? "" +
                payment.personalData?.surname ?? "" +
                payment.personalData?.email ?? "" +
                payment.personalData?.country ?? "" +
                payment.personalData?.city ?? "" +
                payment.personalData?.postcode ?? "" +
                payment.personalData?.street ?? "" +
                payment.personalData?.house ?? "" +
                payment.personalData?.flat ?? "" +
                payment.personalData?.ip ?? "" +
                optionList +
                this.configuration.secretKey)))

        const response = await fetch(this.REST_URL + `payment/${this.configuration.shopId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                payment
            })
        })

        const json = await response.json()

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${json.errorMessage}`)
        }

        return json

    }

    async getPayment(request: GetPaymentRequest): Promise<PaymentResponse> {
        const sign = this.DECODER.decode(
            await crypto.subtle.digest({
                    name: "SHA-1"
                },
                this.ENCODER.encode(request.orderId + this.configuration.secretKey)
            )
        )
        const response = await fetch(this.REST_URL + `payment/${this.configuration.shopId}/${request.orderId}?sign=${sign}`)

        const json = await response.json()

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${json.errorMessage}`)
        }

        return json
    }

    async changeReturnUrl(request: PutPaymentRequest) {
         request.sign = this.DECODER.decode(
            await crypto.subtle.digest({
                    name: "SHA-1"
                },
                this.ENCODER.encode(request.orderId + request.returnUrl + request.negativeReturnUrl ?? "" + this.configuration.secretKey)
            )
        )
        const response = await fetch(this.REST_URL + `payment/${this.configuration.shopId}/${request.orderId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                request
            })
        })

        if (!response.ok) {
            const json = await response.json()
            throw new Error(`Error ${response.status}: ${json.errorMessage}`)
        }
    }

    async getPayments(language: Language): Promise<PaymentChannelsResponse[]> {
        const response = await fetch(this.REST_URL + `payment/${this.configuration.shopId}/${language}`)

        const json = await response.json()

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${json.errorMessage}`)
        }

        return json
    }
}
