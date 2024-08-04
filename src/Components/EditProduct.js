import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db, doc, updateDoc, getDoc } from '../Config/Config';
import { TextField, Button, Box } from '@mui/material';

export const EditProduct = () => {
  const [productData, setProductData] = useState({});
  const navigate = useNavigate();
  const { productId } = useParams(); 

  useEffect(() => {
    const fetchProductData = async () => {
      const productRef = doc(db, 'Products', productId);
      const productDocSnapshot = await getDoc(productRef); 

      // Check if product exists before accessing data
      if (productDocSnapshot.exists) {
        setProductData(productDocSnapshot.data());
        console.log(productDocSnapshot.data());
      } else {
        console.error('Product not found!');
        navigate('/seller-dashboard');
      }
    };
    fetchProductData();
  }, [productId, navigate]);


  const handleChange = (event) => {
    setProductData({ ...productData, [event.target.name]: event.target.value });
  };

  const handleSaveProduct = async () => {
    const productRef = doc(db, 'Products', productId);
    await updateDoc(productRef, productData);
    navigate('/seller-dashboard');
  };

  const handleCancel = () => {
    navigate('/seller-dashboard');
  };

  return (
    <div style={{ padding: '0 200px' }}>
      <h1>Edit Product</h1>
      <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>
        <TextField
          id="productName"
          name="ProductName"
          label="Product Name"
          variant="outlined"
          value={productData.ProductName || ''}
          onChange={handleChange}
          required
        />
        <TextField
          id="productPrice"
          name="ProductPrice"
          label="Product Price (Rs.)"
          variant="outlined"
          type="number"
          value={productData.ProductPrice || ''}
          onChange={handleChange}
          required
        />

        <Button variant="contained" color="primary" onClick={handleSaveProduct}>
          Save
        </Button>
        <Button variant="contained" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
    </div>
  );
};

