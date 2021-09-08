const { findById } = require("./scheme-model")

const checkSchemeId = (req, res, next) => {
  const { scheme_id } = req.params
  findById(scheme_id).then(scheme => {
    if (scheme) {
      req.scheme = scheme
      next()
    } else {
      next({ status: 404, message: `scheme with scheme_id ${scheme_id} not found` })
    }
  })
}

const validateScheme = (req, res, next) => {
  const { scheme_name } = req.body 
  !scheme_name && next({ status: 400, message: "invalid scheme_name" })
  typeof scheme_name !== "string" && next({ status: 400, message: "invalid scheme_name" })
  next()
}

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  const { instructions, step_number } = req.body
  if (
    !instructions || typeof instructions !== "string" || step_number < 1 || typeof step_number !== "number"
  ) next({ status: 400, message: "invalid step" })
  next()
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
