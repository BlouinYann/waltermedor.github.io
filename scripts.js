/**
 * scripts.js - Walter Medor
 * Version UNIFIÉE : Utilise BASE_PATH pour corriger les erreurs 404 sur GitHub
 */

// 1. DÉFINITION DE LA RACINE DU PROJET
const isGitHub = window.location.hostname.includes('github.io');
// On utilise le nom exact du dépôt pour GitHub, rien pour le local
const BASE_PATH = isGitHub ? '/waltermedor.github.io' : '';

// 2. FONCTION DE CHARGEMENT GÉNÉRIQUE
function loadComponent(id, fileName) {
    const element = document.getElementById(id);
    if (!element) return Promise.resolve();

    // On combine BASE_PATH (racine du dépôt) avec le nom du fichier
    const url = `${BASE_PATH}/${fileName}`;

    return fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`404: ${url}`);
            return response.text();
        })
        .then(data => {
            element.innerHTML = data;
            console.log(`✅ ${id} chargé depuis : ${url}`);
        })
        .catch(error => console.error(`❌ Erreur :`, error));
}

// 3. INITIALISATION
document.addEventListener("DOMContentLoaded", () => {
    
    // Favicon dynamique utilisant la base du projet
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/png';
    favicon.href = `${BASE_PATH}/Images/icon.png`; 
    document.head.appendChild(favicon);

    // Chargement des composants SANS calcul de "prefix" variable
    loadComponent("main-header", "header.html");
    loadComponent("main-footer", "footer.html");

    // Initialisation des lecteurs audio
    initAudioPlayers();
});

// 4. INITIALISATION DU CARROUSEL
window.onload = () => {
    initInfiniteCarousel();
};

// --- Gardez vos fonctions initInfiniteCarousel() et initAudioPlayers() ici ---


// 5. GESTION DU CARROUSEL
function initInfiniteCarousel() {
    const track = document.querySelector('.carousel-slide');
    const items = document.querySelectorAll('.carousel-slide img');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    
    if (!track || items.length === 0) return;

    const gap = 20;
    let index = 0;

    if (track.children.length === items.length) {
        items.forEach(item => {
            const clone = item.cloneNode(true);
            track.appendChild(clone);
        });
    }

    function move() {
        const itemWidth = items[0].clientWidth + gap;
        if (itemWidth <= gap) return; 

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

    if (nextBtn) nextBtn.addEventListener('click', move);
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const itemWidth = items[0].clientWidth + gap;
            if (index <= 0) {
                index = items.length;
                track.style.transition = "none";
                track.style.transform = `translateX(${-index * itemWidth}px)`;
            }
            setTimeout(() => {
                index--;
                track.style.transition = "transform 0.5s ease-in-out";
                track.style.transform = `translateX(${-index * itemWidth}px)`;
            }, 10);
        });
    }

    setInterval(move, 4000);
}

// 6. GESTION DE L'AUDIO
function initAudioPlayers() {
    const players = document.querySelectorAll('.custom-player');

    players.forEach(player => {
        const audio = player.querySelector('audio');
        const btn = player.querySelector('.play-pause-btn');
        const bar = player.querySelector('.progress-bar');
        const container = player.querySelector('.progress-container');

        if (!audio || !btn) return;

        btn.addEventListener('click', () => {
            if (audio.paused) {
                document.querySelectorAll('audio').forEach(a => {
                    a.pause();
                    const otherBtn = a.parentElement.querySelector('.play-pause-btn');
                    if (otherBtn) otherBtn.innerText = "▶";
                });
                audio.play();
                btn.innerText = "II";
            } else {
                audio.pause();
                btn.innerText = "▶";
            }
        });

        audio.addEventListener('timeupdate', () => {
            if (audio.duration && bar) {
                bar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
            }
        });

        if (container) {
            container.addEventListener('click', (e) => {
                audio.currentTime = (e.offsetX / container.clientWidth) * audio.duration;
            });
        }
    });
}

function loadComponent(id, fileName) {
    const element = document.getElementById(id);
    if (!element) return Promise.resolve();

    const url = `${BASE_PATH}/${fileName}`;

    return fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`404: ${url}`);
            return response.text();
        })
        .then(data => {
            element.innerHTML = data;
            
            // --- CORRECTION DYNAMIQUE DES LIENS ---
            if (isGitHub) {
                const links = element.querySelectorAll('a');
                links.forEach(link => {
                    const href = link.getAttribute('href');
                    // Si le lien est relatif et ne commence pas par http ou /
                    if (href && !href.startsWith('http') && !href.startsWith('/')) {
                        // On force le lien à partir du BASE_PATH
                        link.href = `${BASE_PATH}/${href.replace(/\.\.\//g, '')}`;
                    }
                });
                
                const images = element.querySelectorAll('img');
                images.forEach(img => {
                    const src = img.getAttribute('src');
                    if (src && src.startsWith('/')) {
                        img.src = `${BASE_PATH}${src}`;
                    }
                });
            }
            console.log(`✅ ${id} corrigé pour GitHub`);
        })
        .catch(error => console.error(`❌ Erreur :`, error));
}