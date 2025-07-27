import { ErrorRequestHandler } from 'express';
import { HttpCodes } from '../errors/http-codes';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import { CelebrateError, isCelebrateError } from 'celebrate';

const extractDuplicateKeyInfo = (errorMessage: string): { field: string; value: string } | null => {
    const regex = /index: (.+?) dup key: \{ (.+?) : "(.+?)" \}/;
    const match = errorMessage.match(regex);
    return match ? { field: match[2], value: match[3] } : null;
};

const getErrorMessageFromValidation = (error: CelebrateError): string => {
    const details = error.details;
    for (const key of details.keys()) {
        const errorDetail = details.get(key);
        if (errorDetail && errorDetail.details.length) {
            return errorDetail.details[0].message;
        }
    }
    return 'Ошибка при валидации данных';
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (isCelebrateError(err)) {
        const message = getErrorMessageFromValidation(err);
        return res.status(HttpCodes.BAD_REQUEST).json({ error: message });
    }

    if (err instanceof ConflictError) {
        const conflictInfo = extractDuplicateKeyInfo(err.message);
        const responseMessage = conflictInfo
            ? `Конфликт в поле "${conflictInfo.field}": значение "${conflictInfo.value}" уже существует.`
            : 'Ошибка конфликта ключа.';
        return res.status(HttpCodes.CONFLICT).json({ error: responseMessage });
    }

    if (err instanceof BadRequestError) {
        return res.status(HttpCodes.BAD_REQUEST).json({ error: err.message });
    }

    console.error(err);
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({ error: 'Внутренняя ошибка сервера.' });
};