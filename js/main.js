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
                if (!entry.target.classList.contains('formation-card')) {
                    entry.target.classList.add('animate');
                }
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
        maintenance: {
            title: "Maintenance Informatique",
            image: "images/maintenance.png",
            description: "Service complet de maintenance et réparation pour vos équipements informatiques.",
            features: [
                "Diagnostic et dépannage",
                "Installation de logiciels",
                "Nettoyage et optimisation",
                "Récupération de données",
                "Mise à jour système"
            ],
            benefits: [
                "Intervention rapide",
                "Techniciens certifiés",
                "Garantie sur les réparations",
                "Prix compétitifs",
                "Service après-vente"
            ]
        },
        vente: {
            title: "Vente d'Équipements",
            image: "images/sales.png",
            description: "Large gamme d'équipements informatiques de qualité pour tous vos besoins.",
            features: [
                "Ordinateurs et accessoires",
                "Smartphones et tablettes",
                "Périphériques (imprimantes, scanners)",
                "Composants informatiques",
                "Matériel de réseau"
            ],
            benefits: [
                "Produits garantis",
                "Prix compétitifs",
                "Conseils personnalisés",
                "Installation incluse",
                "Service après-vente"
            ]
        },
        Internet: {
            title: "Access Internet",
            image: "images/internet.png",
            description: "Accès Internet haut débit dans nos locaux pour une navigation sécurisée et discrète.",
            features: [
                "Connexion haut débit",
                "Espace de travail confortable",
                "Sécurité renforcée",
                "Assistance technique",
                "Impressions disponibles"
            ],
            benefits: [
                "Navigation rapide",
                "Environnement sécurisé",
                "Confort optimal",
                "Prix abordable",
                "Horaires flexibles"
            ]
        },
        adm: {
            title: "Démarchage Administrative",
            image: "images/impression.png",
            description: "Service complet d'assistance administrative pour faciliter vos démarches.",
            features: [
                "Aide aux démarches administratives",
                "Rédaction de documents",
                "Suivi des dossiers",
                "Conseils personnalisés",
                "Service de messagerie"
            ],
            benefits: [
                "Gain de temps",
                "Expertise administrative",
                "Suivi personnalisé",
                "Confidentialité garantie",
                "Prix transparents"
            ]
        },
        cv: {
            title: "Traitement de CV",
            image: "images/graphic.png",
            description: "Service professionnel de création et d'optimisation de CV pour maximiser vos chances.",
            features: [
                "Création de CV",
                "Optimisation de contenu",
                "Mise en page professionnelle",
                "Adaptation au poste",
                "Conseils personnalisés"
            ],
            benefits: [
                "Design professionnel",
                "Contenu optimisé",
                "Adaptation ATS",
                "Conseils experts",
                "Révisions illimitées"
            ]
        },
        print: {
            title: "Électroménager",
            image: "images/graphic.png",
            description: "Service complet de réparation et maintenance pour vos appareils électroménagers.",
            features: [
                "Réparation d'appareils",
                "Maintenance préventive",
                "Installation",
                "Dépannage urgent",
                "Pièces de rechange"
            ],
            benefits: [
                "Techniciens qualifiés",
                "Intervention rapide",
                "Garantie sur les réparations",
                "Prix compétitifs",
                "Service après-vente"
            ]
        },
        formation: {
            title: "Formations",
            image: "images/graphic.png",
            description: "Formations professionnelles en informatique adaptées à tous les niveaux.",
            features: [
                "Formations personnalisées",
                "Formateurs experts",
                "Support pratique",
                "Certification",
                "Suivi post-formation"
            ],
            benefits: [
                "Apprentissage pratique",
                "Petits groupes",
                "Horaires flexibles",
                "Support continu",
                "Certification reconnue"
            ]
        }
    };

    // Données des formations
    const formationsData = {
        word: {
            title: "Microsoft Word",
            image: "images/formation word.png",
            description: "Formation complète au traitement de texte professionnel avec Microsoft Word. Apprenez à créer des documents professionnels, à utiliser les fonctionnalités avancées et à collaborer efficacement.",
            program: [
                "Interface et fonctionnalités de base",
                "Mise en forme avancée",
                "Tableaux et graphiques",
                "Styles et modèles",
                "Fusion et publipostage",
                "Collaboration et révision",
                "Macros et automatisation",
                "Gestion des références"
            ],
            duration: "1 mois",
            prerequisites: [
                "Connaissances de base en informatique",
                "Accès à Microsoft Word",
                "Motivation et assiduité"
            ],
            price: "299€",
            certification: "Certification Microsoft Office Specialist (MOS)"
        },
        excel: {
            title: "Microsoft Excel",
            image: "images/formation_excel.png",
            description: "Maîtrisez les tableurs avec notre formation Excel complète. Devenez un expert en analyse de données, création de tableaux croisés dynamiques et automatisation des tâches.",
            program: [
                "Fonctions de base et avancées",
                "Formules et calculs",
                "Tableaux croisés dynamiques",
                "Graphiques et visualisation",
                "Macros et automatisation",
                "Analyse de données",
                "Tableaux de bord",
                "Power Query et Power Pivot"
            ],
            duration: "1.5 mois",
            prerequisites: [
                "Connaissances de base en informatique",
                "Accès à Microsoft Excel",
                "Bases en mathématiques"
            ],
            price: "399€",
            certification: "Certification Microsoft Office Specialist (MOS)"
        },
        windows: {
            title: "Windows",
            image: "images/formation_windows.png",
            description: "Apprenez à maîtriser votre système d'exploitation Windows. Cette formation vous permettra d'optimiser votre utilisation quotidienne et de résoudre les problèmes courants.",
            program: [
                "Installation et configuration",
                "Gestion des fichiers et dossiers",
                "Paramètres système",
                "Sécurité et maintenance",
                "Réseau et partage",
                "Dépannage et optimisation",
                "Outils système",
                "Gestion des utilisateurs"
            ],
            duration: "1 mois",
            prerequisites: [
                "Ordinateur avec Windows",
                "Connaissances de base en informatique"
            ],
            price: "249€",
            certification: "Certification Microsoft Technology Associate (MTA)"
        },
        general: {
            title: "Informatique Générale",
            image: "images/pilote_drone.png",
            description: "Formation complète aux bases de l'informatique pour tous les niveaux. Acquérez les compétences essentielles pour utiliser efficacement votre ordinateur au quotidien.",
            program: [
                "Utilisation des systèmes d'exploitation",
                "Suite bureautique (Word, Excel, PowerPoint)",
                "Navigation sur Internet",
                "Sécurité informatique",
                "Gestion des fichiers et dossiers",
                "Communication numérique",
                "Outils de productivité",
                "Maintenance basique"
            ],
            duration: "3 mois",
            prerequisites: [
                "Aucun prérequis",
                "Motivation à apprendre"
            ],
            price: "599€",
            certification: "Certification Formation Minute"
        },
        maintenance: {
            title: "Maintenance",
            image: "images/personnes-reparant.jpg",
            description: "Formation professionnelle à la maintenance informatique. Devenez un technicien qualifié capable de diagnostiquer et résoudre les problèmes hardware et software.",
            program: [
                "Diagnostic et dépannage",
                "Réparation hardware",
                "Installation de logiciels",
                "Réseaux informatiques",
                "Sécurité des systèmes",
                "Pratique sur cas réels",
                "Gestion des stocks",
                "Service client"
            ],
            duration: "6 mois",
            prerequisites: [
                "Connaissances de base en informatique",
                "Intérêt pour le hardware",
                "Capacité d'analyse"
            ],
            price: "1299€",
            certification: "Certification CompTIA A+"
        },
        infographie: {
            title: "Infographie",
            image: "images/fomation_infographie.png",
            description: "Formation complète en design graphique et infographie. Développez votre créativité et apprenez à créer des designs professionnels avec les outils les plus utilisés.",
            program: [
                "Adobe Photoshop",
                "Adobe Illustrator",
                "Design graphique",
                "Création de logos",
                "Mise en page",
                "Projets pratiques",
                "Théorie des couleurs",
                "Typographie"
            ],
            duration: "4 mois",
            prerequisites: [
                "Connaissances de base en informatique",
                "Sens artistique",
                "Créativité"
            ],
            price: "899€",
            certification: "Certification Adobe Certified Associate (ACA)"
        },
        ia: {
            title: "Intelligence Artificielle",
            image: "images/formation_ia.png",
            description: "Découvrez les bases de l'IA et ses applications pratiques. Cette formation vous permettra de comprendre et d'utiliser les technologies d'intelligence artificielle dans votre domaine.",
            program: [
                "Introduction à l'IA",
                "Machine Learning",
                "Deep Learning",
                "Applications pratiques",
                "Éthique de l'IA",
                "Projets concrets",
                "Python pour l'IA",
                "Frameworks populaires"
            ],
            duration: "5 mois",
            prerequisites: [
                "Bases en programmation",
                "Mathématiques",
                "Logique algorithmique"
            ],
            price: "1499€",
            certification: "Certification IBM AI Engineering"
        },
        drone: {
            title: "Pilotage Drone",
            image: "images/pilote_drone.png",
            description: "Formation complète pour devenir pilote de drone certifié. Apprenez les techniques de pilotage, la réglementation et les applications professionnelles des drones.",
            program: [
                "Réglementation aérienne",
                "Techniques de pilotage",
                "Maintenance des drones",
                "Photographie aérienne",
                "Applications professionnelles",
                "Préparation à la certification",
                "Sécurité et prévention",
                "Projets pratiques"
            ],
            duration: "3 mois",
            prerequisites: [
                "Aucun prérequis",
                "Bonne vue",
                "Coordination"
            ],
            price: "799€",
            certification: "Certification DGAC"
        },
        chatgpt: {
            title: "ChatGPT",
            image: "images/chatgtp.png",
            description: "Formation professionnelle à l'utilisation avancée de ChatGPT. Maîtrisez les techniques de prompt engineering et intégrez l'IA dans votre workflow professionnel.",
            program: [
                "Introduction à l'IA conversationnelle",
                "Maîtrise des prompts",
                "Applications professionnelles",
                "Intégration dans le workflow",
                "Éthique et bonnes pratiques",
                "Projets pratiques",
                "Automatisation des tâches",
                "Optimisation des résultats"
            ],
            duration: "2 mois",
            prerequisites: [
                "Connaissances de base en informatique",
                "Anglais basique",
                "Curiosité pour l'IA"
            ],
            price: "499€",
            certification: "Certification Formation Minute"
        }
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
                showServiceModal(service);
            }
        });
    });

    // Ouvrir la modale des formations
    document.querySelectorAll('.formation-card').forEach(card => {
        card.addEventListener('click', () => {
            const formationId = card.getAttribute('data-id');
            const formation = formationsData[formationId];
            if (formation) {
                showFormationModal(formation);
            }
        });
    });
}); 

// Fonction pour afficher la modale de service
function showServiceModal(serviceData) {
    const modal = document.getElementById('serviceModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');
    const modalFeatures = document.getElementById('modalFeatures');
    const modalBenefits = document.getElementById('modalBenefits');

    modalTitle.textContent = serviceData.title;
    modalImage.src = serviceData.image;
    modalDescription.textContent = serviceData.description;

    modalFeatures.innerHTML = '';
    serviceData.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        modalFeatures.appendChild(li);
    });

    modalBenefits.innerHTML = '';
    serviceData.benefits.forEach(benefit => {
        const li = document.createElement('li');
        li.textContent = benefit;
        modalBenefits.appendChild(li);
    });

    modal.style.display = 'block';
}

// Fonction pour afficher la modale de formation
function showFormationModal(formationData) {
    const modal = document.getElementById('formationModal');
    const modalTitle = document.getElementById('formationModalTitle');
    const modalImage = document.getElementById('formationModalImage');
    const modalDescription = document.getElementById('formationModalDescription');
    const modalProgram = document.getElementById('formationModalProgram');
    const modalDuration = document.getElementById('formationModalDuration');
    const modalPrerequisites = document.getElementById('formationModalPrerequisites');
    const modalPrice = document.getElementById('formationModalPrice');
    const modalCertification = document.getElementById('formationModalCertification');

    modalTitle.textContent = formationData.title;
    modalImage.src = formationData.image;
    modalDescription.textContent = formationData.description;
    modalDuration.textContent = formationData.duration;
    modalPrice.textContent = formationData.price;
    modalCertification.textContent = formationData.certification;

    modalProgram.innerHTML = '';
    formationData.program.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        modalProgram.appendChild(li);
    });

    modalPrerequisites.innerHTML = '';
    formationData.prerequisites.forEach(prerequisite => {
        const li = document.createElement('li');
        li.textContent = prerequisite;
        modalPrerequisites.appendChild(li);
    });

    modal.style.display = 'block';
} 