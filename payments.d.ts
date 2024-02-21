import { CreatePaymentResponse, GetPaymentRequest, Language, NotificationResponse, NotificationType, Payment, PaymentChannelsResponse, PaymentGatewayConfig, PaymentResponse, PutPaymentRequest } from "./types";
export declare class Payments {
    private readonly configuration;
    private readonly REST_URL;
    private readonly ENCODER;
    constructor(configuration: PaymentGatewayConfig);
    notify(notify: NotificationType): Promise<NotificationResponse>;
    create(payment: Payment): Promise<CreatePaymentResponse>;
    get(request: GetPaymentRequest): Promise<PaymentResponse>;
    changeReturnUrl(request: PutPaymentRequest): Promise<void>;
    payments(language: Language): Promise<PaymentChannelsResponse[]>;
}
