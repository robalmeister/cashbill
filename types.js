"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = exports.NotificationCommand = exports.Language = exports.RestServiceEnvironment = void 0;
var RestServiceEnvironment;
(function (RestServiceEnvironment) {
    RestServiceEnvironment["TEST"] = "test";
    RestServiceEnvironment["PRODUCTION"] = "production";
})(RestServiceEnvironment || (exports.RestServiceEnvironment = RestServiceEnvironment = {}));
var Language;
(function (Language) {
    Language["PL"] = "PL";
    Language["EN"] = "EN";
})(Language || (exports.Language = Language = {}));
var NotificationCommand;
(function (NotificationCommand) {
    NotificationCommand["transactionStatusChanged"] = "transactionStatusChanged";
})(NotificationCommand || (exports.NotificationCommand = NotificationCommand = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PreStart"] = "PreStart";
    PaymentStatus["Start"] = "Start";
    PaymentStatus["NegativeAuthorization"] = "NegativeAuthorization";
    PaymentStatus["Abort"] = "Abort";
    PaymentStatus["Fraud"] = "Fraud";
    PaymentStatus["PositiveAuthorization"] = "PositiveAuthorization";
    PaymentStatus["PositiveFinish"] = "PositiveFinish";
    PaymentStatus["NegativeFinish"] = "NegativeFinish";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
