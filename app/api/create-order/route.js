import { NextResponse } from "next/server";
import Razorpay from "razorpay"

export async function POST(req){
  const data=await req.json();
  const {amount,to_username,from_name,message,rpayID,rpaySecret}=data;
  try {
    const instance = new Razorpay({ key_id: rpayID, key_secret: rpaySecret })
    const options = {
      amount: amount, // req in integer paise
      currency: "INR"
    }
    const order=await instance.orders.create(options);

    // // make payment object in db shows order is pending
    // const dbRes=await Payment.create({oid:order.id,amount,to_user:to_username,name:from_name,message,createdAt:Date.now(),updatedAt:Date.now(),done:false});
    const dbRes = await db.payment.create({ oid: order.id, amount, to_user: to_username, name: from_name, message, createdAt: Date.now(), updatedAt: Date.now(), done: false });
    return NextResponse.json(order);
    // return NextResponse.json({msg:"test"});
  } catch (error) {
    return NextResponse.json(error);
  }
}