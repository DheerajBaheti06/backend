import connectDB from "./db/index.js";
import { app } from "./app.js";
import { conf } from "./conf/index.js";

connectDB()
  .then(() => {
    app.listen(conf.port, () => {
      console.log(`server is runnning at port : ${conf.port}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!!", err);
  });
