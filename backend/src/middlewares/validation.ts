import Joi, { celebrate } from "celebrate";
import { Types } from "mongoose";

enum PaymentType {
  Card = "card",
  Online = "online",
}

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