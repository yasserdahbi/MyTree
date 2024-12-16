import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import { UserRouter } from './routes/user.js';


dotenv.config()
const app = express()
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use('/auth', UserRouter)
app.use(cookieParser())

mongoose.connect('mongodb+srv://aya:yATfuPhpm2iZQBAG@mytree.r2clyso.mongodb.net/?retryWrites=true&w=majority&appName=MyTree') 

// Servir les images stockées localement
app.use('/uploads', express.static('uploads'));

const upload = multer({ dest: './uploads' });

// Simuler une base de données en mémoire
let familyMembers = [];

app.post('/api/family', upload.array('photos'), (req, res) => {
  try {
      const members = JSON.parse(req.body.members);
      members.forEach((member, index) => {
          if (req.files && req.files[index]) {
              member.photoPath = 'http://localhost:3000/uploads/' + req.files[index].filename;
          } else {
              member.photoPath = 'http://localhost:3000/uploads/tree.jpg'; // Utiliser une image par défaut si aucune photo n'est fournie
          }
          // Ajouter les champs supplémentaires reçus du formulaire
          member.prenom = member.prenom || '';
          member.sexe = member.sexe || '';
          member.dateNaissance = member.dateNaissance || '';
          member.profession = member.profession || '';
      });
      familyMembers = [...familyMembers, ...members];
      res.status(200).send({ message: 'Family tree saved successfully', familyMembers });
  } catch (error) {
      console.error("Error processing your request", error);
      res.status(500).send({ message: 'Error processing your request', error: error.toString() });
  }
});


app.get('/api/family', (req, res) => {
    // Retourner tous les membres de la famille stockés
    res.status(200).json(familyMembers);
});

app.post('/api/reset-family', (req, res) => {
    // Réinitialiser le tableau des membres de la famille
    familyMembers = [];
    res.status(200).send({ message: 'Family data reset successfully' });
});

// Écoute sur le port configuré dans le fichier .env
app.listen(process.env.PORT, () => {
    console.log("Server is running on port", process.env.PORT);
})

