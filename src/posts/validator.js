import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const postSchema = {
  text: {
    in: ["body"],
    isString: {
      errorMessage: "Text is mandatory field and needs to be a string!",
    },
  },
  username: {
    in: ["body"],
    isString: {
      errorMessage: "Username is mandatory field and needs to be a string!",
    },
  },
  user: {
    in: ["body"],
    isInt: {
      errorMessage: "User is mandatory field and needs to be a number!",
    },
  },
};

export const checkpostSchema = checkSchema(postSchema);
export const triggerPostsBadRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Errors during user validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next();
  }
};
