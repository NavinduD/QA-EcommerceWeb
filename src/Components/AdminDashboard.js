import React, { useState, useEffect } from 'react';
import { db, collection,doc, getDocs, deleteDoc, updateDoc,getDoc, auth } from '../Config/Config';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Box, Typography,TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { where, query } from 'firebase/firestore';



export const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editProductData, setEditProductData] = useState({});
  const [openEditModal, setOpenEditModal] = useState(false);
  const [verified, setVerified] = useState(false);

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
      const user = auth.currentUser;
      if (user) {
        const ordersCollection = collection(db, 'Orders');
        const ordersSnapshot = await getDocs(ordersCollection);
    
        const ordersData = ordersSnapshot.docs.map(async (document) => {
          const order = document.data();
    
          // Fetch product details for each product ID
          const productDetails = await Promise.all(
           order.productIds.map(async (productId) => {
              const productDoc = doc(db, 'Products', productId);
              const productSnapshot = await getDoc(productDoc);
              const productData = productSnapshot.data();
    
              // Filter products based on current user's ID
              if (productData && productData.CreatedBy === user.uid) {
                setVerified(true);
                return {
                  id: productId,
                  ...productData,
                };
              } else {
                return null; 
              }
            })
          );
    
          const filteredProducts = productDetails.filter((product) => product);
          return {
            id: document.id,
            ...order,
            Products: filteredProducts,
          };
          
        });
    
        const formattedOrders = await Promise.all(ordersData);
        if (verified) {
          setOrders(formattedOrders);
        }
      } else {
        console.log('No logged in user. Skipping order fetch.');
      }
    };    
    
    fetchProducts();
    fetchOrders();
  }, [verified]);

  const handleProductDelete = async (productId) => {
    await deleteDoc(doc(db, 'Products', productId));
    window.location.reload();
  };

  const handleProductEdit = async (product) => {
    setEditProductData(product);
    setOpenEditModal(true);
  };
  const handleEditModalClose = () => {
    setOpenEditModal(false);
    setEditProductData({});
  };

  const handleEditProductSubmit = async () => {
    const { id, ProductName, ProductPrice } = editProductData;
    if (!ProductName || !ProductPrice) {
      alert('Please fill in all fields.');
      return;
    }

    await updateDoc(doc(db, 'Products', id), {
      ProductName,
      ProductPrice,
    });

    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === id ? editProductData : p))
    );

    setOpenEditModal(false);
    setEditProductData({}); 
  };

  const handleAddProduct = () => {
    navigate('/addproducts')
  }

  const handleMarkOrderShipped = async (orderId) => {
    try {
      console.log('Order ID to be deleted:', orderId);
      await deleteDoc(doc(db, 'Orders', orderId));
      console.log('Order deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

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
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>


      {/* Order Management Table */}
      <h2 style={{paddingTop:'100px', color:'gray'}}>Order Management</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Buyer Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>TP No</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Products</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Replace with your logic to fetch and display order data */}
            {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.BuyerName}</TableCell>
                  <TableCell>{order.BuyerEmail}</TableCell>
                  <TableCell>{order.BuyerCell}</TableCell>
                  <TableCell>{order.BuyerAddress}</TableCell>
                  <TableCell>
                    {order.Products.map((product) => (
                      <div key={product.id}>
                        {product.ProductName}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>{order.BuyerPayment}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant={'contained'} 
                      onClick={() => handleMarkOrderShipped(order.id)}
                      color="primary"
                      size="small"
                    >
                      Dispatched
                    </Button>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      
      {/* Edit Product Modal */}
      <Modal open={openEditModal} onClose={handleEditModalClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" component="h2">
            Edit Product
          </Typography>
          <TextField
            label="Product Name"
            value={editProductData.ProductName || ''}
            onChange={(e) =>
              setEditProductData({ ...editProductData, ProductName: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Product Price"
            value={editProductData.ProductPrice || ''}
            onChange={(e) =>
              setEditProductData({ ...editProductData, ProductPrice: e.target.value })
            }
            type="number"
            fullWidth
            margin="normal"
          />
          <Box display="flex" justifyContent="flex-end" gap={'10px'}>
            <Button onClick={handleEditModalClose} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleEditProductSubmit} variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

