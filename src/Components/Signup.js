import React, { useState } from 'react'
import { auth, db, createUserWithEmailAndPassword, setDoc, doc } from '../Config/Config'
import { useNavigate, NavLink } from 'react-router-dom';

export const Signup = (props) => {

    // defining state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // signup
    const signup = async (e) => {
      e.preventDefault();
    
      try {
        await createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            const uid = user.uid;
            // Create user data in Firestore
            const userRef = doc(db, 'SignedUpUsersData', uid);
            setDoc(userRef, {
              Name: name,
              Email: email,
            })
              .then(() => {
                // Successful user creation and data storage
                setName('');
                setEmail('');
                setPassword('');
                setError('');
                navigate('/login');
              })
              .catch((error) => {
                // Handle Firestore data storage error
                console.error('Error adding document: ', error);
              });
          })
          .catch((error) => {
            // Handle Firebase Authentication error
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error creating user:', error);
            setError(errorMessage);
          });
      } catch (err) {
        // Handle other potential errors
        setError(err.message);
      }
    };
    

      return (
        <div className='container'>
          <br />
          <h2>Sign up</h2>
          <br />
          <form autoComplete="off" className='form-group' onSubmit={signup}>   
    
            <label htmlFor="name">Name</label>
            <input type="text" className='form-control' required onChange={(e) => setName(e.target.value)} value={name} />
            <br />
            <label htmlFor="email">Email</label>
            <input type="email" className='form-control' required onChange={(e) => setEmail(e.target.value)} value={email} />
            <br />
            <label htmlFor="password">Password</label>
            <input type="password" className='form-control' required onChange={(e) => setPassword(e.target.value)} value={password} />
            <br />
            <button type="submit" className='btn btn-success btn-md mybtn' style={{backgroundColor: "#300090df"}}>SUBMIT</button>
          </form>
          {error && <span className='error-msg'>{error}</span>}
          <br />
          <span>Already have an account? Login <NavLink to="/login"> Here</NavLink></span>
        </div>
      );
}
