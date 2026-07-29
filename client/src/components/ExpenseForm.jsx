import {useState} from "react";
import { createExpense } from "../api/expenses";

function ExpenseForm({ onExpenseCreated}) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    async function handleSubmit(event){
        event.preventDefault();
        setError("");
        setIsSaving(true);
        try {
            const NewExpense = await createExpense({
                description, 
                amount: Number(amount),
                category,
                date,
            });

        onExpenseCreated(NewExpense);

        setDescription("");
        setAmount("");
        setCategory("");
        setDate("");
        } catch(error) {
            setError(error.message);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form className="expense-form" onSubmit={handleSubmit}>
            <h2>Add Expense</h2>
            {error && <p className="error">{error}</p>}
            <label>
                Description
                <input
                    type="text"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    required
                />
            </label>


            <label>
                Amount
                <input
                    type="number"
                    min="0"
                    step= "0.01"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    required
                />
            </label>


            <label>
                Category
                <input
                    type="text"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    required
                />
            </label>


            <label>
                Date
                <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    required
                />
            </label>

            <button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." :  "Add Expense"}
            </button>
        </form>
    );
}

export default ExpenseForm;