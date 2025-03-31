"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Note: changed from next/router for app directory

const RazorpayComponent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const inititalPayment = async () => {
    setLoading(true);

    try {
      console.log(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)
      // Create order
      const orderResponse = await fetch("/api/Razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 100 }), // 100 INR
      });

      const orderData = await orderResponse.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Changed to NEXT_PUBLIC_
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Transaction Test',
        description: 'Testing',
        order_id: orderData.id,

        // preferred_method: {
        //   type: 'upi', // Specify UPI as preferred payment method
        //   flow: 'intent', // Use intent flow for mobile apps
        // },
        
        // Enable UPI payment methods
        method: {
          upi: true, // Enable UPI
          // card: false, // Optional: disable other payment methods
          // netbanking: false,
          // wallet: false
        },
        
        // UPI Specific Payment Methods
        upi_providers: [
          'google_pay',
          'phonepe',
          'paytm',
          'amazon_pay'
        ],
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            // Verify payment on server
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response)
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Payment successful
              // router.push('/success');
              console.log("Payment successful");
            } else {
              // Payment failed
              // router.push('/failure');/
              console.log("Payment failed");
            }
          } catch (error) {
            console.error('Payment verification failed', error);
            // router.push('/failure');
          }
        },
        theme: { color: '#3399cc' }
      };

      // Ensure Razorpay is loaded
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        throw new Error('Razorpay SDK not loaded');
      }
    } catch (error) {
      console.error('Payment initiation failed', error);
      // router.push('/failure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={inititalPayment}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default RazorpayComponent;