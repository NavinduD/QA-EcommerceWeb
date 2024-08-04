import React, { useContext } from 'react'
import logo from '../images/logo.png'
import { Link } from 'react-router-dom'
import { auth } from '../Config/Config'
import { Icon } from 'react-icons-kit'
import { cart } from 'react-icons-kit/entypo/cart'
import { useNavigate, NavLink } from 'react-router-dom';
import { CartContext } from '../Global/CartContext'

export const Navbar = ({ user }) => {

    const navigate = useNavigate();
    const { totalQty } = useContext(CartContext);

    // handle logout
    const handleLogout = () => {
        auth.signOut().then(() => {
            navigate('/login');
        })
    }
    // Navigate to Seller dashboard
    const handleSeller = () => {
        navigate('/admin-dashboard')
    }
    return (
        <div className='navbox'>
            <div className='leftside'>
                <img src={logo} alt="" />
            </div>
            {!user && <div className='rightside'>
                <span><Link to="signup" className='navlink'>SIGN UP</Link></span>
                <span><Link to="login" className='navlink'>LOGIN</Link></span>
            </div>}
            {user && <div className='rightside'>
                <span><NavLink to="/" className='navlink'>{user}</NavLink></span>
                <span><NavLink to="/cartproducts" className='navlink'><Icon icon={cart} /></NavLink></span>
                <span className='no-of-products'>{totalQty}</span>
                <span><button className='seller-btn' onClick={handleSeller}>Seller</button></span>
                <span><button className='logout-btn' onClick={handleLogout}>Logout</button></span>
            </div>}
        </div>
    )
}
