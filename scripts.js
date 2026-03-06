/**
 * scripts.js - Walter Medor
 * Version Finale : Gestion universelle des chemins racine/sous-dossiers
 */

// Détection dynamique du chemin racine
// Calcule le bon nombre de "../" selon la profondeur réelle de l'URL
const getBasePath = () => {
    const segments = window.location.pathname
        .split('/')
        .filter(s => s !== '' && !s.includes('.html'));
    if (segments.length === 0) return './';
    return '../'.repeat(segments.length);
};

/**
 * Charge un composant HTML (Header, Footer)
 */
async function loadComponent(id, fileName) {
    const element = document.getElementById(id);
    if (!element) return;

    const url = getBasePath() + fileName;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Fichier non trouvé à l'adresse : ${url}`);

        const data = await response.text();
        element.innerHTML = data;

        if (id === "main-header") {
            initMobileMenu(element);
        }
    } catch (error) {
        console.error(`❌ Erreur chargement ${fileName} :`, error);
    }
}

/**
 * Initialisation du Menu Mobile
 * Appelée UNIQUEMENT après l'injection du HTML du header
 */
function initMobileMenu(headerElement) {
    const menuToggle = headerElement.querySelector('.menu-toggle');
    const navMenu = headerElement.querySelector('.nav-menu');

    if (!menuToggle || !navMenu) return;

    // Ouverture/fermeture du menu burger
    menuToggle.onclick = (e) => {
        e.preventDefault();
        const isActive = navMenu.classList.toggle('active');
        menuToggle.classList.toggle('is-active');
        document.body.style.overflow = isActive ? 'hidden' : '';
    };

    // Clic sur "Groupe" sur mobile : ouvre/ferme le sous-menu
    navMenu.querySelectorAll('.dropdown > a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 985) {
                e.preventDefault();
                link.closest('.dropdown').classList.toggle('submenu-open');
            }
        });
    });

    // Fermeture du menu au clic sur un lien final
    navMenu.querySelectorAll('a:not(.dropdown > a)').forEach(link => {
        link.onclick = () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('is-active');
            document.body.style.overflow = '';
        };
    });
}

/**
 * Lancement au chargement du DOM
 */
document.addEventListener("DOMContentLoaded", () => {
    // Injection dynamique du favicon
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = '/Images/icon.png';
    favicon.type = 'image/png';
    document.head.appendChild(favicon);

    Promise.all([
        loadComponent("main-header", "header.html"),
        loadComponent("main-footer", "footer.html")
    ]).then(() => {
        if (typeof initAudioPlayers === 'function') initAudioPlayers();
        if (typeof initInfiniteCarousel === 'function') initInfiniteCarousel();
    });
});

/* --- AUDIO --- */

function initAudioPlayers() {
    const playButtons = document.querySelectorAll('.play-pause-btn');
    playButtons.forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            const audioId = this.getAttribute('data-audio');
            const audio = document.getElementById(audioId);
            const bar = document.getElementById('bar-' + audioId);
            if (!audio) return;
            if (audio.paused) {
                document.querySelectorAll('audio').forEach(t => t.pause());
                document.querySelectorAll('.play-pause-btn').forEach(b => b.innerText = "▶");
                audio.play();
                this.innerText = "II";
            } else {
                audio.pause();
                this.innerText = "▶";
            }
            audio.ontimeupdate = () => {
                if (bar && audio.duration) {
                    bar.style.width = (audio.currentTime / audio.duration) * 100 + "%";
                }
            };
        };
    });
}

/* --- CARROUSEL --- */

function initInfiniteCarousel() {
    const track = document.querySelector('.carousel-slide');
    const items = document.querySelectorAll('.carousel-slide img');
    if (!track || items.length === 0) return;
    const gap = 20;
    let index = 0;
    if (track.children.length === items.length) {
        items.forEach(item => track.appendChild(item.cloneNode(true)));
    }
    const move = () => {
        const itemWidth = items[0].getBoundingClientRect().width + gap;
        track.style.transition = "transform 0.5s ease-in-out";
        track.style.transform = `translateX(${-index * itemWidth}px)`;
    };
    const nextBtn = document.querySelector('.next');
    if (nextBtn) {
        nextBtn.onclick = (e) => {
            e.preventDefault();
            index++;
            move();
            if (index >= items.length) {
                setTimeout(() => {
                    track.style.transition = "none";
                    index = 0;
                    track.style.transform = `translateX(0)`;
                }, 500);
            }
        };
    }
}