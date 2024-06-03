document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger'); // Seleziona il bottone hamburger
    const nav = document.querySelector('nav'); // Seleziona il menu di navigazione
    const links = document.querySelectorAll('nav a[href^="#"]'); // Seleziona tutti i link di navigazione interni
    const lightbox = document.getElementById('lightbox'); // Seleziona il lightbox
    const lightboxImage = document.querySelector('.lightbox-content'); // Seleziona l'immagine del lightbox
    const lightboxClose = document.querySelector('.lightbox-close'); // Seleziona il bottone per chiudere il lightbox
    const lightboxPrev = document.querySelector('.lightbox-prev'); // Seleziona il bottone per l'immagine precedente
    const lightboxNext = document.querySelector('.lightbox-next'); // Seleziona il bottone per l'immagine successiva
    const images = document.querySelectorAll('.gallery-container img'); // Seleziona tutte le immagini della galleria
    const apiKey = 'wNW9BXvENBTT4ZPZdzJlxxBcsq5w4WSA'; // API key per NYT (da nascondere)
    const newsContainer = document.getElementById('news-articles'); // Seleziona il contenitore per le notizie
    let currentIndex = 0; // Indice corrente per la navigazione del lightbox

    function toggleNav() {
        nav.style.display = (nav.style.display === 'block') ? 'none' : 'block'; // Alterna la visibilità del menu di navigazione
    }

    function closeNav() {
        if (nav.style.display === 'block') {
            nav.style.display = 'none'; // Chiude il menu di navigazione se è aperto
        }
    }

    function showLightbox(index) {
        lightbox.style.display = 'block'; // Mostra il lightbox
        lightboxImage.src = images[index].src; // Imposta l'immagine del lightbox
        currentIndex = index; // Aggiorna l'indice corrente
    }

    function closeLightbox() {
        lightbox.style.display = 'none'; // Chiude il lightbox
    }

    function changeImage(step) {
        currentIndex += step; // Cambia l'indice corrente
        if (currentIndex >= images.length) {
            currentIndex = 0; // Torna alla prima immagine se l'indice supera la lunghezza dell'array
        } else if (currentIndex < 0) {
            currentIndex = images.length - 1; // Torna all'ultima immagine se l'indice è negativo
        }
        showLightbox(currentIndex); // Mostra l'immagine aggiornata nel lightbox
    }

    hamburger.addEventListener('click', function(event) {
        toggleNav(); // Alterna la visibilità del menu di navigazione
        event.stopPropagation(); // Ferma la propagazione dell'evento
    });

    document.body.addEventListener('click', closeNav, true); // Chiude il menu di navigazione quando si clicca fuori

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Previene il comportamento predefinito del link
            closeNav(); // Chiude il menu di navigazione
            const targetId = this.getAttribute('href'); // Ottiene l'ID della sezione di destinazione
            const targetSection = document.querySelector(targetId); // Seleziona la sezione di destinazione
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight; // Altezza dell'header
                const targetRect = targetSection.getBoundingClientRect(); // Coordinate della sezione di destinazione
                const topOffset = targetRect.top + window.pageYOffset - headerHeight; // Calcola la posizione di scorrimento
                window.scrollTo({ top: topOffset, behavior: 'smooth' }); // Scorre alla sezione di destinazione
            }
        });
    });

    images.forEach((img, index) => {
        img.addEventListener('click', () => showLightbox(index)); // Mostra il lightbox quando si clicca su un'immagine
    });

    lightboxPrev.addEventListener('click', function(event) {
        changeImage(-1); // Cambia l'immagine precedente
        event.stopPropagation(); // Ferma la propagazione dell'evento
    });

    lightboxNext.addEventListener('click', function(event) {
        changeImage(1); // Cambia l'immagine successiva
        event.stopPropagation(); // Ferma la propagazione dell'evento
    });

    lightbox.addEventListener('click', function(event) {
        if (event.target === lightbox) {
            closeLightbox(); // Chiude il lightbox se si clicca fuori dall'immagine
        }
    });

    lightboxClose.addEventListener('click', function(event) {
        closeLightbox(); // Chiude il lightbox
        event.stopPropagation(); // Ferma la propagazione dell'evento
    });

    function filterGallery(season) {
        const items = document.querySelectorAll('.gallery-container .gallery-item');
        items.forEach(item => {
            // Verifica se l'elemento appartiene alla sezione di moda anziché alla sezione notizie
            if (item.closest('#gallery')) {
                item.style.display = (season === 'all' || item.classList.contains(season)) ? 'block' : 'none';
            }
        });
    }
    

    fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=news_desk:(%22Fashion%22%20%22Style%22)&sort=newest&api-key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            data.response.docs.forEach(article => {
                if (article.multimedia.length > 0) {
                    const articleImg = `https://www.nytimes.com/${article.multimedia[0].url}`;
                    const newsItem = document.createElement('div');
                    newsItem.className = 'gallery-item'; // Usando lo stesso stile della galleria di immagini
                    newsItem.innerHTML = `
                        <img src="${articleImg}" alt="${article.headline.main}">
                        <div class="news-text">
                            <h3>${article.headline.main}</h3>
                            <p>${article.snippet}</p>
                            <a href="${article.web_url}" target="_blank">Leggi di più</a>
                        </div>
                    `;
                    newsContainer.appendChild(newsItem);
                }
            });
        })
        .catch(error => console.error('Errore nel caricamento delle notizie:', error));

    window.filterGallery = filterGallery; // Rende la funzione filterGallery accessibile globalmente
});
