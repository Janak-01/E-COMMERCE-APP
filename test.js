// test-razorpay.js (run with node)
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: 'rzp_test_Rz0ewIh7bWVaxs',
  key_secret: '4r3FzKJuzdYMhV4wFK6ZF02I'
});

razorpay.orders.create({
  amount: 50000, // 500 INR
  currency: 'INR',
  receipt: 'test_receipt'
})
.then(order => {
  console.log("✅ Razorpay working! Order:", order);
})
.catch(error => {
  console.error("❌ Razorpay error:", error);
});