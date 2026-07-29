const express = require("express");
const cors = require("cors");

const expensesRouter = require("./routes/expenses");

const app = express();
const PORT = 3000;

app.use(
    cors({
        origin: "http://localhost:5173"
    })
)


app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Expense Tracker API is running!",
  });
});


app.use("/expenses", expensesRouter);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});