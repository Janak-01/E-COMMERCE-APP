import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const NotFound = () => {
    return (
        <div className='flex flex-col items-center justify-center min-h-[70vh] text-center p-6'>
            
            {/* Large 404 Heading */}
            <h1 className='text-9xl font-extrabold text-gray-800 tracking-widest'>
                404
            </h1>
            
            {/* Sub-Text/Separator */}
            <div className='bg-black text-white px-2 text-sm rounded rotate-12 absolute mt-20'>
                PAGE NOT FOUND
            </div>

            {/* Main Message */}
            <p className='text-xl sm:text-2xl text-gray-600 mt-20 mb-8'>
                Oops! The page you are looking for seems to have vanished.
            </p>
            
            {/* Helpful Text */}
            <p className='text-gray-500 mb-12 max-w-md'>
                It might have been moved, deleted, or you might have mistyped the address.
            </p>

            {/* Call to Action - Use the Link component for routing */}
            <Link 
                to="/" 
                className='px-6 py-3 text-sm font-medium text-white bg-black border border-transparent rounded-lg hover:bg-gray-700 transition duration-300 shadow-md'
            >
                GO TO HOMEPAGE
            </Link>

            {/* Optional: Add a link back to the previous page */}
            <button 
                onClick={() => window.history.back()}
                className='mt-4 text-sm text-gray-500 hover:text-gray-800 transition duration-300'
            >
                ← Go back
            </button>
        </div>
    );
}

export default NotFound;