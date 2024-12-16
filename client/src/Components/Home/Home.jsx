import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import headerImage from '../utils/photo.jpeg';

function Home() {
  return (
    <div className="home">
      <header className="home-header">
        <div className="header-image-container">
          <img src={headerImage} alt="Bienvenue sur MyTree" className="header-image" />
          <div className="header-text">
            <h1>Bienvenue sur MyTree</h1>
            <h2>Construisez votre arbre généalogique gratuitement.</h2>
            <p>Renouez l’histoire de votre famille et explorez vos origines.</p>
            <Link to="/signup" className="start-button">Commencer maintenat</Link>
          </div>
        </div>
      </header>
      <main className="home-main">
        <h3>Comment ça marche ?</h3>
        <div className="steps">
          <div className="step">
            <h4>1. Inscrivez-vous et attendez la validation de votre compte par l'administrateur.</h4>
          </div>
          <div className="step">
            <h4>2. Connectez-vous une fois que votre compte est validé.</h4>
          </div>
          <div className="step">
            <h4>3. Remplissez un formulaire et ajoutez les membres de votre famille.</h4>
          </div>
          <div className="step">
            <h4>4. Visualisez votre arbre généalogique.</h4>
          </div>
        </div>
      </main>
      <footer className="home-footer">
        <p>Il est plus facile que jamais de commencer un arbre.</p>
      </footer>
    </div>
  );
}

export default Home;
