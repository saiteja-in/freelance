"use client";

import { useForm } from "react-hook-form";
import axios from 'axios';
import { useState } from'react';
import toast from "react-hot-toast";

function PaymentForm({data}) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const lazyRazorpayScript = async () => {
    try {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    } catch (error) {
      toast.error("Payment Gateway error");
    }
  }

  const fetchOrder = async (fdata) => {
    try {
      const dbRes = await axios.post('/api/create-order', { amount:fdata.amount,to_username:data.username,message:fdata.message,from_name:fdata.name,rpayID:data.rpayID,rpaySecret:data.rpaySecret });
      return dbRes.data;
    } catch (error) {
      toast.error("Payment Gateway error");
      return error;
    }
  }

  async function handlePayment(fdata) {
    setLoading(true);
    fdata.amount=Number(fdata.amount) * 100;
    try {
      // load script
      await lazyRazorpayScript();
      // create order
      const order = await fetchOrder(fdata);
      // initiate payment
      const options = {
        amount: Number(order.amount_due), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        key: data.rpayID, // Enter the Key ID generated from the Dashboard
        currency: "INR",
        name: "Get Me A Chai",
        description: `Donation to ${data.username}`,
        image: `${data.profilePic}`,
        order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        callback_url: `/api/razorpay`,
        prefill: {
          name: `${fdata.name}`,
          email: "example@example.com",
          contact: "9000090000"
        },
        notes: order.notes,
        theme: {
          color: "#3399cc"
        }
      };
      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();
    } catch (error) {
      toast.error("Payment error");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit(handlePayment)} className="flex flex-col gap-3">
      <input type="text"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Enter name" {...register("name", { required: true })} />
      <input type="text"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Enter Message" {...register("message", { required: true })} />
      <input type="number"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Enter Amount" pattern="[0-9]" {...register("amount", { required: true })} />
      <button type="submit" className=" text-lg text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg py-2 text-center  mb-1
      disabled:bg-blue-500 disabled:text-gray-700 disabled:from-green-300" 
      disabled={Number(watch('amount'))===0 || !watch('amount') ||!watch('name') ||!watch('message')}  >
        {loading?
        <div className='flex justify-center items-center gap-1' role="status">
          <svg aria-hidden="true" class="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-pink-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
          <span className="pb-0.5 text-white ">Loading...</span>
        </div>
        :"Pay"}</button>
      {/*<div className="flex gap- 2">
        <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
          Pay ₹5
        </button>
        <button type="button" className="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ">
          Pay ₹10
        </button>
        <button type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ">
          Pay ₹20
        </button>
      </div>*/}
    </form>
  )
}

export default PaymentForm;