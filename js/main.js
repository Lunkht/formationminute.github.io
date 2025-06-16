// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    // Animation du menu de navigation au scroll
    const header = document.querySelector('.main-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scroll Down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scroll Up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Animation des cartes au scroll
    const cards = document.querySelectorAll('.service-card, .formation-card');
    
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        observer.observe(card);
    });

    // Smooth scroll pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    menuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        // Change l'icône du menu
        const icon = menuToggle.querySelector('i');
        if (mainNav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Ferme le menu quand on clique sur un lien
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Ferme le menu quand on clique en dehors
    document.addEventListener('click', function(event) {
        if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
            mainNav.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Données des services
    const servicesData = {
        'maintenance': {
            title: 'Maintenance Informatique',
            image: 'images/reparateur.png',
            description: 'Service professionnel de maintenance et réparation pour tous vos équipements informatiques.',
            features: [
                'Diagnostic complet',
                'Réparation hardware et software',
                'Nettoyage et optimisation',
                'Installation de logiciels',
                'Récupération de données'
            ],
            benefits: [
                'Service rapide et efficace',
                'Techniciens qualifiés',
                'Garantie sur les réparations',
                'Prix compétitifs',
                'Service à domicile disponible'
            ]
        },
        'vente': {
            title: 'Vente d\'Équipements',
            image: 'images/vente.jpg',
            description: 'Large gamme d\'équipements informatiques de qualité pour tous vos besoins.',
            features: [
                'Ordinateurs neufs et reconditionnés',
                'Périphériques et accessoires',
                'Composants informatiques',
                'Équipements réseau',
                'Solutions de stockage'
            ],
            benefits: [
                'Produits garantis',
                'Prix compétitifs',
                'Conseils personnalisés',
                'Installation incluse',
                'Service après-vente'
            ]
        },
        'voyage': {
            title: 'Assistance Voyage',
            image: 'images/voyage.jpg',
            description: 'Service complet d\'assistance pour vos voyages et démarches administratives.',
            features: [
                'Obtention de visa',
                'Réservation de billets',
                'Assistance administrative',
                'Conseils voyage',
                'Support documentaire'
            ],
            benefits: [
                'Service personnalisé',
                'Expertise administrative',
                'Tarifs négociés',
                'Suivi complet',
                'Support multilingue'
            ]
        }
    };

    // Données des formations
    const formationsData = {
        'word': {
            title: 'Microsoft Word',
            image: 'images/word.jpg',
            description: 'Formation complète pour maîtriser Microsoft Word et devenir un expert en traitement de texte.',
            program: [
                'Interface et fonctionnalités de base',
                'Mise en forme avancée',
                'Tableaux et graphiques',
                'Styles et modèles',
                'Fusion de documents',
                'Collaboration en temps réel'
            ],
            duration: '1 mois',
            prerequisites: [
                'Connaissances de base en informatique',
                'Accès à Microsoft Word',
                'Ordinateur personnel recommandé'
            ]
        },
        'excel': {
            title: 'Microsoft Excel',
            image: 'images/excel.jpg',
            description: 'Formation professionnelle pour maîtriser Excel et l\'analyse de données.',
            program: [
                'Fonctions et formules',
                'Tableaux croisés dynamiques',
                'Graphiques et visualisation',
                'Macros et automatisation',
                'Analyse de données',
                'Tableaux de bord'
            ],
            duration: '1.5 mois',
            prerequisites: [
                'Connaissances de base en informatique',
                'Accès à Microsoft Excel',
                'Ordinateur personnel recommandé'
            ]
        }
        // Ajoutez d'autres formations ici
    };

    // Gestion des modales
    const serviceModal = document.getElementById('serviceModal');
    const formationModal = document.getElementById('formationModal');
    const closeButtons = document.querySelectorAll('.close-modal');

    // Fermer les modales
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            serviceModal.style.display = 'none';
            formationModal.style.display = 'none';
        });
    });

    // Fermer les modales en cliquant en dehors
    window.addEventListener('click', (e) => {
        if (e.target === serviceModal) {
            serviceModal.style.display = 'none';
        }
        if (e.target === formationModal) {
            formationModal.style.display = 'none';
        }
    });

    // Ouvrir la modale des services
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => {
            const serviceId = card.getAttribute('data-id');
            const service = servicesData[serviceId];
            if (service) {
                document.getElementById('modalTitle').textContent = service.title;
                document.getElementById('modalImage').src = service.image;
                document.getElementById('modalDescription').textContent = service.description;
                
                const featuresList = document.getElementById('modalFeatures');
                featuresList.innerHTML = '';
                service.features.forEach(feature => {
                    const li = document.createElement('li');
                    li.textContent = feature;
                    featuresList.appendChild(li);
                });

                const benefitsList = document.getElementById('modalBenefits');
                benefitsList.innerHTML = '';
                service.benefits.forEach(benefit => {
                    const li = document.createElement('li');
                    li.textContent = benefit;
                    benefitsList.appendChild(li);
                });

                serviceModal.style.display = 'block';
            }
        });
    });

    // Ouvrir la modale des formations
    document.querySelectorAll('.formation-card').forEach(card => {
        card.addEventListener('click', () => {
            const formationId = card.getAttribute('data-id');
            const formation = formationsData[formationId];
            if (formation) {
                document.getElementById('formationModalTitle').textContent = formation.title;
                document.getElementById('formationModalImage').src = formation.image;
                document.getElementById('formationModalDescription').textContent = formation.description;
                document.getElementById('formationModalDuration').textContent = formation.duration;

                const programList = document.getElementById('formationModalProgram');
                programList.innerHTML = '';
                formation.program.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    programList.appendChild(li);
                });

                const prerequisitesList = document.getElementById('formationModalPrerequisites');
                prerequisitesList.innerHTML = '';
                formation.prerequisites.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    prerequisitesList.appendChild(li);
                });

                formationModal.style.display = 'block';
            }
        });
    });
}); 