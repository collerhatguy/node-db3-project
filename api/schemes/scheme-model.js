const db = require("../../data/db-config")
const { steps } = require("../../data/seeds/02-steps")

function find() { // EXERCISE A
  return db("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    .select("sc.*")
    .count("st.step_id as number_of_steps")
    .groupBy("sc.scheme_id")
    .orderBy("sc.scheme_id")

}

async function findById(scheme_id) { // EXERCISE B
  const response = await db("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    .select("sc.scheme_name", "st.*")
    .orderBy("st.step_number")
    .where("sc.scheme_id", scheme_id)

  return response.length ? {
    scheme_id: response[0].scheme_id,
    scheme_name: response[0].scheme_name,
    steps: response[0].step_id ? response.map(({step_id, step_number, instructions}) => ({ 
      step_id, step_number, instructions 
    })) : []
  } : false
}

async function findSteps(scheme_id) {
  const rows = await db("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    .select("sc.scheme_name", "st.step_id", "instructions", "st.step_number")
    .where("sc.scheme_id", scheme_id)
    .orderBy("st.step_number")

  if (!rows[0] || !rows[0].step_id) return []
  return rows
}

function add(scheme) {
  return db("schemes")
    .insert(scheme)
    .then(([id]) => 
      db("schemes").where({ scheme_id: id }).first()
    )
}

function addStep(scheme_id, step) { // EXERCISE E
  return db("steps")
    .insert({ ...step, scheme_id })
    .then(() => findSteps(scheme_id))
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
