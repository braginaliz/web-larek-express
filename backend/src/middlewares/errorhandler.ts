import { CelebrateError, isCelebrateError } from 'celebrate';
import { ErrorRequestHandler } from 'express';
import { HttpCodes } from '../errors/codes';
import ConflictError from '../errors/conflict-error';


const parseDuplicateKeyError = (errorMessage: string): { field: string; value: string } | null => {
  const match = errorMessage.match(/index: (. +?) dup key: \{ (.+?) : "(.+?)" \}/);
  
  if (match) {
    return { field: match[2], value: match[3] };
  }
  
  return null;
};

const extractCelebrateErrorMessage = (err: CelebrateError): string => {
    const errorDetails = err.details;
  
    for (const key of errorDetails.keys()) {
      const errorDetail = errorDetails.get(key);
      
      if (errorDetail && errorDetail.details && errorDetail.details.length > 0) {
        return errorDetail.details[0].message;
      }
    }
  
    return 'Ошибка валидации данных';
  };
  
const errorHandler = (err, req, res, next) => {
    if (isCelebrateError(err)) {
      const message = extractCelebrateErrorMessage(err);
      return res.status(HttpCodes.BAD_REQUEST).send({ message });
    }
  
    if (err instanceof ConflictError) {
      const parsedError = parseDuplicateKeyError(err.message);
      const responseMessage = parsedError 
        ? `Возник конфликт в поле ${parsedError.field} со значением "${parsedError.value}"`
        : 'Возник конфликт дублирования ключа';
      
      return res.status(HttpCodes.CONFLICT).send({ message: responseMessage });
    }
  
    // Обработка других ошибок (если необходимо)
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  };