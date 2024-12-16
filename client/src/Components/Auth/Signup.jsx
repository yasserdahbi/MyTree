import React, { useState } from 'react';
import './Auth.css';
import Axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import Logo from '../utils/Logo';

const Inscription = () => {
    
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate(); 
    const handleSubmit = (e) => {
        e.preventDefault();
        Axios.post("http://localhost:3000/auth/signup", {
            username,
            email,
            password,
            status: "pending" // Statut en attente de validation
        }).then(response => {
            if(response.data.status){
                navigate('/login');
                alert("Inscription réussie. Votre compte est en attente de validation par l'administrateur.");
            }  
        }).catch(err => {
            console.log(err);
        });
    };
    
    return (
        <div className='sign-up-container'>
            <div className='header'>
                <Logo /> 
            </div>
            <form className='sign-up-from' onSubmit={handleSubmit}>
                <h2>Inscription</h2>    
                <label htmlFor="username">Nom et Prénom</label>
                <input type='text' placeholder="Nom et prénom" onChange={(e) => setUsername(e.target.value)}/>

                <label htmlFor="email">Email :</label>
                <input type="email" autoComplete="off" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>

                <label htmlFor="password">Mot de passe :</label>
                <input type="password" placeholder="******" onChange={(e) => setPassword(e.target.value)}/>

                <button type="submit">S'inscrire</button>
                <p>Vous avez déjà un compte ? <Link to="/login">Connexion</Link></p> 
            </form>
        </div>
    );
}

export default Inscription;
