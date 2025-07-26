import Joi, { celebrate } from "celebrate";
import { Types } from "mongoose";

enum PaymentType {
  Card = "card",
  Online = "online",
}

export const validateProductBody = celebrate({
  body: Joi.object({
    title: Joi.string()
      .min(2)
      .max(30)
      .required()
      .messages({
        'string.min': 'Минимальная длина поля title - 2',
        'string.max': 'Максимальная длина поля title - 30',
        'any.required': 'Поле title должно быть заполнено',
      }),
    
    image: Joi.object()
      .required()
      .messages({
        'any.required': 'Поле image должно быть заполнено',
      })
      .keys({
        fileName: Joi.string()
          .required()
          .messages({
            'any.required': 'Поле fileName должно быть заполнено',
          }),
        originalName: Joi.string()
          .required()
          .messages({
            'any.required': 'Поле originalName должно быть заполнено',
          }),
      }),

    category: Joi.string()
      .required()
      .messages({
        'string.empty': 'Поле category должно быть заполнено',
      }),
    
    description: Joi.string()
      .required()
      .messages({
        'string.empty': 'Поле description должно быть заполнено',
      }),

    price: Joi.number().allow(null),
  }),
});

export const validateOrderBody = celebrate({
    body: Joi.object().keys({
      items: Joi.array()
        .items(
          Joi.string().custom((value, helpers) => {
            if (Types.ObjectId.isValid(value)) {
              return value;
            }
            return helpers.message({ custom: "Невалидный id" });
          })
        )
    }),
  });