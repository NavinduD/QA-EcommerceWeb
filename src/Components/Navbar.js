import React, { useContext, useState } from 'react'
import logo from '../images/logo.png'
import { Link } from 'react-router-dom'
import { auth } from '../Config/Config'
import { Icon } from 'react-icons-kit'
import { cart } from 'react-icons-kit/entypo/cart'
import { useNavigate, NavLink } from 'react-router-dom';
import { CartContext } from '../Global/CartContext'
import { Modal, Box, Typography, TextField, Button, Alert } from '@mui/material';
import { doc, db, updateDoc } from '../Config/Config'
import { sendPasswordResetEmail, deleteUser } from 'firebase/auth';

export const Navbar = ({ user }) => {
    const navigate = useNavigate();
    const { totalQty } = useContext(CartContext);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editUserData, setEditUserData] = useState({
        username: user?.Name || '',
        email: user?.Email || '',
        password: ''
    });

    // handle logout
    const handleLogout = () => {
        auth.signOut().then(() => {
            navigate('/login');
        });
    };

    // Navigate to Seller dashboard
    const handleSeller = () => {
        navigate('/admin-dashboard');
    };

    // Open edit modal
    const handleEditModalOpen = () => {
        setOpenEditModal(true);
    };

    // Close edit modal
    const handleEditModalClose = () => {
        setOpenEditModal(false);
    };

    // Handle reset password
    const handleResetPassword = async () => {
        const user = auth.currentUser;
        await sendPasswordResetEmail(auth, user.email);
        alert("Password reset email sent. Please check your inbox.");
        handleEditModalClose();
    }

    // Handle delete account
    const handleDelete = async () => {
        const user = auth.currentUser;
        if (user) {
            await deleteUser(user);
            Alert('User deleted successfully');
        };
        handleEditModalClose();
    }

    // Handle user data submission
    const handleUserEditSubmit = async () => {
      const { username } = editUserData;
      const user = auth.currentUser;
    
      if (user) {
        try {
          if (username && username !== user.displayName) {
            const userRef = doc(db, 'SignedUpUsersData', user.uid);
            await updateDoc(userRef, { Name: username });
          }
        } catch (error) {
          alert(error.message);
        }
        
      }
      
      handleEditModalClose();
    };

    return (
        <div className='navbox'>
            <div className='leftside'>
                <img src={logo} alt="Logo" />
            </div>
            {!user && (
                <div className='rightside'>
                    <span><Link to="signup" className='navlink'>SIGN UP</Link></span>
                    <span><Link to="login" className='navlink'>LOGIN</Link></span>
                </div>
            )}
            {user && (
                <div className='rightside'>
                    <span onClick={handleEditModalOpen}><NavLink to="/" className='navlink'>{user}</NavLink></span>
                    <span><NavLink to="/cartproducts" className='navlink'><Icon icon={cart} /></NavLink></span>
                    <span className='no-of-products'>{totalQty}</span>
                    <span><button className='seller-btn' onClick={handleSeller}>Seller</button></span>
                    <span><button className='logout-btn' onClick={handleLogout}>Logout</button></span>
                </div>
            )}
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
                        Edit Profile
                    </Typography>
                    <TextField
                        label="Username"
                        value={editUserData.username}
                        onChange={(e) =>
                            setEditUserData({ ...editUserData, username: e.target.value })
                        }
                        fullWidth
                        margin="normal"
                    />
                    <Box display={'flex'} flexDirection={'column'} gap={'10px'} paddingBottom={'10px'}>
                        <Button onClick={handleResetPassword} variant="outlined" color='success' fullWidth>Reset Password</Button>
                        <Button onClick={handleDelete} variant="outlined" color='error' fullWidth>Delete Account</Button>
                    </Box>
                    <Box display="flex" justifyContent="flex-end" gap={'10px'}>
                        <Button onClick={handleEditModalClose} variant="outlined">
                            Cancel
                        </Button>
                        <Button onClick={handleUserEditSubmit} variant="contained" color="primary">
                            Save
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};