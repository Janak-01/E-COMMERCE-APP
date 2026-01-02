import { Routes, Route } from 'react-router-dom';
import './index.css';
import React from 'react'
import About from './pages/About';
import Collection from './pages/Collection';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Product from './pages/Product';
import Login from './pages/Login';
import PlaceOrder from './pages/PlaceOrder';
import Orders from './pages/Orders';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import { ToastContainer } from 'react-toastify';
import Verify from './pages/Verify';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './components/NotFound'
//import Navbar from '../../components/Navbar';

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer/>
      <Navbar />
      <SearchBar />
      <Routes>

        {/* public pages */}
        <Route path='/login' element={<Login/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/collection' element={<Collection/>}/>
        <Route path='/product/:productId' element={<Product/>}/>


        {/* Protected Pages */}

        <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
        <Route path='/cart' element={<ProtectedRoute><Cart/></ProtectedRoute>}/>

        <Route path='/place-order' element={<ProtectedRoute><PlaceOrder/></ProtectedRoute>}/>
        <Route path='/orders' element={<ProtectedRoute><Orders/></ProtectedRoute>}/>
        <Route path='/verify' element={<ProtectedRoute><Verify/></ProtectedRoute>}/>

       <Route path='*' element={<NotFoundPage />} /> 
      </Routes>
      <Footer/>

    </div>
  )
}

export default App

