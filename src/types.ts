export enum RestServiceEnvironment {
    TEST = 'test',
    PRODUCTION = 'production'
}

export type PaymentGatewayConfig = {
    shopId: string
    secretKey: string,
    environment: RestServiceEnvironment
}

export type Payment = {
    title: string
    amount: {
        value: number,
        /**
         * ISO 4217 currency code
         */
        currencyCode: string
    }
    description?: string,
    additionalData?: string,
    returnUrl?: string,
    negativeReturnUrl?: string,
    paymentChannel?: string,
    languageCode?: Language,
    personalData?: PersonalData,
    referer?: string
    /**
     * Check the wiki if you want to know more about this field
     */
    options?: {
        name: string,
        value: string
    }[],
    /**
     * Don't set this field
     */
    sign?: string
}

export type PersonalData = {
    firstName?: string,
    surname?: string,
    email?: string,
    country?: string,
    city?: string,
    postcode?: string,
    street?: string,
    house?: string,
    flat?: string,
    ip?: string,
}

export type GetPaymentRequest = {
    orderId: string
}

export type PutPaymentRequest = {
    orderId: string,
    returnUrl: string,
    negativeReturnUrl?: string
    /**
     * Don't set this field
     */
    sign?: string
}

export enum Language {
    PL = "PL",
    EN = "EN"
}


export type NotificationType = {
    command: string,
    arguments: string,
    signature: string
}

export type NotificationResponse = {
    orderId: string,
}

export enum PaymentStatus {
    PreStart= "PreStart",
    Start = "Start",
    NegativeAuthorization = "NegativeAuthorization",
    Abort = "Abort",
    Fraud = "Fraud",
    PositiveAuthorization = "PositiveAuthorization",
    PositiveFinish = "PositiveFinish",
    NegativeFinish = "NegativeFinish"
}

export type CreatePaymentResponse = {
    id: string,
    redirectUrl: string
}

export type PaymentResponse = {
    id: string,
    paymentChannel?: string
    amount: {
        value: number,
        currencyCode: string
    },
    requestedAmount: {
        value: number,
        currencyCode: string
    },
    title: string,
    description?: string,
    personalData?: PersonalData,
    additionalData?: string,
    status: PaymentStatus,
    details: {
        bankId?: string
    }
}

export type PaymentChannelsResponse = {
    id: string,
    availableCurrencies: string[],
    name: string,
    description: string,
    logoUrl: string
}

