export function fetchBankData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        balance: 5230,
        transactions: [
          { id: 1, type: "expense", amount: 120, category: "Food", date: "2026-04-01" },
          { id: 2, type: "income", amount: 2000, category: "Salary", date: "2026-04-02" },
          { id: 3, type: "expense", amount: 50, category: "Transport", date: "2026-04-03" },
          { id: 4, type: "expense", amount: 200, category: "Utilities", date: "2026-04-05" },
        ]
      });
    }, 1000);
  });
}
