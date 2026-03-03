/**
 * scripts.js - Walter Medor
 * Version Finale Corrigée pour l'URL waltermedor.github.io
 */

// 1. LE CHEMIN EXACT DE TON REPO GITHUB
const REPO_NAME = "/waltermedor.github.io";

function loadComponent(id, fileName) {
    const element = document.getElementById(id);
    if (!element) return;

    // Construction du chemin : /waltermedor.github.io/header.html
    const url = REPO_NAME + "/" + fileName;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("404 : " + url);
            return response.text();
        })
        .then(data => {
            element.innerHTML = data;
            console.log(`✅ ${id} chargé depuis : ${url}`);
        })
        .catch(error => console.error(`❌ Erreur :`, error));
}

// 2. INITIALISATION
document.addEventListener("DOMContentLoaded", () => {
    // Chargement des composants
    loadComponent("main-header", "header.html");
    loadComponent("main-footer", "footer.html");

    // FIX DU FAVICON
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
    }
    favicon.type = 'image/png';
    // Utilisation du chemin complet avec le bon nom de repo
    favicon.href = REPO_NAME + "/Images/icon.png"; 

    initAudioPlayers();
});

window.onload = () => {
    initInfiniteCarousel();
};

// 3. CARROUSEL
function initInfiniteCarousel() {
    const track = document.querySelector('.carousel-slide');
    const items = document.querySelectorAll('.carousel-slide img');
    if (!track || items.length === 0) return;

    const gap = 20;
    let index = 0;

    if (track.children.length === items.length) {
        items.forEach(item => track.appendChild(item.cloneNode(true)));
    }

    function move() {
        if (!items[0]) return;
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

// 4. AUDIO
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
                document.querySelectorAll('audio').forEach(a => a.pause());
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