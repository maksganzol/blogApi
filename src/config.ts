const port = 8080;

const pwd = "root";
const user = "root";
const dbname = "blog";
const mongoUrl = `mongodb+srv://${user}:${pwd}@cluster0.1fggs.mongodb.net/${dbname}`;

export default {
  port,
  mongoUrl,
};
