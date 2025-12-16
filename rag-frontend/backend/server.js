const express = require("express");
const path = require("path");

const app = express();
const port = 3002;

const distPath = path.join(__dirname, "dist");

// Serve static files at /
app.use(express.static(distPath));

// app.get("/rag", (req, res) => {
//   res.redirect("/rag/");
// });

// Serve index.html for the root
app.get("/", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
