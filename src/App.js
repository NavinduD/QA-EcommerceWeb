import React, { useState, useEffect } from 'react';
import { ProductsContextProvider } from './Global/ProductsContext';
import { Home } from './Components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Signup } from './Components/Signup';
import { Login } from './Components/Login';
import { NotFound } from './Components/NotFound';
import { auth, db, doc, getDoc } from './Config/Config';
import { CartContextProvider } from './Global/CartContext';
import { Cart } from './Components/Cart';
import { AddProducts } from './Components/AddProducts';
import { Cashout } from './Components/Cashout';
import { SellerDashboard } from './Components/AdminDashboard';
import { EditProducts } from './Components/EditProduct';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "SignedUpUsersData", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setUser(docSnap.data().Name); 
        } else {
          console.log("No such document!");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); 
  }, []); 

  return (
    <ProductsContextProvider>
      <CartContextProvider>
        <BrowserRouter>
          <Routes>
            {/* Home */}
            <Route exact path="/" element={<Home user={user} />} /> 

            {/* Signup */}
            <Route path="/signup" element={<Signup />} />

            {/* Login */}
            <Route path="/login" element={<Login />} />

            {/* Cart products */}
            <Route path="/cartproducts" element={<Cart user={user} />} />

            {/* Add products (assuming authorized users only) */}
            <Route path="/addproducts" element={<AddProducts user={user} />} /> 

            {/* Cashout (assuming authorized users only) */}
            <Route path="/cashout" element={<Cashout user={user} />} /> 

            {/* Not found */}
            <Route path="*" element={<NotFound />} /> 
            
            {/* Admin Dashboard */}
            <Route path="/admin-dashboard" element={<SellerDashboard />} />

            {/* Edit product */}
            <Route path="/edit-product" element={<EditProducts user={user} />} />
          </Routes>
        </BrowserRouter>
      </CartContextProvider>
    </ProductsContextProvider>
  );
}

export default App;
