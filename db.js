const { connect } = require("mongoose");

connect("mongodb://localhost/ValoStoreBot", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})
  .then(async () => {
    console.log("> Connected to database...");
  })
  .catch((err) => console.log(err.message));
