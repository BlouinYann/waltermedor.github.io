// 1. AUTOMATISATION DU CHEMIN (BASE PATH)
const isGitHub = window.location.hostname.includes('github.io');
// On utilise le nom exact du dépôt GitHub
const BASE_PATH = isGitHub ? '/waltermedor.github.io' : '';

// 2. FONCTION DE CHARGEMENT GÉNÉRIQUE
function loadComponent(id, fileName) {
    const element = document.getElementById(id);
    if (!element) return Promise.resolve(); // Évite de bloquer si l'ID n'existe pas

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

// 3. INITIALISATION AU CHARGEMENT DU DOM
const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/png';
favicon.href = '../Images/icon.png'; 
document.head.appendChild(favicon);

document.addEventListener("DOMContentLoaded", () => {
    
    // 2. Calcul dynamique des chemins pour le header/footer
    const path = window.location.pathname;
    const depth = path.split('/').filter(p => p.length > 0 && !p.includes('.html')).length;
    
    let prefix = "";
    if (depth > 0) {
        prefix = "../".repeat(depth);
    }

    // 3. Chargement des composants HTML
    loadComponent("main-header", `${prefix}header.html`);
    loadComponent("main-footer", `${prefix}footer.html`);

    // 4. Initialisation des lecteurs audio
    initAudioPlayers();
});

// 4. INITIALISATION DU CARROUSEL
window.onload = () => {
    initInfiniteCarousel();
};

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