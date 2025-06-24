import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                <div>
                    <img src={assets.logo} className='mb-5 wb-32' alt="" />
                    <p className='w-full md:w-2/3 text-gray-600'>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio ipsam doloribus delectus ducimus repudiandae enim? Natus molestiae soluta quibusdam quaerat reprehenderit, excepturi et ad, a quae unde reiciendis ducimus illum.
                    </p>
                </div>
                <div>
                    <p className='text-x1 font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gvap-1 text-gray-600'>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy Policy</li>
                    </ul>

                </div>

                <div>
                    <p className='text-x1 font-medium mb-5'>GET IN TOUCH</p>
                    <p className='flex flex-col gap-1 text-gray-600'>
                        <li>+1-212-456-3435</li>
                        <li>contact@foreveryone.com</li>
                    </p>
                </div>

            </div>

            <hr/>

            <div className='py-5 text-sm text-center'>
                Copyright 2024@ forever.com - All rights reserved

            </div>

        </div>
    )
}

export default Footer
