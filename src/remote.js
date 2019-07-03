const axios = require("axios");
const csvtojson = require("csvtojson");

let toJson = csvtojson();

module.exports = {
  loadData
};

async function loadData() {
  return await axios
    .get("https://dl.dropbox.com/s/cchi1qx6z5u92fi/applicants.csv")
    // the csvtojson lib does not seem to fail loudly on malformed inputs. I would
    // shore up this logic to make sure we don't pass unexpected inputs to makeApplicant
    .then(response => toJson.fromString(response.data))
    .then(parsed => parsed.map(makeApplicant).filter(Boolean))
}

function makeApplicant(parsed) {
  try {
    return {
      name: parsed.Name,
      health: parseInt(parsed.Health, 10),
      damage: parseInt(parsed.Damage, 10),
      attacks: parseInt(parsed.Attacks, 10),
      dodge: parseInt(parsed.Dodge, 10),
      critical: parseInt(parsed.Critical, 10),
      initiative: parseInt(parsed.Initiative, 10),
    }
  } catch (e) {
    console.error('malformed applicant. could not parse all required values', e)
    return null
  }
}
