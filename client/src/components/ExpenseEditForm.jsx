import { useState } from "react";

import { updateExpense } from "../api/expenses";

function ExpenseEditForm({
    expense,onExpenseUpdated,onCancel //Check why this 
    }){
    const [description, setDescription] = useState(expense.description);
    const [amount, setAmount] = useState(expense.amount);
    const [category, setCategory] = useState(expense.category || "");

    const [date, setDate] = useState(expense.date || "");
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);


    async function handleSubmit(event){
        event.preventDefault();
        setError("");
        setIsSaving(true);

        try {
            const updatedExpense = await updateExpense(expense.id, {
                description,
                amount: Number(amount),
                category,
                date,
            });

            onExpenseUpdated(updatedExpense);
        } catch(error){
            setError(error.message);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form className="expense-edit-form" onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}

            <input type="text" value={description} onChange={(event) => setDescription(event.target.value)} required/>

            <input type="number" min="0" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} required/>

            <input 
            type="text" 
            value={category} 
            onChange={(event) => setCategory(event.target.value)}
            />

            <input type="date" value={date} onChange={(event) => setDate(event.target.value)}/>
            
            <div className="edit-actions">

                <button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save"}
                </button>

                <button type="button" onClick={onCancel} disabled={isSaving}> 
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default ExpenseEditForm;