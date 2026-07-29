const express = require("express")

const router  = express.Router();
const db = require("../database/db");

router.get("/", (req,res) => {
    const expenses = db
        .prepare("SELECT * FROM expenses")
        .all();

    res.json(expenses)


});

router.post("/", (req, res) => {
    const { description, amount, category, date} = req.body;

    if (!description || typeof description !== "string") {
        return res.status(400).json({
            error: "Description is required."
        });
    }

    if (typeof amount !== "number") {
        return res.status(400).json({
            error: "Amount must be a number."
        });
    }

    const statement = db.prepare(`
        INSERT INTO expenses (description, amount, category, date)
        VALUES (?, ?, ?, ?)
        `);

    const result = statement.run(
        description,
        amount,
        category,
        date
    )
    res.status(201).json({
        id: result.lastInsertRowid,
        description,
        amount,
        category,
        date,
    });
});

router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
        error: "Invalid expense id."
        });
    }

    const statement = db.prepare(`
        DELETE FROM expenses WHERE id = ?
        `);
    
    const result = statement.run(id);
    
    if (result.changes === 0) {
        return res.status(404).json({
            error: "Expense not found."
        });
    }

    return res.sendStatus(204);

});

router.get("/:id", (req, res) => {
    const id = Number(req.params.id);

    if(!Number.isInteger(id) || id <= 0){
        return res.status(400).json({
            error: "Invalid expense id."
        });
    }

    const expense = db
    .prepare(`
        SELECT * FROM expenses WHERE id = ? 
        `).get(id);

    if (!expense){
        return res.status(404).json({
            error: "Expense not found."
        })
    }

    return res.json(expense)
})


router.put("/:id", (req,res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
        error: "Invalid expense id."
        });
    }

    const { description, amount, category, date } = req.body;

    if (!description || typeof amount !== "number") {
        return res.status(400).json({
            error: "Invalid expense data."
        });
    }

    const statement = db.prepare(`
        UPDATE expenses SET description = ?, amount = ?, category = ?, date = ? WHERE id = ?
        `);

    const result = statement.run(description, amount, category, date, id);

    if(result.changes === 0) {
        return res.status(404).json({
            error: "Expense not found."
        });
    }

    const updatedExpense = db.prepare(`SELECT * FROM expenses WHERE id = ?`).get(id);

    return res.json(updatedExpense);

})

module.exports = router;