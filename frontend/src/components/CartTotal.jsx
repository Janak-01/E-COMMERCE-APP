import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = ({isCartEmpty}) => {
    
    const { getCartAmount, currency, delivery_fee: baseDeliveryFee} = useContext(ShopContext);

    const finalDeliveryFee = isCartEmpty ? 0 : baseDeliveryFee;

    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <Title text1= {'CART'} text2= {'AMOUNT'} />

            </div> 
            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between'>
                    <p>Subtotal</p>
                    <p>{currency} {getCartAmount()}.00</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p>Shipping Fee</p>
                    <p>{currency} {finalDeliveryFee}</p>
                </div>
                <hr />

                <div className='flex justify-between'>
                    <p>Total</p>
                    <p>{currency} {getCartAmount() === 0? 0: getCartAmount() + finalDeliveryFee}</p>

                </div>

            </div>


        </div>
    )
}

export default CartTotal;
