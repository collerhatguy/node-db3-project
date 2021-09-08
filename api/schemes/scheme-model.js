const db = require("../../data/db-config")

function find() {
  return db("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    .select("sc.*")
    .count("st.step_id as number_of_steps")
    .groupBy("sc.scheme_id")
    .orderBy("sc.scheme_id")

}

async function findById(scheme_id) {
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
      db("schemes")
        .where({ scheme_id: id })
        .first()
    )
}

function addStep(scheme_id, step) {
  return db("steps")
    .insert({ ...step, scheme_id })
    .then(() => findSteps(scheme_id))
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
