// Configuration Firebase
const firebaseConfig = {
    // Remplacez ces valeurs par vos propres configurations Firebase
    apiKey: "VOTRE_API_KEY",
    authDomain: "votre-projet.firebaseapp.com",
    projectId: "votre-projet",
    storageBucket: "votre-projet.appspot.com",
    messagingSenderId: "votre-messaging-sender-id",
    appId: "votre-app-id"
};

// Initialisation Firebase
firebase.initializeApp(firebaseConfig);

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
        button.classList.toggle('fa-eye');
        button.classList.toggle('fa-eye-slash');
    });
});

// Gestion de l'inscription
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const prenom = document.getElementById('registerPrenom').value;
    const nom = document.getElementById('registerNom').value;
    const email = document.getElementById('registerEmail').value;
    const telephone = document.getElementById('registerTelephone').value;
    const adresse = document.getElementById('registerAdresse').value;
    const besoin = document.getElementById('registerBesoin').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation du mot de passe
    if (password !== confirmPassword) {
        showError(registerForm, 'Les mots de passe ne correspondent pas');
        return;
    }
    
    if (password.length < 6) {
        showError(registerForm, 'Le mot de passe doit contenir au moins 6 caractères');
        return;
    }
    
    try {
        // Création de l'utilisateur
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Mise à jour du profil
        await user.updateProfile({
            displayName: `${prenom} ${nom}`
        });
        
        showSuccess(registerForm, 'Inscription réussie !');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } catch (error) {
        handleAuthError(error);
    }
});

// Gestion de la connexion
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        showSuccess(loginForm, 'Connexion réussie !');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } catch (error) {
        handleAuthError(error);
    }
});

// Connexion avec Google
googleBtn.addEventListener('click', async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        await firebase.auth().signInWithPopup(provider);
        window.location.href = 'index.html';
    } catch (error) {
        handleAuthError(error);
    }
});

// Connexion avec Facebook
facebookBtn.addEventListener('click', async () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    try {
        await firebase.auth().signInWithPopup(provider);
        window.location.href = 'index.html';
    } catch (error) {
        handleAuthError(error);
    }
});

// Gestion des erreurs d'authentification
function handleAuthError(error) {
    let errorMessage = '';
    
    switch (error.code) {
        case 'auth/email-already-in-use':
            errorMessage = 'Cet email est déjà utilisé';
            break;
        case 'auth/invalid-email':
            errorMessage = 'Email invalide';
            break;
        case 'auth/operation-not-allowed':
            errorMessage = 'Opération non autorisée';
            break;
        case 'auth/weak-password':
            errorMessage = 'Le mot de passe est trop faible';
            break;
        case 'auth/user-disabled':
            errorMessage = 'Ce compte a été désactivé';
            break;
        case 'auth/user-not-found':
            errorMessage = 'Aucun compte trouvé avec cet email';
            break;
        case 'auth/wrong-password':
            errorMessage = 'Mot de passe incorrect';
            break;
        default:
            errorMessage = 'Une erreur est survenue';
    }
    
    showError(document.querySelector('.auth-form.active'), errorMessage);
}

// Affichage des messages d'erreur
function showError(form, message) {
    let errorDiv = form.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        form.insertBefore(errorDiv, form.querySelector('button'));
    }
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    
    setTimeout(() => {
        errorDiv.classList.remove('show');
    }, 5000);
}

// Affichage des messages de succès
function showSuccess(form, message) {
    let successDiv = form.querySelector('.success-message');
    if (!successDiv) {
        successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        form.insertBefore(successDiv, form.querySelector('button'));
    }
    successDiv.textContent = message;
    successDiv.classList.add('show');
    
    setTimeout(() => {
        successDiv.classList.remove('show');
    }, 5000);
}

// Vérification de l'état de l'authentification
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // L'utilisateur est connecté
        console.log('Utilisateur connecté:', user.email);
    } else {
        // L'utilisateur est déconnecté
        console.log('Utilisateur déconnecté');
    }
}); 