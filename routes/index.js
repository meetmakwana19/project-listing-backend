const developerRouter = require("./developers");
const projectRouter = require("./projects");
const organizationRouter = require("./organizations");
const reviewRouter = require("./review");
const proposalRouter = require("./proposal");
const projectHiistoryRouter = require("./projectHistory");

module.exports = {
  developerRouter,
  projectRouter,
  organizationRouter,
  reviewRouter,
  proposalRouter,
  projectHiistoryRouter,
};
