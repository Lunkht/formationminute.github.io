// Configuration Firebase
const firebaseConfig = {
    // Remplacez ces valeurs par vos propres configurations Firebase
    apiKey: "AIzaSyCXxk3bBiMl0C-zoqbE1rCG5xB1Uf1gppE", // J'ai gardé votre clé API fournie
    authDomain: "formationminute-cd486.firebaseapp.com", // Corrigé pour correspondre à votre projet
    projectId: "formationminute-cd486", // Correspond déjà à votre projet
    storageBucket: "formationminute-cd486.appspot.com", // Basé sur votre Project ID
    messagingSenderId: "233110341078", // Basé sur votre Project Number
    appId: "votre-app-id" // Cet ID est spécifique à l'application que vous avez ajoutée (Web, iOS, Android) dans les paramètres du projet Firebase. Vous devrez le trouver dans la console Firebase > Paramètres du projet > Vos applications.
};

// Initialisation Firebase
// J'utilise la syntaxe modulaire (v9+) qui est la plus récente et recommandée
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    FacebookAuthProvider, 
    onAuthStateChanged,
    updateProfile,
    sendEmailVerification,
    signOut
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Obtient l'instance Auth
const db = getFirestore(app);

// Éléments DOM
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const togglePasswordButtons = document.querySelectorAll('.toggle-password');
const googleBtn = document.querySelector('.google-btn');
const facebookBtn = document.querySelector('.facebook-btn');

// Gestion des onglets
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetForm = tab.dataset.tab;
        
        // Mise à jour des onglets
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Mise à jour des formulaires
        authForms.forEach(form => {
            form.classList.remove('active');
            if (form.id === `${targetForm}-form`) {
                form.classList.add('active');
            }
        });
    });
});

// Toggle password visibility
togglePasswordButtons.forEach(button => {
    button.addEventListener('click', () => {
        const input = button.previousElementSibling;
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        // J'assume que vous utilisez des classes pour les icônes (ex: Font Awesome)
        // Si vos classes sont différentes, ajustez ici.
        button.classList.toggle('fa-eye'); 
        button.classList.toggle('fa-eye-slash');
    });
});

// Redirection automatique si déjà connecté (sur page de connexion/inscription)
if (window.location.pathname.includes('connexion') || window.location.pathname.includes('inscription')) {
    onAuthStateChanged(auth, (user) => {
        if (user && user.emailVerified) {
            window.location.href = 'index.html';
        }
    });
}

// Gestion de l'inscription
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const prenom = document.getElementById('registerPrenom').value;
    const nom = document.getElementById('registerNom').value;
    const email = document.getElementById('registerEmail').value;
    const telephone = document.getElementById('registerTelephone').value; // Note: Le numéro de téléphone n'est pas stocké par défaut avec email/password
    const adresse = document.getElementById('registerAdresse').value; // Note: L'adresse n'est pas stockée par défaut avec email/password
    const besoin = document.getElementById('registerBesoin').value; // Note: Ce champ n'est pas stocké par défaut avec email/password
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation du mot de passe
    if (password !== confirmPassword) {
        showError(registerForm, 'Les mots de passe ne correspondent pas');
        return;
    }
    
    // Firebase Authentication a une validation de mot de passe minimale par défaut de 6 caractères.
    // Cette validation côté client est une bonne pratique mais n'est pas strictement nécessaire pour le fonctionnement de createUserWithEmailAndPassword.
    if (password.length < 6) {
         showError(registerForm, 'Le mot de passe doit contenir au moins 6 caractères');
         return;
     }
    
    try {
        // Création de l'utilisateur avec email et mot de passe
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Mise à jour du profil pour ajouter le nom et prénom
        // Notez que les champs téléphone, adresse, besoin ne font pas partie du profil utilisateur par défaut de Firebase Auth.
        // Si vous souhaitez les stocker, vous devriez les enregistrer dans une base de données (comme Cloud Firestore ou Realtime Database)
        // en utilisant l'UID de l'utilisateur comme clé, après l'inscription réussie.
        await updateProfile(user, {
            displayName: `${prenom} ${nom}`
        });
        
        // Stockage des infos personnalisées dans Firestore
        await setDoc(doc(db, "users", user.uid), {
            prenom,
            nom,
            email,
            telephone,
            adresse,
            besoin,
            createdAt: new Date()
        });
        
        // Envoi de l'email de vérification
        await sendEmailVerification(user);
        
        console.log('Inscription réussie pour:', user.email);
        showSuccess(registerForm, 'Inscription réussie ! Vérifiez votre email pour activer votre compte.');
        
        // Redirection après succès
        window.location.href = 'connexion.html';
        
    } catch (error) {
        handleAuthError(error, registerForm); // Passe le formulaire pour afficher l'erreur au bon endroit
    }
});

// Gestion de la connexion
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        if (!user.emailVerified) {
            await signOut(auth);
            showError(loginForm, 'Votre email n\'est pas vérifié. Veuillez vérifier votre boîte mail.');
            return;
        }
        showSuccess(loginForm, 'Connexion réussie !');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000); // Redirige après 2 secondes
        
    } catch (error) {
        handleAuthError(error, loginForm); // Passe le formulaire pour afficher l'erreur au bon endroit
    }
});

// Connexion avec Google
googleBtn.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    try {
        // Assurez-vous que la méthode Google est activée dans la console Firebase > Authentication > Sign-in method
        await signInWithPopup(auth, provider);
        console.log('Connexion réussie avec Google');
        window.location.href = 'index.html';
    } catch (error) {
        // Gérer spécifiquement les erreurs de popup si nécessaire
        if (error.code === 'auth/popup-closed-by-user') {
             console.log('Popup Google fermée par l\'utilisateur');
             // Vous pouvez choisir de ne rien faire ou d'afficher un message moins intrusif
        } else if (error.code === 'auth/cancelled-popup-request') {
             console.log('Requête de popup Google annulée (plusieurs popups déclenchées trop vite)');
        } else if (error.code === 'auth/popup-blocked') {
             console.log('Popup Google bloquée par le navigateur');
             showError(document.querySelector('.auth-form.active'), 'La popup de connexion Google a été bloquée. Veuillez autoriser les popups pour ce site.');
        }
        else {
            handleAuthError(error, document.querySelector('.auth-form.active')); // Gère les autres erreurs
        }
    }
});

// Connexion avec Facebook
facebookBtn.addEventListener('click', async () => {
    const provider = new FacebookAuthProvider();
     // Vous pouvez ajouter des scopes supplémentaires si nécessaire, comme dans l'exemple de la documentation:
     // provider.addScope('email');
     // provider.addScope('user_friends');
    try {
        // Assurez-vous que la méthode Facebook est activée dans la console Firebase > Authentication > Sign-in method
        await signInWithPopup(auth, provider);
        console.log('Connexion réussie avec Facebook');
        window.location.href = 'index.html';
    } catch (error) {
         // Gérer spécifiquement les erreurs de popup Facebook
         if (error.code === 'auth/popup-closed-by-user') {
             console.log('Popup Facebook fermée par l\'utilisateur');
         } else if (error.code === 'auth/cancelled-popup-request') {
              console.log('Requête de popup Facebook annulée');
         } else if (error.code === 'auth/popup-blocked') {
             console.log('Popup Facebook bloquée par le navigateur');
             showError(document.querySelector('.auth-form.active'), 'La popup de connexion Facebook a été bloquée. Veuillez autoriser les popups pour ce site.');
         } else if (error.code === 'auth/account-exists-with-different-credential') {
            console.log('Compte existant avec une autre méthode:', error.email);
            // Ceci est un cas d'erreur courant lorsque l'email est déjà utilisé mais avec une autre méthode (ex: email/password)
            // Vous pouvez gérer ce cas en demandant à l'utilisateur de se connecter avec la méthode existante et de lier les comptes.
            // La documentation Firebase Auth (que je ne peux pas lier ici) a des exemples détaillés pour gérer ce scénario 'auth/account-exists-with-different-credential'.
            showError(document.querySelector('.auth-form.active'), `Un compte existe déjà avec cet email (${error.email}). Veuillez vous connecter avec la méthode d'origine.`);
         }
        else {
             handleAuthError(error, document.querySelector('.auth-form.active')); // Gère les autres erreurs
         }
    }
});

// Gestion des erreurs d'authentification (prend maintenant le formulaire en paramètre)
function handleAuthError(error, form) {
    let errorMessage = '';
    
    switch (error.code) {
        case 'auth/email-already-in-use':
            errorMessage = 'Cet email est déjà utilisé par un autre compte.';
            break;
        case 'auth/invalid-email':
            errorMessage = 'L\'adresse email est mal formatée.';
            break;
        case 'auth/operation-not-allowed':
            // Cela signifie généralement que la méthode de connexion n'est pas activée dans la console Firebase.
            errorMessage = 'La méthode de connexion n\'est pas activée pour ce projet. Veuillez vérifier les paramètres d\'authentification.';
            console.error("Erreur Firebase:", error.code, "- Assurez-vous que la méthode de connexion est activée dans la console Firebase.");
            break;
        case 'auth/weak-password':
            errorMessage = 'Le mot de passe est trop faible. Il doit contenir au moins 6 caractères.';
            break;
        case 'auth/user-disabled':
            errorMessage = 'Ce compte utilisateur a été désactivé par un administrateur.';
            break;
        case 'auth/user-not-found':
            // Attention: Avec la protection contre l'énumération des emails activée, cette erreur peut aussi signifier que l'email ou le mot de passe est incorrect.
            errorMessage = 'Aucun compte trouvé avec cet email, ou le mot de passe est incorrect.';
             console.warn("Erreur Firebase:", error.code, "- Notez que cette erreur peut masquer l'existence d'un email si la protection contre l'énumération est activée.");
            break;
        case 'auth/wrong-password':
            // Attention: Avec la protection contre l'énumération des emails activée, cette erreur est moins fréquente et l'erreur auth/user-not-found est souvent renvoyée à la place.
            errorMessage = 'Le mot de passe est incorrect.';
             console.warn("Erreur Firebase:", error.code, "- Avec la protection contre l'énumération, l'erreur auth/user-not-found est souvent renvoyée à la place.");
            break;
        case 'auth/auth-domain-config-required':
             errorMessage = 'Configuration du domaine d\'authentification manquante ou incorrecte.';
             console.error("Erreur Firebase:", error.code, "- Vérifiez la configuration authDomain dans votre code et dans la console Firebase.");
             break;
        case 'auth/unauthorized-domain':
             errorMessage = 'Le domaine de votre application n\'est pas autorisé pour les opérations OAuth.';
             console.error("Erreur Firebase:", error.code, "- Ajoutez le domaine actuel à la liste des domaines autorisés dans la console Firebase > Authentication > Settings > Authorized domains.");
             break;
         case 'auth/network-request-failed':
             errorMessage = 'Problème de réseau. Veuillez vérifier votre connexion.';
             console.error("Erreur Firebase:", error.code, "- Erreur réseau lors de la requête.");
             break;
        // Ajoutez d'autres codes d'erreur Firebase Auth pertinents ici si vous les rencontrez
        // Par exemple: auth/invalid-credential, auth/requires-recent-login, etc.
        default:
            errorMessage = `Une erreur inconnue est survenue : ${error.message}`;
            console.error('Erreur Firebase inconnue:', error);
            break;
    }
    
    showError(form, errorMessage);
}

// Affichage des messages d'erreur
function showError(form, message) {
    // Supprime le message de succès s'il existe
    let successDiv = form.querySelector('.success-message');
    if (successDiv) {
        successDiv.remove();
    }

    let errorDiv = form.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        // Insère le message d'erreur avant le premier bouton du formulaire
        const firstButton = form.querySelector('button');
        if (firstButton) {
            form.insertBefore(errorDiv, firstButton);
        } else {
            // Si pas de bouton, l'insère à la fin
            form.appendChild(errorDiv);
        }
    }
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    
    // Cache le message d'erreur après 5 secondes
    setTimeout(() => {
        errorDiv.classList.remove('show');
        // Vous pouvez aussi choisir de le retirer complètement du DOM après le délai
        // errorDiv.remove();
    }, 5000);
}

// Affichage des messages de succès
function showSuccess(form, message) {
     // Supprime le message d'erreur s'il existe
    let errorDiv = form.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }

    let successDiv = form.querySelector('.success-message');
    if (!successDiv) {
        successDiv = document.createElement('div');
        successDiv.className = 'success-message';
         // Insère le message de succès avant le premier bouton du formulaire
        const firstButton = form.querySelector('button');
        if (firstButton) {
            form.insertBefore(successDiv, firstButton);
        } else {
             // Si pas de bouton, l'insère à la fin
            form.appendChild(successDiv);
        }
    }
    successDiv.textContent = message;
    successDiv.classList.add('show');
    
    // Cache le message de succès après 5 secondes
    setTimeout(() => {
        successDiv.classList.remove('show');
        // Vous pouvez aussi choisir de le retirer complètement du DOM après le délai
        // successDiv.remove();
    }, 5000);
}

// Fonction de déconnexion exportée
export function logout() {
    signOut(auth).then(() => {
        window.location.href = 'connexion.html';
    });
}
