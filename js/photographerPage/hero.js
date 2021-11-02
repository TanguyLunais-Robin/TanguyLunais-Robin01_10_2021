export default class Hero{
    constructor(photographer, selector, form, listMedia, gallery){
        this.photographer = photographer;
        this.selector = selector;
        this.form = form;
        this.listMedia = listMedia;
        this.gallery = gallery;
    }

    createDomHero() {
        const hero = document.createElement('div');
        const heroInfo = document.createElement('div');
        const heroButton = document.createElement('div');
        const heroImage = document.createElement('div');
        const heroFigure = document.createElement('figure');
        const portrait = document.createElement('img');
        const name = document.createElement('h1');
        const location = document.createElement('div');
        const tagline = document.createElement('div');
        const tagbox = document.createElement('div');
        const contactButton = document.createElement('input');
  
        hero.classList.add('hero');
        hero.setAttribute('role', 'region');
        hero.setAttribute('tabindex', '1');
        hero.setAttribute('aria-label', `info photographe ${this.photographer.name}`);
        heroInfo.classList.add('info');
        heroButton.classList.add('hero-button');
        heroImage.classList.add('hero-image');
        portrait.classList.add('portrait');
        portrait.setAttribute('alt', `portrait ${this.photographer.name}`);
        name.classList.add('name');
        location.classList.add('location');
        tagline.classList.add('tagline');
        tagbox.classList.add('tagbox');
        tagbox.setAttribute('role', 'navigation');
        contactButton.classList.add('btn-contact');
        contactButton.type = 'button';
        contactButton.value = 'Contactez-moi';

        portrait.src = `images/Sample_Photos/Photographers_ID_Photos/Resized_images/${this.photographer.portrait}`;
        name.appendChild(document.createTextNode(this.photographer.name));
        location.appendChild(document.createTextNode(`${this.photographer.city}, ${this.photographer.country}`));
        tagline.appendChild(document.createTextNode(this.photographer.tagline));

        const photographerTags = this.photographer.tags;
        photographerTags.forEach((photographerTag) => {
            const tag = document.createElement('div');
            tag.classList.add('tag');
            tag.setAttribute('aria-label', `tag ${photographerTag}`);
            tag.setAttribute('role', 'button');
            tag.appendChild(document.createTextNode(`#${photographerTag}`));
            tag.setAttribute('tabindex', '0');
            tag.dataset['tagName'] = photographerTag;

            tagbox.appendChild(tag);

            tag.addEventListener('click', () => {
                this.selectHeroTag(tag);           
            });

            tag.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.selectHeroTag(tag);          
                }
            });

            return tag;
        });

        heroInfo.append(name, location, tagline, tagbox);
        heroButton.appendChild(contactButton);
        heroFigure.appendChild(portrait);
        heroImage.appendChild(heroFigure);
        hero.append(heroInfo, heroButton, heroImage);
        this.selector.appendChild(hero);

        // ouverture formulaire
        contactButton.addEventListener('click', () => {
            let previousActiveElement;
            this.form.launchForm(previousActiveElement);
        });
        
        return contactButton;
    }
    
    selectHeroTag(tag) {
        if (!(tag.classList.contains('active'))) {
            const heroTags = document.querySelectorAll('.tag');
            const heroTagContent = tag.dataset['tagName'];
            heroTags.forEach((otherHeroTags) => otherHeroTags.classList.remove('active'));
            tag.classList.add('active');
            tag.setAttribute('aria-label', `médias filtrés par ${heroTagContent}`);
            const relevantMedias = this.getRelevantMedias(heroTagContent);
            return this.gallery.displayMediaGallery(relevantMedias);
        } else {
            const heroTagContent = tag.dataset['tagName'];
            tag.classList.remove('active');
            tag.setAttribute('aria-label', `filtre ${heroTagContent} retiré`);
            const relevantMedias = this.getRelevantMedias();
            return this.gallery.displayMediaGallery(relevantMedias);
        } 
    }

    getRelevantMedias(filterTag) {
        if (filterTag === undefined) {
          return this.listMedia;
        }
        const filteredMedias = this.listMedia.filter((media) => {
            return media.tags.includes(filterTag);
        });
        return filteredMedias;
    }
}