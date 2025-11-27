import React, { useState } from "react";
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const nextStep = () => {
    if (!formData.amount || !formData.receiver) {
      toast.error("Please fill all required fields");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.pin) {
      toast.error("Please fill your PIN");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("https://your-backend-endpoint.com/pay", {
        method: selectedTab,
        ...formData,
      });

      toast.success("Payment Successful!");
      setSuccess(true);
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };




  return (

    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      {/* Top Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        AI-Based Fraud Detection & Risk Management System
      </h1>

      {/* Payment Box */}
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-6 flex flex-col items-center">
        {/* Payment Details Title */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Payment Details
        </h2>

        {/* Tabs */}
        <div className="flex justify-center border-b mb-6 w-full">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              className={`px-4 py-2 font-medium ${selectedTab === method.id
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

        {/* Form */}
        {!success ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 w-full flex flex-col items-center"
          >
            {/* Step 1: Amount & Receiver */}
            {step === 1 && (
              <>
                <div className="w-full text-center mb-2">
                  <p className="text-gray-600 mb-1 font-medium">Amount</p>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    required
                    className={`w-full p-4 border rounded-xl text-gray-800 text-lg transition-all focus:outline-none ${formData.amount
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-white"
                      }`}
                  />
                  <span className="text-red-500 text-sm mt-1 hidden peer-invalid:block">
                    Please fill this field
                  </span>
                </div>

                <div className="w-full text-center mb-2">
                  <p className="text-gray-600 mb-1 font-medium">
                    Receiver Account Number
                  </p>
                  <input
                    type="text"
                    name="receiver"
                    value={formData.receiver}
                    onChange={handleChange}
                    placeholder="Enter receiver account number"
                    required
                    className={`w-full p-4 border rounded-xl text-gray-800 text-lg transition-all focus:outline-none ${formData.receiver
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-white"
                      }`}
                  />
                  <span className="text-red-500 text-sm mt-1 hidden peer-invalid:block">
                    Please fill this field
                  </span>
                </div>

                <div className="flex justify-end w-full mt-4">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all shadow-md"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {/* Step 2: PIN */}
            {step === 2 && (
              <>
                <div className="w-full text-center mb-2">
                  <p className="text-gray-600 mb-1 font-medium">PIN</p>
                  <input
                    type="password"
                    name="pin"
                    value={formData.pin}
                    onChange={handleChange}
                    placeholder="Enter PIN"
                    required
                    className={`w-full p-4 border rounded-xl text-gray-800 text-lg transition-all focus:outline-none ${formData.pin
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-white"
                      }`}
                  />
                  <span className="text-red-500 text-sm mt-1 hidden peer-invalid:block">
                    Please fill this field
                  </span>
                </div>

                <div className="flex justify-between w-full mt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-all shadow-md"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-3 rounded-xl text-white bg-blue-500 hover:bg-blue-600 transition-all shadow-md ${loading ? "cursor-not-allowed bg-blue-400" : ""
                      }`}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Pay Now"}
                  </button>
                </div>
              </>
            )}
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


      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />


    </div>
  );
};

export default PaymentGateway;
