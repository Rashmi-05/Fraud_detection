// utils/mlPayload.js
export function isOddHour(date) {
  const hour = date.getHours();
  return (hour >= 8 && hour <= 21) ? 0 : 1;
}

export async function buildMLPayload(sender, amount, pinFailures) {

  const now = new Date();

  const accountAgeDays =
    (now - new Date(sender.createdAt)) / (1000 * 60 * 60 * 24);

  const isNew = accountAgeDays < 10 ? 1 : 0;

  const spendingDeviation = sender.avgSpending
    ? Number(amount) / Number(sender.avgSpending)
    : 0;

  // ✅ DEV FROM CENTROID
  // Use meanDeviation directly (correct)
  const centroidDeviation = Number(sender.meanDeviation) || 0;

  const newBalance = Number(sender.accountBalance);
  const oldBalance = newBalance + Number(amount);

  return {
    accountNumber: sender.accountNumber,
    email: sender.email,
    timestamp: now.toISOString(),
    oddHour: isOddHour(now),
    spendingDeviation,
    centroidDeviation,
    isNew,
    debitedAmount: Number(amount),
    oldBalance,
    newBalance,
    pinFailures: Number(pinFailures),
    avgSpending: Number(sender.avgSpending)
  };
}
