import crypto from 'crypto';
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import { Request, Response, NextFunction } from 'express';
import { ENC_CONFIG } from '../config/constants';

const algorithm = process.env.ALGORITHM || 'aes-256-cbc';
const ivKey = process.env.IV || '';
const key = CryptoJS.SHA256(process.env.KEY || '');
const iv = CryptoJS.enc.Base64.parse(process.env.IV || '');

interface EncryptInputData {
    deviceType: string;
    payload?: string | object;
    appkey?: string;
}

interface EncryptedResultWeb {
    iv: string;
    hash: string;
}

interface EncryptedResultApp {
    iv: string;
    sek: string;
    hash: string;
}

export const encryptInput = async (data: EncryptInputData): Promise<EncryptedResultWeb | EncryptedResultApp> => {
    const deviceType = data.deviceType.toLowerCase();

    if (deviceType === ENC_CONFIG.ENCRYPTION_DEV_TYPE.web) {
        let encryptedString: CryptoJS.lib.CipherParams;

        if (typeof data.payload === 'string') {
            encryptedString = CryptoJS.AES.encrypt(data.payload, key, {
                iv,
                mode: CryptoJS.mode.CBC,
            });
        } else {
            encryptedString = CryptoJS.AES.encrypt(JSON.stringify(data.payload), key, {
                iv,
                mode: CryptoJS.mode.CBC,
            });
        }

        return {
            iv: iv.toString(),
            hash: encryptedString.toString(),
        };
    } else {
        const appkey = data.appkey || '';
        const randomKey: any = crypto.randomBytes(32);
        const cipher = crypto.createCipheriv(algorithm, Buffer.from(randomKey, 'base64'), ivKey);
        let encrypted = cipher.update(appkey, 'utf8');
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return {
            iv: Buffer.from(ivKey, 'utf8').toString('hex'),
            sek: encrypted.toString('hex'),
            hash: randomKey.toString('hex'),
        };
    }
};

export const decryptInput = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deviceType = req.headers.devicetype?.toString().toLowerCase();
        if (
            (req.headers.app && req.headers.app === ENC_CONFIG.DEFAULT_VALUE.APP) ||
            req.originalUrl.includes('/media') ||
            req.originalUrl.includes('/webhook')
        ) {
            return next();
        }

        if (!deviceType || !req.headers.hash) {
            return res.status(429).json({
                statusCode: 429,
                message: req.t("ACCESS_BLOCKED"),
                data: {},
                status: 0,
                isSessionExpired: true,
            });
        }

        if (deviceType === 'webapp') {
            const hash = req.headers.hash.toString();
            const decrypted = CryptoJS.AES.decrypt(hash, key, {
                iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            });
            const decryptedData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
            const timestamp = Number(decryptedData.appkey);
            const tsDayjs = dayjs(timestamp);
            if (!tsDayjs.isValid() || dayjs().diff(tsDayjs, 'second') >= 15) {
                return res.status(429).json({
                    statusCode: 429,
                    message: req.t("ACCESS_BLOCKED"),
                    data: {},
                    status: 0,
                    isSessionExpired: true,
                });
            }

            req.headers = { ...req.headers, ...decryptedData };

            if (Object.keys(req.body).length > 0) {
                if (!req.body.hash) {
                    return res.status(429).json({
                        statusCode: 429,
                        message: req.t("ACCESS_BLOCKED"),
                        data: {},
                        status: 0,
                        isSessionExpired: true,
                    });
                }

                const decryptedBody = CryptoJS.AES.decrypt(req.body.hash, key, {
                    iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7,
                });
                req.body = JSON.parse(decryptedBody.toString(CryptoJS.enc.Utf8));
            }

            return next();
        } else if (
            deviceType === ENC_CONFIG.ENCRYPTION_DEV_TYPE.ios ||
            deviceType === ENC_CONFIG.ENCRYPTION_DEV_TYPE.android ||
            deviceType === ENC_CONFIG.ENCRYPTION_DEV_TYPE.web
        ) {
            if (!req.headers.hash || !req.headers.sek) {
                return res.status(429).json({
                    statusCode: 429,
                    message: req.t("ACCESS_BLOCKED"),
                    data: {},
                    status: 0,
                    isSessionExpired: true,
                });
            }

            let hash: any = Buffer.from(req.headers.hash.toString(), 'hex');
            let sek = Buffer.from(req.headers.sek.toString(), 'hex');

            const decipher = crypto.createDecipheriv(algorithm, Buffer.from(hash, 'base64'), ivKey);
            let decrypted = Buffer.concat([decipher.update(sek), decipher.final()]);
            const decryptedObj = JSON.parse(decrypted.toString());

            const appKeyDayjs = dayjs(decryptedObj.appKey);

            if (!appKeyDayjs.isValid() || dayjs().diff(appKeyDayjs, 'second') >= 150) {
                return res.status(429).json({
                    statusCode: 429,
                    message: req.t("ACCESS_BLOCKED"),
                    data: {},
                    status: 0,
                    isSessionExpired: true,
                });
            }

            req.headers = { ...req.headers, ...decryptedObj };

            if (Object.keys(req.body).length > 0) {
                const bodyHash: any = Buffer.from(req.body.hash, 'hex');

                const bodySek = Buffer.from(req.body.sek, 'hex');
                const bodyDecipher = crypto.createDecipheriv(algorithm, Buffer.from(bodyHash, 'base64'), ivKey);
                const bodyDecrypted = Buffer.concat([bodyDecipher.update(bodySek), bodyDecipher.final()]);
                req.body = JSON.parse(bodyDecrypted.toString());
            }

            return next();
        } else {
            return res.status(429).json({
                statusCode: 429,
                message: req.t("ACCESS_BLOCKED"),
                data: {},
                status: 0,
                isSessionExpired: true,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};
