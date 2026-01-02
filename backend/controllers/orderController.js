


import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe'
import Razorpay from 'razorpay'
import axios from 'axios'
import crypto from 'crypto'

import express from 'express'
const app = express();


//global variables 
const currency = 'inr';
const deliveryCharge = 10
//gateway initialisation
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})


// Placing order using COD Method


const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, { cartData: {} })
        res.json({ success: true, message: "Order Placed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }

}

//verify Stripe
const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
            res.json({ success: true });
        }
        else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false });
        }

    } catch (error) {
        console.log(error);
        await orderModel.findByIdAndDelete(orderId);
        res.json({ success: false, message: error.message });

    }
}

//Placing Order Using Stripe Method
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save()

        const line_items = items.map((item) => (
            {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: item.name
                    },
                    unit_amount: item.price * 100
                },
                quantity: item.quantity

            }
        ))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100

            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        res.json({ success: true, session_url: session.url })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });

    }

}

//Placing Order Using Razorpay Method
// const placeOrderRazorpay = async (req, res) => {
//     try {
//         console.log("Entered placeOrderRazorpay")
//         const { userId, items, amount, address } = req.body;
//         const orderData = {
//             userId,
//             items,
//             address,
//             amount,
//             paymentMethod: "Razorpay",
//             payment: false,
//             date: Date.now()
//         }
//         const newOrder = new orderModel(orderData);
//         await newOrder.save()

//         const options = {
//             amount: Math.round(amount * 100),
//             currency: currency.toUpperCase(),
//             receipt: newOrder._id.toString()
//         }

        
//         const order = await razorpayInstance.orders.create(options);
//         //console.log(order);

//         res.json({
//             success: true,
//             order: order
//         })

//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message || 'Faile to create razorPay order' })

//     }
// }

const placeOrderRazorpay = async (req, res) => {
    try {
        console.log("=== RAZORPAY ORDER CREATION STARTED ===");
        console.log("Request body:", req.body);
        
        const { userId, items, amount, address } = req.body;
        
        console.log("Extracted data:");
        console.log("- userId:", userId);
        console.log("- items count:", items?.length);
        console.log("- amount:", amount);
        console.log("- address:", address);
        
        // Validate required fields
        if (!userId || !items || !amount || !address) {
            console.error("❌ Missing required fields");
            return res.json({ 
                success: false, 
                message: "Missing required fields: userId, items, amount, or address" 
            });
        }

        if (items.length === 0) {
            console.error("❌ Items array is empty");
            return res.json({ 
                success: false, 
                message: "Cart is empty" 
            });
        }

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now()
        };

        console.log("Creating order in database...");
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        console.log("✅ Order saved to database, ID:", newOrder._id);

        const amountInPaise = Math.round(amount * 100);
        console.log("Amount in paise:", amountInPaise);

        const options = {
            amount: amountInPaise,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString()
        };

        console.log("Razorpay options:", options);
        console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
        console.log("Razorpay Key Secret:", process.env.RAZORPAY_KEY_SECRET ? "Present" : "Missing");

        console.log("Calling Razorpay API...");
        const order = await razorpayInstance.orders.create(options);
        console.log("✅ Razorpay order created:", order);

        res.json({
            success: true,
            order: order
        });

    } catch (error) {
        console.error("❌ ERROR in placeOrderRazorpay:");
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        console.error("Full error:", error);
        
        res.json({ 
            success: false, 
            message: error.message || 'Failed to create Razorpay order' 
        });
    }
}

// const verifyRazorpay = async (req, res) => {
//     try {
//         const { userId, razorpay_order_id } = req.body
//         const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
//         if (orderInfo.status === 'paid') {
//             await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
//             await userModel.findByIdAndUpdate(userId, { cartData: {} });
//             console.log("status", orderInfo.status);
//             res.json({ success: true, message: "Payment Successful" })
//         }
//         else {
//             await orderModel.findByIdAndDelete(orderInfo.receipt)
//             res.json({ success: false, message: 'Payment Failed' });
//         }

//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })

//     }
// }

const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        
        console.log("verifyRazorpay called");
        console.log("Payment ID:", razorpay_payment_id);
        console.log("Order ID:", razorpay_order_id);
        console.log("Signature:", razorpay_signature);

        // Verify signature
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            console.log("Signature verified successfully");
            
            // Fetch order info to get the receipt (MongoDB order ID)
            const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
            console.log("Order receipt (MongoDB ID):", orderInfo.receipt);

            // Update payment status in database
            await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            
            // Clear user's cart
            const order = await orderModel.findById(orderInfo.receipt);
            await userModel.findByIdAndUpdate(order.userId, { cartData: {} });

            res.json({ success: true, message: "Payment Successful" });
        } else {
            console.log("Signature verification failed");
            res.json({ success: false, message: "Invalid signature" });
        }

    } catch (error) {
        console.log("ERROR in verifyRazorpay:", error);
        res.json({ success: false, message: error.message });
    }
};


// Place Order using phonepe







// All Orders data for Admin Panel 
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({ success: true, orders })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }

}

// User Orders data for frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId })
        res.json({ success: true, orders })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });

    }

}

//Update order Status from Admin Panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: 'Status Updated' })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }

}


const deletePending = async (req, res) => {
    try {
        const { orderId } = req.body;
        if (!orderId) {
            return res.status(400).json({ success: false, message: "orderId is required" });
        }

        const deleteOrder = await orderModel.findByIdAndDelete(orderId);
        if (!deleteOrder) {
            return res.status(404).json({ success: false, message: "Order not found or already deleted" });
        }
        res.json({ success: true, message: "Pending order deleted successfully" });
    } catch (error) {
        console.error("deletePending error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}
export { verifyRazorpay, verifyStripe, placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, deletePending }