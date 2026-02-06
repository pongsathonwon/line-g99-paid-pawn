import type { TQrCodeConfig } from "./lib.type";
import type { TPaymentData } from "./QrCode";

export const createBarcodeFilled = (pay: TPaymentData, conf: TQrCodeConfig) =>
    conf.prefix +
    conf.taxId +
    conf.suffix +
    "\r" +
    pay.ref1.padStart(18, "0") +
    "\r" +
    pay.ref2.padStart(18, "0") +
    "\r" +
    pay.amount.replaceAll(".", "").padStart(10, "0");

export const createBarcodeClean = (pay: TPaymentData, conf: TQrCodeConfig) =>
    conf.prefix +
    conf.taxId +
    conf.suffix +
    "\r" +
    pay.ref1 +
    "\r" +
    pay.ref2 +
    "\r" +
    pay.amount.replaceAll(".", "");


