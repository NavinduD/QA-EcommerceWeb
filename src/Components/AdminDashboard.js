import React, { useState, useEffect } from 'react';
import { db, collection,doc, getDocs, deleteDoc, updateDoc, auth } from '../Config/Config';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { where, query } from 'firebase/firestore';



export const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products and orders data from Firebase
    const fetchProducts = async () => {
      const user = auth.currentUser;
      if (user) { 
        const productsCollection = collection(db, 'Products');
        const q = query(productsCollection, where('CreatedBy', '==', user.uid));
        const productsSnapshot = await getDocs(q);
  
        const productsData = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setProducts(productsData);
      } else {
        console.log('No logged in user. Skipping product fetch.');
      }
    };

    const fetchOrders = async () => {
      // Similar logic to fetch orders data
    };

    fetchProducts();
    fetchOrders();
  }, []);

  const handleProductDelete = async (productId) => {
    await deleteDoc(doc(db, 'Products', productId));
    window.location.reload();
  };

  const handleProductEdit = (product) => {
    navigate('/edit-product', { state: product });
  };

  const handleProductView = (order) => {
    // Implement order view details
  };

  const handleAddProduct = () => {
    navigate('/addproducts')
  }

  return (
    <div style={{padding:"0 200px"}}>
      <h1>Seller Dashboard</h1>
      <button className='logout-btn'onClick={handleAddProduct}>ADD A PRODUCT</button>
      {/* Product Management Table */}
      <h2 style={{paddingTop:'20px', color:'gray'}}>Product Management</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell align="right">Price (Rs.)</TableCell>
                <TableCell align="right">Actions</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {products.map((product) => (
                <TableRow key={product.id}>
                <TableCell>{product.ProductName}</TableCell>
                <TableCell align="right">{product.ProductPrice}</TableCell>
                <TableCell align="right" style={{gap:'5px', display:'flex'}}>
                    <Button variant="contained" color="error" size="small" onClick={() => handleProductDelete(product.id)}>Delete</Button>
                    <Button variant="contained" size="small" onClick={() => handleProductEdit(product)}>Edit</Button>
                    <Button variant="outlined" size="small" onClick={() => handleProductView(product)}>View</Button>  
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>


      {/* Order Management Table */}
      <h2 style={{paddingTop:'100px', color:'gray'}}>Order Management</h2>
      {/* Similar table structure for order details */}
    </div>
  );
}

