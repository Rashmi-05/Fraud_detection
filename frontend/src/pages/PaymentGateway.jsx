import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const paymentMethods = [
  {
    id: "card",
    name: "Credit/Debit Card",
    logos: [
      "https://img.icons8.com/color/48/000000/visa.png",
      "https://img.icons8.com/color/48/000000/mastercard.png",
      "https://img.icons8.com/color/48/000000/rupay.png",
    ],
  },
  {
    id: "upi",
    name: "UPI",
    logos: ["https://img.icons8.com/color/48/000000/upi.png"],
  },
];

const PaymentGateway = () => {
  const [selectedTab, setSelectedTab] = useState("card");
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    amount: "",
    receiver: "",
    pin: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [balance, setBalance] = useState("");

  // ---------------- FETCH BALANCE ----------------
  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const res = await axios.get("/balance");
      setBalance(res.data.balance || "0");
    } catch (err) {
      toast.error("Failed to load balance");
    }
  };

  // ---------------- HANDLERS ----------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (!formData.amount || !formData.receiver) {
      toast.error("Please fill all fields");
      return;
    }
    setStep(2);
  };

  const prevStep = () => setStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.pin) {
      toast.error("Please enter your PIN");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/pay", {
        method: selectedTab,
        ...formData,
      });

      toast.success("Payment Successful!");
      setSuccess(true);
    } catch (err) {
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        AI-Based Fraud Detection & Risk Management System
      </h1>

      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-6 flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Payment Details
        </h2>

        {/* Balance */}
        <div className="mb-4 text-lg font-semibold text-green-600">
          Available Balance: ₹{balance}
        </div>

        {/* Tabs */}
        <div className="flex justify-center border-b mb-6 w-full">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              className={`px-4 py-2 font-medium cursor-pointer ${
                selectedTab === method.id
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-400"
              }`}
              onClick={() => setSelectedTab(method.id)}
            >
              {method.name}
            </button>
          ))}
        </div>

        {/* Logos */}
        <div className="flex justify-center space-x-4 mb-6">
          {paymentMethods
            .find((m) => m.id === selectedTab)
            .logos.map((logo, idx) => (
              <img
                key={idx}
                src={logo}
                alt="payment-logo"
                className="h-10 object-contain transition-transform transform hover:scale-110"
              />
            ))}
        </div>

        {!success ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 w-full flex flex-col items-center"
          >
            {/* STEP 1 */}
            {step === 1 && (
              <>
                <div className="w-full">
                  <p className="text-gray-600 mb-1 font-medium">Amount</p>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    required
                    className="w-full p-4 border rounded-xl text-gray-800 text-lg"
                  />
                </div>

                <div className="w-full">
                  <p className="text-gray-600 mb-1 font-medium">
                    Receiver Account
                  </p>
                  <input
                    type="text"
                    name="receiver"
                    value={formData.receiver}
                    onChange={handleChange}
                    placeholder="Enter receiver account"
                    required
                    className="w-full p-4 border rounded-xl text-gray-800 text-lg"
                  />
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-blue-500 text-white py-3 rounded-xl cursor-pointer hover:bg-blue-600 transition-all shadow-md"
                >
                  Next
                </button>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <div className="w-full">
                  <p className="text-gray-600 mb-1 font-medium">PIN</p>
                  <input
                    type="password"
                    name="pin"
                    value={formData.pin}
                    onChange={handleChange}
                    placeholder="Enter PIN"
                    required
                    className="w-full p-4 border rounded-xl text-gray-800 text-lg"
                  />
                </div>

                <div className="flex justify-between w-full">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-3 rounded-xl text-white bg-blue-500 cursor-pointer hover:bg-blue-600 transition-all shadow-md ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Processing..." : "Pay Now"}
                  </button>
                </div>
              </>
            )}

            {/* Link to Dashboard */}
            <div className="mt-4 text-center w-full">
              <button
                type="button"
                onClick={() => (window.location.href = "/dashboard")}
                className="text-blue-500 hover:underline text-sm cursor-pointer"
              >
                ← Go back to Dashboard
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center p-8">
            <div className="text-5xl mb-4 animate-bounce text-green-500">✅</div>
            <h2 className="text-2xl font-bold mb-2 text-blue-500">
              Payment Successful!
            </h2>
            <p className="text-gray-500">Thank you for your payment.</p>
          </div>
        )}
      </div>

      <ToastContainer position="top-center" autoClose={2000} theme="light" />
    </div>
  );
};

export default PaymentGateway;
