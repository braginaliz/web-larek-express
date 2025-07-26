import { CelebrateError, isCelebrateError } from 'celebrate';
import { ErrorRequestHandler } from 'express';
import { HttpCodes } from '../errors/codes';
import ConflictError from '../errors/conflict-error';

const extractCelebrateErrorMessage = (err: CelebrateError): string => {
  // Ваш код здесь для обработки ошибки
};

const parseDuplicateKeyError = (errorMessage: string): { field: string; value: string } | null => {
  const match = errorMessage.match(/index: (. +?) dup key: \{ (.+?) : "(.+?)" \}/);
  
  if (match) {
    return { field: match[2], value: match[3] };
  }
  
  return null;
};