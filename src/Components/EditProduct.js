import React, { useState } from 'react'
import { ref, db,setDoc,collection,doc, storage } from '../Config/Config'
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import { updateDoc } from 'firebase/firestore';

export const EditProducts = (product) => {

    const [productName, setProductName] = useState(product.ProductName);
    const [productPrice, setProductPrice] = useState(product.ProductPrice);
    const [productImg, setProductImg] = useState(null);
    const [error, setError] = useState('');

    const types = ['image/png', 'image/jpeg']; 

    const navigate = useNavigate();

    const productImgHandler = (e) => {
        let selectedFile = e.target.files[0];
        if (selectedFile && types.includes(selectedFile.type)) {
            setProductImg(selectedFile);
            setError('')
        }
        else {
            setProductImg(null);
            setError('Please select a valid image type (jpg or png)');
        }
    }

    // Edit product
    const editProduct = async (e) => {
        e.preventDefault();
      
        try {
          // Upload product image to storage
          const storageRef = ref(storage, `product-images/${productImg.name}`);
          const uploadTask = uploadBytesResumable(storageRef, productImg);
      
          // Register observers for upload progress and completion
          uploadTask.on('state_changed', 
            (snapshot) => {
              // Observe state change events and update progress
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
            },
            (error) => {
              // Handle unsuccessful uploads
              console.error('Upload failed:', error);
              setError(error.message);
            },
            async () => {
              // Handle successful upload completion
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log('File available at', downloadURL);
      
              // Add product data to Firestore
              const productRef = collection(db, 'Products');
              const productData = {
                ProductName: productName,
                ProductPrice: Number(productPrice),
              };

              // Update ProductImg only if a new image is selected
              if (productImg) {
                productData.ProductImg = downloadURL;
              }

              await updateDoc(doc(productRef, product.id), productData);
      
              // Clear form fields and error message on success
              setProductName('');
              setProductPrice(0);
              setProductImg('');
              setError('');
              document.getElementById('file').value = '';

              navigate('/admin-dashboard');
            }
          );
        } catch (err) {
          console.error('Error adding product:', err);
          setError(err.message);
        }
      };
      
      

    return (
        <div className='container'>
            <br />
            <h2>EDIT PRODUCTS</h2>
            <hr />
            <form autoComplete="off" className='form-group' onSubmit={editProduct}>
                <label htmlFor="product-name">Product Name</label>
                <input type="text" className='form-control' required
                    onChange={(e) => setProductName(e.target.value)} value={productName} />
                <br />
                <label htmlFor="product-price">Product Price</label>
                <input type="number" className='form-control' required
                    onChange={(e) => setProductPrice(e.target.value)} value={productPrice} />
                <br />
                <label htmlFor="product-img">Product Image</label>
                <input type="file" className='form-control' id="file" required
                    onChange={productImgHandler} />
                <br />
                <button type="submit" className='btn btn-success btn-md mybtn'>Save</button>
            </form>
            {error && <span className='error-msg'>{error}</span>}
        </div>
    )
}
