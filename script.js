document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    const links = document.querySelectorAll('nav a[href^="#"]');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-content');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const images = document.querySelectorAll('.gallery-container img');
    const apiKey = 'wNW9BXvENBTT4ZPZdzJlxxBcsq5w4WSA';
    const newsContainer = document.getElementById('news-articles');
    let currentIndex = 0;

    function toggleNav() {
        nav.style.display = (nav.style.display === 'block') ? 'none' : 'block';
    }

    function closeNav() {
        if (nav.style.display === 'block') {
            nav.style.display = 'none';
        }
    }

    function showLightbox(index) {
        lightbox.style.display = 'block';
        lightboxImage.src = images[index].src;
        currentIndex = index;
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
    }

    function changeImage(step) {
        currentIndex += step;
        if (currentIndex >= images.length) {
            currentIndex = 0;
        } else if (currentIndex < 0) {
            currentIndex = images.length - 1;
        }
        showLightbox(currentIndex);
    }

    hamburger.addEventListener('click', function(event) {
        toggleNav();
        event.stopPropagation();
    });

    document.body.addEventListener('click', closeNav, true);

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            closeNav();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetRect = targetSection.getBoundingClientRect();
                const topOffset = targetRect.top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: topOffset, behavior: 'smooth' });
            }
        });
    });

    images.forEach((img, index) => {
        img.addEventListener('click', () => showLightbox(index));
    });

    lightboxPrev.addEventListener('click', function(event) {
        changeImage(-1);
        event.stopPropagation();
    });

    lightboxNext.addEventListener('click', function(event) {
        changeImage(1);
        event.stopPropagation();
    });

    lightbox.addEventListener('click', function(event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    lightboxClose.addEventListener('click', function(event) {
        closeLightbox();
        event.stopPropagation();
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

    window.filterGallery = filterGallery;
});
