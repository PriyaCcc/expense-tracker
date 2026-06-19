import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem("transactions");

    return savedTransactions
      ? JSON.parse(savedTransactions)
      : [];
  });
  useEffect(() => {
    localStorage.setItem(
      "transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("Food");
  const [search, setSearch] = useState("");
  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = income - expense;
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.description
      .toLowerCase()
      .includes(search.toLowerCase())
  );


  const deleteTransaction = (id) => {
    setTransactions(
      transactions.filter(
        (transaction) => transaction.id !== id
      )
    );
  };

  const addTransaction = () => {
    if (description.trim() === "" || amount === "") {
      alert("Please fill all fields");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      description: description,
      amount: Number(amount),
      type: type,
      category: category,
    };

    setTransactions([...transactions, newTransaction]);

    // Clear form
    setDescription("");
    setAmount("");
    setType("income");
    setCategory("Salary");
  };

  return (
    <div className="container">
      <h1>Expense Tracker</h1>

      <div className="balance-container">
        <h2>Balance</h2>
        <h3>₹{balance}</h3>
      </div>

      <div className="summary">
        <div className="income">
          <h3>Income</h3>
          <p>₹{income}</p>
        </div>

        <div className="expense">
          <h3>Expense</h3>
          <p>₹{expense}</p>
        </div>
      </div>

      <div className="transaction-form">
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <h2>Add Transaction</h2>

        <input
          type="text"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {type === "income" ? (
            <>
              <option value="Salary">Salary</option>
              <option value="Freelance">Freelance</option>
              <option value="Bonus">Bonus</option>
            </>
          ) : (
            <>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Entertainment">Entertainment</option>
            </>
          )}
        </select>

        <button onClick={addTransaction}>
          Add Transaction
        </button>
      </div>

      <div className="history">
        <h2>Transaction History</h2>


        <ul>
          {filteredTransactions.length === 0 ? (
            <li>No transactions found</li>
          ) : (
            filteredTransactions.map((transaction) => (
              <li
                key={transaction.id}
                className={transaction.type}
              >
                <span>
                  {transaction.description} - ₹{transaction.amount}
                  ({transaction.type} - {transaction.category})
                </span>

                <button
                  onClick={() => deleteTransaction(transaction.id)}
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;