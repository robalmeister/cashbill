"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payments = void 0;
class Payments {
    configuration;
    REST_URL;
    ENCODER = new TextEncoder();
    constructor(configuration) {
        this.configuration = configuration;
        this.REST_URL = configuration.environment == "production" ? "https://pay.cashbill.pl/ws/rest/" : "https://pay.cashbill.pl/testws/rest/";
    }
    async notify(notify) {
        const hash = hex(await crypto.subtle.digest({
            name: "MD5"
        }, this.ENCODER.encode(notify.command + notify.arguments)));
        if (notify.signature != hash) {
            throw new Error("Invalid signature");
        }
        return {
            orderId: notify.arguments
        };
    }
    async create(payment) {
        if (payment.referer == null) {
            payment.referer = "@robalmeister/cashbill";
        }
        if (payment.personalData == null) {
            payment.personalData = {};
        }
        let optionList = "";
        if (payment.options != null) {
            void payment.options.forEach(value => {
                optionList += value.name + value.value;
            });
        }
        const sign = payment.title +
            payment.amount.value +
            payment.amount.currencyCode +
            (payment.returnUrl ?? "") +
            (payment.description ?? "") +
            (payment.negativeReturnUrl ?? "") +
            (payment.additionalData ?? "") +
            (payment.paymentChannel ?? "") +
            (payment.languageCode ?? "") +
            (payment.referer ?? "") +
            (payment.personalData.firstName ?? "") +
            (payment.personalData.surname ?? "") +
            (payment.personalData.email ?? "") +
            (payment.personalData.country ?? "") +
            (payment.personalData.city ?? "") +
            (payment.personalData.postcode ?? "") +
            (payment.personalData.street ?? "") +
            (payment.personalData.house ?? "") +
            (payment.personalData.flat ?? "") +
            (payment.personalData.ip ?? "") +
            optionList +
            this.configuration.secretKey;
        payment.sign = hex(await crypto.subtle.digest({
            name: "SHA-1"
        }, this.ENCODER.encode(sign)));
        const response = await fetch(this.REST_URL + `payment/${this.configuration.shopId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payment)
        });
        const json = await response.json();
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${json.errorMessage}`);
        }
        return json;
    }
    async get(request) {
        const sign = hex(await crypto.subtle.digest({
            name: "SHA-1"
        }, this.ENCODER.encode(request.orderId + this.configuration.secretKey)));
        const response = await fetch(this.REST_URL + `payment/${this.configuration.shopId}/${request.orderId}?sign=${sign}`);
        const json = await response.json();
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${json.errorMessage}`);
        }
        return json;
    }
    async changeReturnUrl(request) {
        request.sign = hex(await crypto.subtle.digest({
            name: "SHA-1"
        }, this.ENCODER.encode(request.orderId + request.returnUrl + (request.negativeReturnUrl ?? "") + this.configuration.secretKey)));
        const response = await fetch(this.REST_URL + `payment/${this.configuration.shopId}/${request.orderId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        });
        if (!response.ok) {
            const json = await response.json();
            throw new Error(`Error ${response.status}: ${json.errorMessage}`);
        }
    }
    async payments(language) {
        const response = await fetch(this.REST_URL + `payment/${this.configuration.shopId}/${language}`);
        const json = await response.json();
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${json.errorMessage}`);
        }
        return json;
    }
}
exports.Payments = Payments;
function hex(buffer) {
    let digest = '';
    const view = new DataView(buffer);
    for (let i = 0; i < view.byteLength; i += 4) {
        const value = view.getUint32(i);
        const stringValue = value.toString(16);
        const padding = '00000000';
        const paddedValue = (padding + stringValue).slice(-padding.length);
        digest += paddedValue;
    }
    return digest;
}
