'use client';

import { useEffect } from 'react';

export default function RazorpayScriptLoader() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Optional: Clean up script on component unmount
    return () => {  
      document.body.removeChild(script);
    };
  }, []);

  return null;
}