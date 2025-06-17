document.addEventListener('DOMContentLoaded', function() {
    // Gestion des onglets
    const tabLinks = document.querySelectorAll('.profile-nav li');
    const tabs = document.querySelectorAll('.profile-tab');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Retirer la classe active de tous les liens et onglets
            tabLinks.forEach(l => l.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));

            // Ajouter la classe active au lien cliqué
            link.classList.add('active');

            // Afficher l'onglet correspondant
            const tabId = link.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Gestion du téléchargement d'image de profil
    const imageUpload = document.querySelector('.image-upload');
    const profileImage = document.querySelector('.profile-image img');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    imageUpload.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profileImage.src = e.target.result;
                // Ici, vous pouvez ajouter le code pour envoyer l'image au serveur
            };
            reader.readAsDataURL(file);
        }
    });

    // Gestion des formulaires
    const profileForm = document.getElementById('profileForm');
    const settingsForm = document.getElementById('settingsForm');

    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Récupérer les données du formulaire
        const formData = new FormData(profileForm);
        const data = Object.fromEntries(formData.entries());
        
        // Ici, vous pouvez ajouter le code pour envoyer les données au serveur
        console.log('Données du profil:', data);
        
        // Afficher un message de succès
        showNotification('Profil mis à jour avec succès !');
    });

    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Récupérer les données du formulaire
        const formData = new FormData(settingsForm);
        const data = Object.fromEntries(formData.entries());
        
        // Ici, vous pouvez ajouter le code pour envoyer les données au serveur
        console.log('Paramètres mis à jour:', data);
        
        // Afficher un message de succès
        showNotification('Paramètres mis à jour avec succès !');
    });

    // Fonction pour afficher les notifications
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Supprimer la notification après 3 secondes
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Gestion des formations et certifications
    const formationsList = document.querySelector('.formations-list');
    const certificationsList = document.querySelector('.certifications-list');

    // Exemple de données (à remplacer par les données réelles de votre backend)
    const formations = [
        {
            title: 'Microsoft Word',
            progress: 75,
            status: 'En cours',
            startDate: '2024-01-15',
            endDate: '2024-03-15'
        },
        {
            title: 'Microsoft Excel',
            progress: 100,
            status: 'Terminé',
            startDate: '2023-11-01',
            endDate: '2024-01-01'
        }
    ];

    const certifications = [
        {
            title: 'MOS Word',
            date: '2024-03-15',
            status: 'En attente'
        },
        {
            title: 'MOS Excel',
            date: '2024-01-01',
            status: 'Obtenu'
        }
    ];

    // Fonction pour afficher les formations
    function displayFormations() {
        formationsList.innerHTML = formations.map(formation => `
            <div class="formation-card">
                <h3>${formation.title}</h3>
                <div class="progress-bar">
                    <div class="progress" style="width: ${formation.progress}%"></div>
                </div>
                <p>Progression: ${formation.progress}%</p>
                <p>Statut: ${formation.status}</p>
                <p>Date de début: ${formatDate(formation.startDate)}</p>
                <p>Date de fin: ${formatDate(formation.endDate)}</p>
            </div>
        `).join('');
    }

    // Fonction pour afficher les certifications
    function displayCertifications() {
        certificationsList.innerHTML = certifications.map(certification => `
            <div class="certification-card">
                <h3>${certification.title}</h3>
                <p>Date: ${formatDate(certification.date)}</p>
                <p>Statut: ${certification.status}</p>
            </div>
        `).join('');
    }

    // Fonction pour formater les dates
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }

    // Afficher les formations et certifications
    displayFormations();
    displayCertifications();
}); 