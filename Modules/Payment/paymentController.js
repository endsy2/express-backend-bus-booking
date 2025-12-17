import { Router } from "express";
import { insertPayment } from './paymentService.js';

const paymentRoute=Router();

// paymentRoute.post('/pay',paymentService);
// paymentRoute.post('/verify',verifyQrCode);
// paymentRoute.post('/decode',decodeQrCode);
// paymentRoute.post('/deeplink',deeplinkQrCode);
// paymentRoute.post('/checkmd5',checkMD5);
paymentRoute.post('/insertPayment',insertPayment)
export { paymentRoute};