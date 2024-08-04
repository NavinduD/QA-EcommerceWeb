import React, { createContext, useState, useEffect } from 'react';
import { db, collection, onSnapshot } from '../Config/Config';

export const ProductsContext = createContext();

export const ProductsContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Products'), (snapshot) => {
      const productData = snapshot.docs.map((doc) => ({
        ProductID: doc.id,
        ...doc.data(),
      }));
      setProducts(productData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ProductsContext.Provider value={{ products }}>
      {children}
    </ProductsContext.Provider>
  );
};
