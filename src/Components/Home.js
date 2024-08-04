import React, { useEffect } from 'react'
import { Navbar } from './Navbar';
import { Products } from './Products'
import { useNavigate } from 'react-router-dom'
import { auth } from '../Config/Config'
import HeroSection from './Hero';

export const Home = ({ user }) => {

    const navigate = useNavigate();

    useEffect(() => {
        // forcing user to signup
        auth.onAuthStateChanged(user => {
            if (!user) {
                navigate('/login');
            }
        })
    })

    return (
        <div className='wrapper'>
            <Navbar user={user} />
            <HeroSection />
            <Products />
        </div>
    )
}
