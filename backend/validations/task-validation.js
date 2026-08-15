import joi from 'joi'

export const createTask = async (req, res, next) => {
  const schema = joi
    .object({
      taskSummary: joi.string().required(),
      status: joi.string().valid('TO_DO', 'IN_PROGRESS', 'DONE')
    })
    .unknown()

  const validation = schema.validate(req.body)

  if (validation.error) {
    const error = validation.error.message
      ? validation.error.message
      : validation.error.details[0].message
    return res.status(400).json({ message: error })
  }

  return next()
}

export const updateTask = async (req, res, next) => {
  const schema = joi
    .object({
      taskSummary: joi.string(),
      acceptanceCriteria: joi.string().allow(''),
      status: joi.string().valid('TO_DO', 'IN_PROGRESS', 'DONE')
    })
    .unknown()

  const validation = schema.validate(req.body)

  if (validation.error) {
    const error = validation.error.message
      ? validation.error.message
      : validation.error.details[0].message
    return res.status(400).json({ message: error })
  }

  return next()
}