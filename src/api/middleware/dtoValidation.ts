import { plainToInstance } from "class-transformer"
import { validate } from "class-validator"
import { NextFunction, Request, Response } from "express"

const dtoValidation = (SchemaToValidate: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let errorsArr = []

    const formatSchemaAndDto = plainToInstance(SchemaToValidate, req.body)

    const errors = await validate(formatSchemaAndDto)

    for (let err of errors) {
      if (err?.constraints) {
        for (let key of Object.keys(err?.constraints)) {
          errorsArr.push(err.constraints[key])
        }
      } else if (err.children) {
        for (let key of Object.keys(err?.children)) {
          errorsArr.push(err.children[key])
        }
      }
    }

    if (errorsArr.length > 0) {
      const formatErrors = errorsArr.reduce((initObj, errorMsg) => {
        let getFieldWithError = ""
        let getFieldMessage = ""

        if (errorMsg.constraints) {
          for (let err of Object.values(errorMsg.constraints)) {
            const error = err as string

            getFieldWithError = error.split(";")[0]
            getFieldMessage = error.split(";")[1]
          }
        } else {
          getFieldWithError = errorMsg.split(";")[0]
          getFieldMessage = errorMsg.split(";")[1]
        }

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
