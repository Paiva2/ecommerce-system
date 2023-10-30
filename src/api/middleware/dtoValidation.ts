import { plainToInstance } from "class-transformer"
import { validate } from "class-validator"
import { NextFunction, Request, Response } from "express"

const dtoValidation = (SchemaToValidate: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let errorsArr = []

    const formatSchemaAndDto = plainToInstance(SchemaToValidate, req.body)

    const errors = await validate(formatSchemaAndDto)

    for (let err of errors) {
      for (let key of Object.keys(err?.constraints)) {
        errorsArr.push(err.constraints[key])
      }
    }

    if (errorsArr.length > 0) {
      const formatErrors = errorsArr.reduce((initObj, errorMsg) => {
        const [getFieldWithError, getFieldMessage] = errorMsg.split(";")

        return {
          ...initObj,
          [getFieldWithError]: getFieldMessage.trim(),
        }
      }, {})

      return res.status(422).send({
        validationErrors: true,
        errors: formatErrors,
      })
    }

    next()
  }
}

export default dtoValidation
