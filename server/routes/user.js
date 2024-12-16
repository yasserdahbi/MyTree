import express from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();

router.post("/signup", async (req, res) => {
    const { username, sexe, birth_date, profession, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        return res.json({ message: "L'utilisateur existe déjà" });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        username,
        sexe,
        birth_date,
        profession,
        email,
        password: hashpassword,
        status: "pending" // Nouvel utilisateur en attente de validation
    });

    try {
        await newUser.save();
        return res.json({ 
            status: true, 
            message: "Enregistrement réussi. Votre compte est en attente de validation par l'administrateur.",
            user: {
                _id: newUser._id,
                username: newUser.username,
                sexe: newUser.sexe,
                birth_date: newUser.birth_date,
                profession: newUser.profession,
                email: newUser.email,
                status: newUser.status
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Une erreur est survenue lors de l'enregistrement" });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.json({ status: false, message: "L'utilisateur n'est pas enregistré" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.json({ status: false, message: "Le mot de passe est incorrect" });
    }

    // Check user status
    if (user.status === 'pending') {
        // Return user data even if status is pending
        return res.json({ 
            status: false, 
            user: { 
                _id: user._id,
                username: user.username,
                sexe: user.sexe,
                birth_date: user.birth_date,
                profession: user.profession,
                email: user.email,
                isAdmin: user.isAdmin,
                status: user.status,
            }
        });
    } else if (user.status === 'rejected') {
        // Return user data even if status is rejected
        return res.json({ 
            status: false, 
            user: { 
                _id: user._id,
                username: user.username,
                sexe: user.sexe,
                birth_date: user.birth_date,
                profession: user.profession,
                email: user.email,
                isAdmin: user.isAdmin,
                status: user.status,
            }
        });
    }

    // Generate token for accepted user
    const token = jwt.sign({ username: user.username }, process.env.KEY, { expiresIn: "24h" });

    // Return user data for accepted user
    return res.json({ 
        status: true, 
        message: "Connexion réussie", 
        user: { 
            _id: user._id,
            username: user.username,
            sexe: user.sexe,
            birth_date: user.birth_date,
            profession: user.profession,
            email: user.email,
            isAdmin: user.isAdmin,
            status: user.status,
        },
        token: token 
    });
});


const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json({ status: false, message: "Aucun jeton trouvé" });
        }
        const decoded = await jwt.verify(token, process.env.KEY);
        next();

    } catch (err) {
        return res.json(err);
    }
};


router.get("/verify", verifyUser, (req, res) => {
    return res.json({ status: true, message: "Autorisé" });
});


router.get('/user-requests', async (req, res) => {
    try {
        const userRequests = await User.find({ status: 'pending' });
        res.json(userRequests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.put('/user-requests/:id', async (req, res) => {
    try {
        const userRequest = await User.findById(req.params.id);
        
        if (!userRequest) {
            return res.status(404).json({ message: 'User request not found' });
        }

        if (req.body.accepted) {
            // Mettre à jour le statut de la demande à accepté
            userRequest.status = 'accepted';
            await userRequest.save();

            // Si l'administrateur souhaite rendre l'utilisateur admin
            if (req.body.makeAdmin) {
                userRequest.isAdmin = true;
                await userRequest.save();
            }
        }
        else {
            // Mettre à jour le statut de la demande à refusé
            userRequest.status = 'rejected';
            await userRequest.save();
        }

        res.json({ message: 'User request updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ status: true });
});


export { router as UserRouter } 