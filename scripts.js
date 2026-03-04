/**
 * scripts.js - Walter Medor
 * Version Finale : Fix 404 & Menu Mobile Universel
 */

const repoName = 'waltermedor.github.io';
const isGitHub = window.location.hostname.includes('github.io');
const isLocalRepoFolder = window.location.pathname.includes(repoName);

// Détermine la base : /waltermedor.github.io/ ou /
const BASE_PATH = (isGitHub || isLocalRepoFolder) ? `/${repoName}/` : '/';

function loadComponent(id, fileName) {
    const element = document.getElementById(id);
    if (!element) return Promise.resolve();

    const url = (BASE_PATH + fileName).replace(/\/+/g, '/');

    return fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`Erreur ${response.status} sur ${url}`);
            return response.text();
        })
        .then(data => {
            element.innerHTML = data;

            // Une fois le header chargé, on active le bouton burger
            if (id === "main-header") {
                const menuToggle = element.querySelector('.menu-toggle');
                const navMenu = element.querySelector('.nav-menu');

                if (menuToggle && navMenu) {
                    menuToggle.onclick = (e) => {
                        e.preventDefault();
                        navMenu.classList.toggle('active');
                        menuToggle.classList.toggle('is-active');
                    };

                    // Fermeture au clic sur un lien
                    navMenu.querySelectorAll('a').forEach(link => {
                        link.onclick = () => {
                            navMenu.classList.remove('active');
                            menuToggle.classList.remove('is-active');
                        };
                    });
                }
            }
        })
        .catch(error => console.error(`❌ Erreur chargement :`, error));
}

document.addEventListener("DOMContentLoaded", () => {
    // On charge les composants
    loadComponent("main-header", "header.html");
    loadComponent("main-footer", "footer.html");
    
    // ON LANCE L'AUDIO ICI
    initAudioPlayers();
});

// --- Garde tes fonctions initInfiniteCarousel et initAudioPlayers en dessous ---
window.onload = () => { if (typeof initInfiniteCarousel === "function") initInfiniteCarousel(); };

function initInfiniteCarousel() {
    const track = document.querySelector('.carousel-slide');
    const items = document.querySelectorAll('.carousel-slide img');
    if (!track || items.length === 0) return;
    const gap = 20; let index = 0;
    if (track.children.length === items.length) {
        items.forEach(item => track.appendChild(item.cloneNode(true)));
    }
    function move() {
        const itemWidth = items[0].clientWidth + gap;
        index++;
        track.style.transition = "transform 0.5s ease-in-out";
        track.style.transform = `translateX(${-index * itemWidth}px)`;
        if (index >= items.length) {
            setTimeout(() => {
                track.style.transition = "none";
                index = 0;
                track.style.transform = `translateX(0)`;
            }, 500);
        }
    }
    setInterval(move, 4000);
}

function initAudioPlayers() {
    // 1. On récupère tous les boutons de lecture
    const playButtons = document.querySelectorAll('.play-pause-btn');
    
    console.log("Initialisation des lecteurs :", playButtons.length, "boutons trouvés.");

    playButtons.forEach(btn => {
        // On force le clic
        btn.onclick = function(e) {
            e.preventDefault();
            const audioId = this.getAttribute('data-audio');
            const audio = document.getElementById(audioId);
            const bar = document.getElementById('bar-' + audioId);

            if (!audio) {
                console.error("Audio introuvable pour l'ID :", audioId);
                return;
            }

            if (audio.paused) {
                // Arrêter toutes les autres pistes avant de jouer celle-ci
                document.querySelectorAll('audio').forEach(a => {
                    a.pause();
                    a.currentTime = 0; // Optionnel : reset la piste
                });
                document.querySelectorAll('.play-pause-btn').forEach(b => b.innerText = "▶");

                audio.play();
                this.innerText = "II"; // Symbole Pause
            } else {
                audio.pause();
                this.innerText = "▶"; // Symbole Play
            }

            // Gestion de la barre de progression
            audio.ontimeupdate = () => {
                if (bar && audio.duration) {
                    const progress = (audio.currentTime / audio.duration) * 100;
                    bar.style.width = progress + "%";
                }
            };
        };
    });
}
menuToggle.onclick = (e) => {
    e.preventDefault();
    navMenu.classList.toggle('active');
    
    // Bloque le défilement de la page quand le menu est ouvert
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
};