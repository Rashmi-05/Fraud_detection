# Fraud_detection
Al-Based Fraud Detection &amp; Risk Management System

Note for connectpython branch

2 new files added

1. computeRisk.js which takes no args (for now) and spawns a python process
2. testscript.py which is a python process which gives random number (for now) as risk score

Few lines added in transactionController between

console.log(updatedReceiver.accountBalance); 
//here
await t.commit();  

Few lines added in PaymentGateway.jsx

if transaction blocked - toast error