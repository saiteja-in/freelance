import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import { db } from "@/lib/db";

export async function POST(req) {
  let data = await req.formData();
  data = Object.fromEntries(data);
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

  // check if such order exists
  const dbRes = await db.payment.findOne({ oid: razorpay_order_id });
  if (!dbRes) {
    return NextResponse.error("Order ID not found");
  }

  // fetch razorpay secret key from db
  // const dbRes2=await User.findOne({ username: dbRes.to_user },{ rpaySecret: 1, _id: 0 }).exec();

  const dbRes2 = await db.user.findOne({ username: dbRes.to_user });
  if (!dbRes2) {
    return NextResponse.error("User not found");
  }

  const isVerified = validatePaymentVerification({ "order_id": razorpay_order_id, "payment_id": razorpay_payment_id }, razorpay_signature, dbRes2.rpaySecret);

  if (isVerified) {
    // findOne by order and update done to true
    const dbRes3 = await db.payment.findOneAndUpdate({ oid: razorpay_order_id }, { done: true });
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL+'/'+dbRes.to_user}`);
  }
  else {
    return NextResponse.error("Payment failed");
  }

}