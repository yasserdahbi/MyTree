import React, { useState } from 'react';
import './Auth.css';
import Axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../utils/Logo';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isPending, setIsPending] = useState(false); 
    const [rejected, setRejected] = useState(false); 
    const navigate = useNavigate();

    Axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsPending(false);
        setRejected(false);
        Axios.post("http://localhost:3000/auth/login", {
            email,
            password,
        }).then(response => {
            console.log(response.data);
            const userData = response.data.user;

            if (userData) {
                if (!userData.status) {
                    console.log("Status is missing from response data");
                    return;
                }
                if (userData.status === "pending") {
                    setIsPending(true);
                    setEmail('');
                    setPassword('');
                } else if (userData.status === "rejected") {
                    //alert("Votre compte a été refusé par l'administrateur, veuillez contacter le support.");
                    setRejected(true);
                    setEmail('');
                    setPassword('');
                } else if (userData.isAdmin === true) {
                    navigate('/admin');
                } else {
                    navigate('/treemanagementpage');
                }
            } else {
                console.log("User data is missing from response");
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
                <h2>Connexion</h2>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <label htmlFor="email">Email:</label>
                <input type="email" autoComplete="off" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

                <label htmlFor="password">Mot de passe :</label>
                <input type="password" placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} />

                <button type="submit">Connexion</button>
                <p>Vous n'avez pas un compte? <Link to="/signup">S'inscrire</Link></p>
                {isPending && (
                    <div className="alert-pending mt-3" role="alert">
                        Votre compte est en attente de validation.
                     <br /> Un administrateur examinera bientôt vos informations. Une fois approuvé,
                     vous pourrez vous connecter à votre compte. Merci pour votre patience.
                    </div>
                )}
                {rejected && (
                    <div className="alert-rejected mt-3" role="alert">
                        Votre compte a été refusé par l'administrateur.
                     <br /> Veuillez contacter le support.
                    </div>
                )}
            </form>
        </div>
    );
}

export default Login;
