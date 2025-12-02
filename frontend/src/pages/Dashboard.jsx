import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  // const BASE_URL = "https://18491e151454.ngrok-free.app";
//   const api = axios.create({
//   baseURL: "https://18491e151454.ngrok-free.app",
//   withCredentials: true
// });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [txnRes, recRes, balRes] = await Promise.all([

          axios.get(`https://896e2132101b.ngrok-free.app /pastTxn`),
          axios.get(`https://896e2132101b.ngrok-free.app /receivers`),
          axios.get(`https://896e2132101b.ngrok-free.app /getBalance`),

        ]);
        console.log(`transaction history data: `, txnRes.data);
        console.log(`past receivers: `, recRes.data);
        console.log(`balance: `, balRes.data);

        // correct response structure
        setTransactions(txnRes.data.transactions || []);
        setReceivers(recRes.data.receivers || []); 
        setBalance(balRes.data.balance || 0);

      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // ------------------------------ UI stays exactly same ------------------------------
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading Dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-700 mb-6 text-center">
        DASHBOARD
      </h1>

      <div className="w-full max-w-4xl bg-white shadow rounded-2xl p-8 mb-6 flex flex-col items-center">
        <p className="text-gray-500 text-lg">Available Balance</p>
        <h2 className="text-4xl font-bold text-green-600 mt-2">₹ {balance}</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6 w-full max-w-4xl">
        {/* Left: Past Transactions */}
        <div className="flex-1 bg-white shadow rounded-2xl p-6 h-[450px] overflow-y-auto">
          <h3 className="text-2xl font-semibold mb-4">Past Transactions</h3>
          {transactions.length === 0 ? (
            <p className="text-gray-400 text-center py-6">No transactions found.</p>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex justify-between items-center py-3 border-b last:border-b-0 text-sm"
              >
                <div>
                  <p className="font-medium">{tx.receiverTag}</p>
                  <p className="text-xs text-gray-400">{tx.timestamp}</p>
                </div>
                <p className="font-bold text-blue-600">₹ {tx.amount}</p>
              </div>
            ))
          )}
        </div>

        {/* Right: Past Interacted Users */}
        <div className="flex-1 bg-white shadow rounded-2xl p-6 h-[450px] overflow-y-auto">
          <h3 className="text-2xl font-semibold mb-4">People You've Interacted With</h3>
          {receivers.length === 0 ? (
            <p className="text-gray-400 text-center py-6">No receivers found.</p>
          ) : (
            receivers.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b last:border-b-0 text-sm"
              >
                <p className="font-medium">{r}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <button
        onClick={() => (window.location.href = "/payment")}
        className="w-full lg:w-1/3 bg-blue-600 text-white font-semibold py-4 rounded-2xl shadow hover:bg-blue-700 transition-all text-lg cursor-pointer"
      >
        Make a Transaction
      </button>
    </div>
  );
};

export default Dashboard;
