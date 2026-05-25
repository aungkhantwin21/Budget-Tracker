// Select elements
const form = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const transactionList = document.getElementById("transaction-list");
const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const balanceEl = document.getElementById("balance");

// Load saved transactions from Local Storage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Add new transaction
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;

  if (!description || isNaN(amount) || !type) return;

  const transaction = {
    id: Date.now(),
    description,
    amount,
    type,
    date: new Date().toLocaleString()
  };

  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  addTransactionToDOM(transaction);
  updateSummary();

  form.reset();
});

// Delete transaction
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderTransactions();
  updateSummary();
}

// Add single transaction to table
function addTransactionToDOM(transaction) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${transaction.description}</td>
    <td>$${transaction.amount.toFixed(2)}</td>
    <td><span class="badge ${transaction.type === "income" ? "bg-success" : "bg-danger"}">
      ${transaction.type}
    </span></td>
    <td>${transaction.date}</td>
    <td>
      <button class="btn btn-sm btn-outline-danger" onclick="deleteTransaction(${transaction.id})">Delete</button>
    </td>
  `;
  transactionList.appendChild(row);
}

// Update totals
function updateSummary() {
  let income = 0, expense = 0;
  transactions.forEach(t => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });
  totalIncomeEl.textContent = `$${income.toFixed(2)}`;
  totalExpenseEl.textContent = `$${expense.toFixed(2)}`;
  balanceEl.textContent = `$${(income - expense).toFixed(2)}`;
}

// Render all transactions
function renderTransactions() {
  transactionList.innerHTML = "";
  transactions.forEach(addTransactionToDOM);
}

// Initial load
renderTransactions();
updateSummary();
