const API_URL = "http://localhost:3000/expenses";

export async function getExpenses(){
    const response = await fetch(API_URL);

    if (!response.ok){
        throw new Error("Could not load expenses");
    }


    return response.json();
}
//exports
export async function createExpense(expense){
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
    });

    const data = await response.json();

    if(!response.ok){
        throw new Error(data.error || "Could not create expense");
    }

    return data;
}


export async function deleteExpense(id){
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok){
        let message = "Could not delete expense";

        try {
            const data = await response.json();
            message = data.error || message;
        } catch {
            // The response may not contain JSON.
        }
        throw new Error(message);
    }
}

export async function updateExpense(id, expense){
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify(expense),
    });
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");


    const data = isJson ?  await response.json() : null;

    if (!response.ok){
        throw new Error(
            data?.error || `Could not update expense. (${response.status}).`
        );
    }

    return data;
}