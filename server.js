import express from "express";
import config from "./kaze.config.js";

const app = express();
app.use(express.json());

app.listen(config.port, () => {
    console.log(`Kaze running on port ${config.port}`);
});
