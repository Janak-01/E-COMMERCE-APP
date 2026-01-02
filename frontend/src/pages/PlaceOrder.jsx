import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'



const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData(data => ({ ...data, [name]: value }))
  }

  // const initPay = async (order) => {
  //   const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  //   if (!res) {
  //     toast.error("Razorpay SDK Failed to load. are you online? ");
  //     return;
  //   }

  //   const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
  //   if (!keyId) {
  //     toast.error("Razorpay Key ID is missing from environment variables!");
  //     console.error("VITE_RAZORPAY_KEY_ID is missing.");
  //     return;
  //   }



  //   const options = {
  //     key: keyId,
  //     amount: order.amount,
  //     currency: order.currency,
  //     name: 'Order Payment',
  //     description: 'Order Payment',
  //     order_id: order.id,

  //     handler: async (response) => {
  //       try {
  //         const payload = {
  //           razorpay_payment_id: response.razorpay_payment_id,
  //           razorpay_order_id: response.razorpay_order_id,
  //           razorpay_signature: response.razorpay_signature,
  //           userId: localStorage.getItem("userId") // or from context
  //         };

  //         const { data } = await axios.post(
  //           backendUrl + '/api/order/verifyRazorpay',
  //           payload,
  //           { headers: { token } }
  //         );

  //         if (data.success) {
  //           toast.success("Payment successful");
  //           setCartItems({});
  //           navigate('/orders');
  //         } else {
  //           toast.error("Payment verification failed");
  //         }

  //       } catch (error) {
  //         console.error(error);
  //         toast.error("Payment verification failed");
  //       }
  //     },


  //     modal: {
  //       ondismiss: async () => {
  //         console.log("Razorpay checkout modal dismissed by user.");

  //         try {
  //           await axios.post(
  //             backendUrl + '/api/order/deletePending',
  //             { orderId: order.receipt },
  //             { headers: { token } }
  //           );
  //           toast.info("Payment cancelled. Pending order deleted.");
  //         } catch (error) {
  //           console.error("Failed to delete pending order:", error);
  //         }
  //       }
  //     }
  //   }

  //   try {
  //     console.log("Checkout options:", {
  //       amount: order.amount,
  //       currency: order.currency,
  //       order_id: order.id
  //     });
  //     const rzp = new window.Razorpay(options);
  //     rzp.open();
  //   } catch (error) {
  //     // This will catch the 'is not a constructor' error if the key is bad/missing
  //     console.error("Razorpay Constructor Error:", error);
  //     toast.error("Payment gateway failed to start. Check your API Key ID.");
  //   }

  // };


  const initPay = async (order) => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Your Store",
      description: "Order Payment",
      order_id: order.id,

      config: {
        display: {
          blocks: {
            banks: {
              name: 'All payment methods',
              instruments: [
                {
                  method: 'card',
                  issuers: ['HDFC', 'ICIC', 'UTIB']  // Indian banks
                },
                {
                  method: 'netbanking'
                }
              ]
            }
          },
          sequence: ['block.banks'],
          preferences: {
            show_default_blocks: true
          }
        }
      },

      handler: async function (response) {
        console.log("Payment successful:", response);

        try {
          const verifyRes = await axios.post(
            backendUrl + '/api/order/verifyRazorpay',
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            },
            { headers: { token } }
          );

          if (verifyRes.data.success) {
            toast.success("Payment verified!");
            setCartItems({});
            navigate('/orders');
          } else {
            toast.error("Payment verification failed");
          }
        } catch (error) {
          console.error("Verification error:", error);
          toast.error(error.message);
        }
      },

      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone
      },

      notes: {
        address: `${formData.street}, ${formData.city}`
      },

      theme: {
        color: "#3399cc"
      }
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', function (response) {
      console.error("Payment failed:", response.error);
      alert(`Payment Failed: ${response.error.description}\nReason: ${response.error.reason}`);
      toast.error(response.error.description);
    });

    rzp.open();
  };


  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      let orderItems = []
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id == items))

            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }

          }
        }
      }

      if (orderItems.length === 0) {
        toast.error("Your cart is empty. Please add items before placing an order.");
        // OPTIONAL: Navigate back to the cart page
        // navigate('/cart'); 
        return; // STOP execution if the cart is empty
      }

      //console.log(orderItems);
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }

      switch (method) {
        //API CALLS FOR COD
        case 'cod': {
          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } });

          if (response.data.success) {
            setCartItems({});
            navigate('/orders')

          }
          else {
            toast.error(response.data.message);
          }
        }
          break;

        case 'stripe': {
          const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } });

          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url)

          }
          else {
            toast.error(responseStripe.data.message);
          }
        }
          break;

        case 'razorpay': {
          try {
            const responseRazorpay = await axios.post(
              backendUrl + '/api/order/razorpay',
              orderData,
              { headers: { token } }
            );

            if (responseRazorpay.data.success) {
              initPay(responseRazorpay.data.order);
            } else {
              toast.error(responseRazorpay.data.message);
            }
          } catch (error) {
            console.error("Order creation error:", error);
            toast.error(error.response?.data?.message || "Failed to create order");
          }
        }
          break;

        default:
          break;
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);

    }


  }



  return (

    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* ------Left Side-------- */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-x1 sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder="First name" />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder="Last name" />
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder="Email address" />
        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder="Street" />
        <div className='flex gap-3'>
          <input required
            onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder="City" />
          <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder="State" />
        </div>

        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder="Zipcode" />
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder="Country" />

        </div>

        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder="Phone" />

      </div>

      {/* ------------------ Right side ----------------*/}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          {/* Payment method selection */}
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div>

            <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
            </div>

            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
          </div>


        </div>

      </div>


    </form>

  )
}

export default PlaceOrder
