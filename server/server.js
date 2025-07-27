import config from "./src/config/app.config.js";
import expressLoader from "./src/loaders/express.js";
import mongooseLoader from "./src/loaders/mongoose.js";

(async () => {
//   await mongooseLoader()
  const app = await expressLoader();

  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
})();