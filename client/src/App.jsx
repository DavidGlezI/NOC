import {useEffect, useState} from "react";
import { getExpenses, deleteExpense } from "./api/expenses";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseEditForm from "./components/ExpenseEditForm";
import "./App.css";

function App(){
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    async function loadExpenses(){
      try{
        const data = await getExpenses();
        setExpenses(data);
      } catch(error){
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadExpenses();
  },[]);


  // Handle edit expense

  function handleExpenseUpdated(updatedExpense){
    setExpenses((currentExpenses) =>
      currentExpenses.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense
    )
    );
    setEditingId(null);
    setError("") 
  };

  //Handle the delete of an expense

  async function handleDelete(id){
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!shouldDelete){
      return;
    }

    setError("");
    setDeletingId(id);

    try {
      await deleteExpense(id);

      setExpenses((currentExpenses) =>
        currentExpenses.filter((expense) => expense.id !== id)
      );
    } catch (error){
      setError(error.message);
    } finally{
      setDeletingId(null);
    }
  }

  // Create expense
  function handleExpenseCreated(newExpense) {
    setExpenses((currentExpenses) =>[
      newExpense,
      ...currentExpenses,
    ]);
  }

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  

  return (
    <main className="container">
      <h1>Expense Tracker</h1>
      <ExpenseForm onExpenseCreated={handleExpenseCreated} />
      {isLoading && <p>Loading expenses...</p>}

      {error && <p className="error">{error}</p>}

      {!isLoading && !error && expenses.length === 0 && (
        <p>No expenses have been added yet.</p>
      )}

      <ul className="expense-list">

        {expenses.map((expense) => (
          <li className="expense-item" key={expense.id}>
            {editingId === expense.id ? (
              <ExpenseEditForm 
                expense={expense}
                onExpenseUpdated={handleExpenseUpdated}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <>
                <div>
                  <strong>{expense.description}</strong>
                  <p>
                    {expense.category || "Uncategorized"}
                    {expense.date ? ` ${expense.date}` : ""}
                  </p>
                </div>

                <div className="expense-actions">
                  <span>{formatMoney(expense.amount)}</span>

                  <button
                    type="button"
                    onClick={() => setEditingId(expense.id)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={()=> handleDelete(expense.id)}
                    disabled={deletingId === expense.id}
                  >
                    {deletingId === expense.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </>
            )}  
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App;