import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles.css';
import Logo from '../utils/Logo';

const TreeManagementPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialStep = location.state?.step || 1;
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    parentId: '',
    nom: '',
    prenom: '',
    sexe: '',
    dateNaissance: '',
    profession: '',
    photo: null
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0]
    });
  };

  const isIdDuplicate = (id) => {
    return members.some(member => member.id === id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isIdDuplicate(formData.id)) {
      setError('Cet ID est déjà attribué. Veuillez choisir un autre ID.');
      return;
    }

    if (currentStep === 1 && formData.parentId) {
      setError("L'ancêtre ne doit pas avoir de Parent ID. Veuillez laisser ce champ vide.");
      return;
    }

    setMembers([...members, formData]);

    setFormData({ id: '', parentId: '', nom: '', prenom: '', sexe: '', dateNaissance: '', profession: '', photo: null });

    if (currentStep === 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleSaveTree = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('members', JSON.stringify(members));
    members.forEach((member, index) => {
      if (member.photo) {
        formDataToSend.append('photos', member.photo);
      }
    });

    try {
      const response = await axios.post('http://localhost:3000/api/family', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Saved Successfully', response);
    } catch (error) {
      console.error('Error saving the family tree', error);
    }
  };

  const handleViewTree = () => {
    navigate('/view-tree');
  };

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:3000/auth/logout');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="tree-management-page">
      <Logo className="logo"/>
      <button className="logout-button top-right" onClick={handleLogout}>
        Déconnexion
      </button>
      <div className="welcome-paragraph">
        <h2>Bienvenue sur l'application de gestion d'arbre généalogique ! 🌳</h2>
        <p>Suivez les étapes ci-dessous pour créer votre arbre familial :</p>
        <ol>
          <li>Ajoutez d'abord l'ancêtre sans indiquer de Parent ID.</li>
          <li>Ajoutez les parents et leurs frères et sœurs en spécifiant l'ID du parent comme Parent ID.</li>
          <li>Ajoutez-vous, vos frères et sœurs, et les générations suivantes en suivant la même logique.</li>
        </ol>
        <p>
          Pour chaque membre, remplissez le formulaire avec les informations demandées et téléchargez une photo si disponible. Cliquez sur "Ajouter Membre" pour enregistrer chaque entrée. L'ajout des membres se fait génération par génération, pensez à cliquer sur "Prochaine Génération" pour passer à la suivante. Une fois toutes les informations saisies, cliquez sur "Enregistrer l'arbre familial" pour sauvegarder votre arbre. Vous pouvez ensuite le visualiser en cliquant sur "Voir l'Arbre Généalogique".
        </p>
        <p>
          <strong>N.B :</strong> Attention à ne pas attribuer le même ID à 2 membres différents. Les ID sont uniques.
        </p>
      </div>
      <h1 className="current-step-title">
        {currentStep === 1 ? "Ajouter l'ancêtre" :
          currentStep === 2 ? "Ajouter les parents et leurs frères et sœurs" :
            "Ajouter vous-même, vos frères et sœurs, et les dernières générations"}
      </h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="member-form">
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
          placeholder="ID"
          className="input-id"
          required
        />
        <input
          type="text"
          name="parentId"
          value={formData.parentId}
          onChange={handleChange}
          placeholder="Parent ID"
          className="input-parent-id"
          required={currentStep > 1}
        />
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          placeholder="Nom"
          className="input-nom"
          required
        />
        <input
          type="text"
          name="prenom"
          value={formData.prenom}
          onChange={handleChange}
          placeholder="Prénom"
          className="input-prenom"
          required
        />
        <select
          name="sexe"
          value={formData.sexe}
          onChange={handleChange}
          className="input-sexe"
          required
        >
          <option value="">Sélectionner Sexe</option>
          <option value="Homme">Homme</option>
          <option value="Femme">Femme</option>
        </select>
        <input
          type="date"
          name="dateNaissance"
          value={formData.dateNaissance}
          onChange={handleChange}
          placeholder="Date de Naissance"
          className="input-date-naissance"
          required
        />
        <input
          type="text"
          name="profession"
          value={formData.profession}
          onChange={handleChange}
          placeholder="Profession"
          className="input-profession"
          required
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="input-photo"
        />
        <button type="submit" className="add-member-button">Ajouter Membre</button>
      </form>
      {currentStep < 3 && (
        <button onClick={handleNextStep} className="next-step-button">Prochaine Génération</button>
      )}
      <button onClick={handleSaveTree} className="save-tree-button">Enregistrer l'arbre familial</button>
      <button onClick={handleViewTree} className="view-tree-button">Voir l'Arbre Généalogique</button>
      <ul className="members-list">
        {members.map((member, index) => (
          <li key={index} className="member-item">{member.nom} {member.prenom} (ID: {member.id}, Parent ID: {member.parentId})</li>
        ))}
      </ul>
    </div>
  );
};

export default TreeManagementPage;
