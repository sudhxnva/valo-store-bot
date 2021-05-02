const { connect } = require("mongoose");

connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})
  .then(async () => {
    console.log("> Connected to database...");
  })
  .catch((err) => console.log(err.message));
