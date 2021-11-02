import MediaFactory from './mediaFactory.js';

export default class Lightbox {
    constructor(selector, app) {
        this.selector = selector;
        this.app = app;
    }

    createLightbox() {
        const lightbox = document.createElement('div');
        const lightboxModal = document.createElement('div');
        const lightboxMask = document.createElement('div');
        const lightboxCloseBtn = document.createElement('span');
        const navLeft = document.createElement('i');
        const lightboxContent = document.createElement('div');
        const navRight = document.createElement('i');

        lightbox.classList.add('lightbox');
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-label', 'image agrandie lightbox');
        lightbox.setAttribute('aria-hidden', 'true');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('tabindex', '0');
        
        lightboxModal.classList.add('lightbox-modal');
        lightboxModal.setAttribute('aria-label', 'lightbox');
        lightboxModal.setAttribute('tabindex', '0');

        lightboxMask.classList.add('lightbox-mask');

        lightboxCloseBtn.classList.add('lightbox-close-btn');
        lightboxCloseBtn.setAttribute('tabindex', '0');
        lightboxCloseBtn.setAttribute('aria-label', 'icône croix fermer lightbox');

        navLeft.classList.add('nav-left', 'fas', 'fa-chevron-left');
        navLeft.setAttribute('aria-label', 'flèche vers la gauche image précédente');
        navLeft.setAttribute('role', 'button');
        navLeft.setAttribute('tabindex', '0');

        lightboxContent.classList.add('lightbox-content');
        lightboxContent.setAttribute('tabindex', '0');
        lightboxContent.setAttribute('aria-label', 'naviguer avec flèches du clavier');

        navRight.classList.add('nav-right', 'fas', 'fa-chevron-right');
        navRight.setAttribute('aria-label', 'flèche vers la droite image suivante');
        navLeft.setAttribute('role', 'button');
        navRight.setAttribute('tabindex', '0');

        lightbox.append(lightboxModal, lightboxMask);
        lightboxModal.append(lightboxCloseBtn, navLeft, lightboxContent, navRight);
        this.selector.appendChild(lightbox);

        // événements fermeture lightbox
        lightboxCloseBtn.addEventListener('click', this.closeLightbox.bind(this));
        lightboxCloseBtn.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.closeLightbox();
            }
        });
        window.addEventListener('keydown', (e) => {
            if(e.key === 'Escape') {
                this.closeLightbox();
            }
        });
    }

    generateLightboxMedias(sortedArray) {
        const lightboxContent = document.querySelector('.lightbox-content');
        const lightboxContentMedia = document.createElement('div');
        lightboxContentMedia.classList.add('lightbox-content-media');

        while (lightboxContent.firstChild) {
            lightboxContent.removeChild(lightboxContent.firstChild);
        }

        // pour chaque média, création d'un élément média de la lightbox
        const lightboxMedias = sortedArray.map(this.createLightboxMedia);

        lightboxMedias.forEach(lightboxMedia => lightboxContentMedia.appendChild(lightboxMedia));
        
        // médias positionnés entre les flèches de navigation
        lightboxContent.insertBefore(lightboxContentMedia, lightboxContent.children[2]);

        // événements - navigation
        const navLeft = document.querySelector('.nav-left');
        navLeft.addEventListener('click', () => this.previous(lightboxMedias));
        navLeft.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.previous(lightboxMedias);
                // const currentMedia = document.querySelector('.lightbox-media.active');
                // currentMedia.lastChild.focus();
            }
        });

        const navRight = document.querySelector('.nav-right');
        navRight.addEventListener('click', () => this.next(lightboxMedias));
        navRight.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.next(lightboxMedias);
            }
        });

        // contrôle vidéo
        window.addEventListener('keydown', (e) => {
            if(e.key === ' ') {
                const video = document.querySelector('video.media-content');
                video.play();
            }
        });
    }

    createLightboxMedia(mediaData) {
        const lightboxMedia = MediaFactory.createMedia(mediaData).createLightboxDom();
        lightboxMedia.classList.add('lightbox-media');
        return lightboxMedia;
    }

    openLightbox(mediaId) {
        let previousActiveElement = document.activeElement;
        const lightbox = document.querySelector('.lightbox');
        const lightboxMask = document.querySelector('.lightbox-mask');
        const header = document.querySelector('header');
        lightbox.style.display = 'block';
        lightbox.setAttribute('aria-hidden', 'false');
        this.app.style.display = 'none';
        header.style.display = 'none';

        const lightboxMedias = document.querySelectorAll('.lightbox-media');
        // affichage du média lightbox qui correspond à la miniature sélectionnée dans la galerie
        lightboxMedias.forEach(lightboxMedia => {
            if(mediaId.toString() === lightboxMedia.dataset['mediaId']){
            lightboxMedia.classList.add('active');
            }
        });

        // accessibilité - navigation via window
        window.addEventListener('keydown', (e) => {
            if(e.key === 'Escape') {
              this.closeLightbox();
              previousActiveElement.focus();
            } else if (e.key === 'ArrowLeft') {
                this.previous(lightboxMedias);
            } else if (e.key === 'ArrowRight') {
                this.next(lightboxMedias);
            }
        });

        // événements - fermeture lightbox au clic
        lightboxMask.addEventListener('click', () => {
            this.closeLightbox();
            previousActiveElement.focus();
        });
    }

    closeLightbox() {
        const lightbox = document.querySelector('.lightbox');
        const header = document.querySelector('header');

        lightbox.style.display = "none";
        lightbox.setAttribute('aria-hidden', 'true');
        this.app.style.display = 'block';
        header.style.display = 'block';

        const lightboxMedias = document.querySelectorAll('.lightbox-media');
        lightboxMedias.forEach(lightboxMedia => {
            if(lightboxMedia.classList.contains('active')){
            lightboxMedia.classList.remove('active');
            }
        });
    }

    next(mediaArray) {
        const video = document.querySelector('video.media-content');
        const navRight = document.querySelector('.nav-right');
        const navLeft = document.querySelector('.nav-left');

        for(let i = 0; i < mediaArray.length-1; i++) {
            if(mediaArray[i].classList.contains('active')) {
                video.pause();
                mediaArray[i].classList.remove('active');
                const nextMedia = (i+=1);
                mediaArray[nextMedia].classList.add('active');

                // feedback média devenu actif
                const lastMediaChild = mediaArray[nextMedia].lastChild;
                const lastMediaChildContent = lastMediaChild.innerHTML;
                navRight.setAttribute('aria-label', `${lastMediaChildContent} flèche vers la droite image suivante`);

                // si dernier média actif, flèche droite disparaît et focus sur le titre du média devenu actif
                const currentMediaParent = mediaArray[nextMedia].parentElement;
                if(currentMediaParent.lastChild === mediaArray[nextMedia]) {
                    lastMediaChild.focus();
                    navRight.style.visibility = 'hidden';
                } else {
                    navRight.style.visibility = 'visible';
                }
            }
        }

        if(navLeft.style.visibility === 'hidden') {
            navLeft.style.visibility = 'visible';
        }
    }

    previous(mediaArray) {
        const video = document.querySelector('video.media-content');
        const navLeft = document.querySelector('.nav-left');
        const navRight = document.querySelector('.nav-right');

        for(let i = 1; i < mediaArray.length; i++) {
            if(mediaArray[i].classList.contains('active')) {
                video.pause();
                mediaArray[i].classList.remove('active');
                const previousMedia = (i-=1);
                mediaArray[previousMedia].classList.add('active');

                // feedback média devenu actif
                const lastMediaChild = mediaArray[previousMedia].lastChild;
                const lastMediaChildContent = lastMediaChild.innerHTML;
                navLeft.setAttribute('aria-label', ` ${lastMediaChildContent} flèche vers la gauche image précédente `);

                // si premier média actif, flèche gauche disparaît et focus sur le titre du média devenu actif
                const currentMediaParent = mediaArray[previousMedia].parentElement;
                if(currentMediaParent.firstChild === mediaArray[previousMedia]) {
                    lastMediaChild.focus();
                    navLeft.style.visibility = 'hidden';
                }  else {
                    navLeft.style.visibility = 'visible';
                }
            }
        }

        if(navRight.style.visibility === 'hidden') {
            navRight.style.visibility = 'visible';
        }
    }
}