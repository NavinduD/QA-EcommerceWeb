import React, { createContext, useState, useEffect } from 'react'
import { db, collection, onSnapshot, getDocs  } from '../Config/Config'

export const ProductsContext = createContext();

export const ProductsContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
        const productCollection = collection(db, 'Products');
        const productSnapshot = await getDocs(productCollection);
        const productData = productSnapshot.docs.map((doc) => ({
            ProductID: doc.id,
            ...doc.data(), 
        }));
        setProducts(productData);
        };

        getProducts();

        const unsubscribe = onSnapshot(collection(db, 'Products'), (snapshot) => {
        const changes = snapshot.docChanges();
        changes.forEach((change) => {
            if (change.type === 'added') {
            setProducts((prevProducts) => [...prevProducts, {
                ProductID: change.doc.id,
                ...change.doc.data(),
            }]);
            }
        });
        });

        return () => unsubscribe(); 
    }, []);

  return (
    <ProductsContext.Provider value={{ products }}>
      {children}
    </ProductsContext.Provider>
  );
};
