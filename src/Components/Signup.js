import React, { useState } from 'react'
import { auth, db, createUserWithEmailAndPassword, setDoc, doc } from '../Config/Config'
import { useNavigate, NavLink } from 'react-router-dom';

export const Signup = () => {

    // defining state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // signup
    const signup = async (e) => {
      e.preventDefault();

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return;
      }

      // Validate password strength
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        setError('Password must be at least 8 characters, contain at least one uppercase letter, one lowercase letter, one number, and one special character');
        return;
      }
    
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
                alert('Successfully created the account!!')
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
            <input type="text" data-testid='name' className='form-control' required onChange={(e) => setName(e.target.value)} value={name} Required/>
            <br />
            <label htmlFor="email">Email</label>
            <input type="email" data-testid='email' className='form-control' required onChange={(e) => setEmail(e.target.value)} value={email} Required/>
            <br />
            <label htmlFor="password">Password</label>
            <input type="password" data-testid='password' className='form-control' required onChange={(e) => setPassword(e.target.value)} value={password} Required/>
            <br />
            <button type="submit" data-testid='submit' className='btn btn-success btn-md mybtn' style={{backgroundColor: "#300090df"}}>SUBMIT</button>
          </form>
          {error && <span className='error-msg'>{error}</span>}
          <br />
          <span>Already have an account? Login <NavLink to="/login"> Here</NavLink></span>
        </div>
      );
}
