import express from "express";

const app = express();

app.get("/", function (_request, response) {
  return response.status(200).send({ data: "hello world" });
});

app.listen(3000, function () {
  console.log("Server running on http://localhost:3000");
});
