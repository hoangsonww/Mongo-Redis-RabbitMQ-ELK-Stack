const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../graphql/schema');

const router = express.Router();

router.use(
  '/',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

module.exports = router;
