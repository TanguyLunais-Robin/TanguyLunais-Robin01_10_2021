export default class PhotographerList{
  constructor(selector, photographers){
    this.selector = selector;
    this.photographers = photographers;
  }

  getRelevantPhotographers(filterTags) {
    if (filterTags === undefined) {
      return this.photographers;
    }
    let filteredPhotographersArray = [];
    filterTags.forEach(filterTag => {
      const filteredPhotographers = this.photographers.filter((photographer) => photographer.tags.includes(filterTag));
      filteredPhotographersArray.push(filteredPhotographers);
    });
    return filteredPhotographersArray;
  }
  
  displayRelevantCards(selectedTags) {
    this.selector.setAttribute('tabindex', '0');
    const relevantPhotographers = this.getRelevantPhotographers(selectedTags);
    
    // nettoyage de l'élément parent
    while (this.selector.firstChild) {
        this.selector.removeChild(this.selector.firstChild);
    }

    // si l'argument n'est pas undefined, seules les cartes correspondantes au(x) tag(s) sélectionnés sont affichées 
    // sinon toutes les cartes sont affichées
    if (!(selectedTags === undefined)) {
      // différents tableaux contenant photographes ayant un tag spécifique sont fusionnés
      let relevantPhotographersArraysJoined = [].concat.apply([], relevantPhotographers);
      // doublons supprimés
      relevantPhotographersArraysJoined = [... new Set(relevantPhotographersArraysJoined)];
      relevantPhotographersArraysJoined.forEach(relevantPhotographer => {
        const card = this.createCard(relevantPhotographer);
        this.selector.appendChild(card);
      });
    } else {
      relevantPhotographers.forEach(relevantPhotographer => {
          const card = this.createCard(relevantPhotographer);
          this.selector.appendChild(card);
      });
    } 

    // ajout de la classe active aux autres tags similaires si besoin
    const tags = Array.from(document.querySelectorAll('.tag'));
    if (!(selectedTags === undefined)) {
      selectedTags.forEach(selectedTag => {
        tags.forEach(tag => {
          if (tag.dataset['tagName'] === selectedTag){
            tag.classList.add('active');
            tag.setAttribute('aria-label', `filtré par ${tag.innerHTML}`);
          }
        });
      });
    }

  }

  createCard(photographer) {
    const { id } = photographer;
    const card = document.createElement('div');
    const cardLink = document.createElement('a');
    const cardFigure = document.createElement('figure');
    const portrait = document.createElement('img');
    const cardFigureCaption = document.createElement('figcaption');
    const cardH2 = document.createElement('h2');
    const cardInfo = document.createElement('div');
    const location = document.createElement('div');
    const tagline = document.createElement('div');
    const price = document.createElement('div');
    const tagbox = document.createElement('div');
  
    card.classList.add('card');
    card.dataset['photographerName'] = photographer.name;

    cardLink.classList.add('card-link');
    portrait.classList.add('portrait');
    cardH2.classList.add('name');
    cardInfo.classList.add('info');
    cardInfo.setAttribute('aria-label', 'info photographe');
    location.classList.add('location');
    tagline.classList.add('tagline');
    price.classList.add('price');
    tagbox.classList.add('tagbox');
  
    cardLink.setAttribute('href', `./photographer-page.html?id=${id}`);
    cardLink.setAttribute('aria-label', `${photographer.name}`);
  
    portrait.setAttribute('alt', `${photographer.name}`);
    portrait.src = `images/Sample_Photos/Photographers_ID_Photos/Resized_images/${photographer.portrait}`;
    cardH2.appendChild(document.createTextNode(photographer.name));
    location.appendChild(document.createTextNode(`${photographer.city}, ${photographer.country}`));
    tagline.appendChild(document.createTextNode(photographer.tagline));
    price.appendChild(document.createTextNode(`${photographer.price}€/jour`));
  
    cardFigureCaption.appendChild(cardH2);
    cardFigure.append(portrait, cardFigureCaption);
    card.appendChild(cardLink);
    cardLink.appendChild(cardFigure);
    card.appendChild(cardInfo);
  
    // tags
    const photographerTags = photographer.tags;
    photographerTags.forEach(photographerTag => {
      this.createTag(tagbox, photographerTag);
    });

    cardInfo.append(location, tagline, price, tagbox);
    
    return card;
  }

  createTag(parentElement, tagName) {
    const tag = document.createElement('div');
    tag.classList.add('tag');
    tag.setAttribute('aria-label', `tag ${tagName}`);
    tag.setAttribute('role', 'button');
    tag.setAttribute('tabindex', '0');
    tag.appendChild(document.createTextNode(`#${tagName}`));
    tag.dataset['tagName'] = tagName;

    parentElement.appendChild(tag);

    // événements sélection tag
    tag.addEventListener('click', () => {
      this.selectTag(tag);
      this.getTagContent();
    });
    tag.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.selectTag(tag);
        this.getTagContent();
      }
    });
    return tag;
  }

  selectTag(selectedTag) {
    // si tag sélectionné n'est pas actif
    // son contenu est retourné
    if (!(selectedTag.classList.contains('active'))) {
      const tagContent = selectedTag.dataset['tagName'];
      selectedTag.setAttribute('aria-label', `photographes filtrés par ${tagContent}`);
      const tags = Array.from(document.querySelectorAll('.tag'));
      tags.forEach(tag => {
        if (tag.dataset['tagName'] === tagContent){
          tag.classList.add('active');
        } 
      });
      return tagContent;
    } else {
      const tagContent = selectedTag.dataset['tagName'];
      selectedTag.classList.remove('active');
      selectedTag.setAttribute('aria-label', `filtre ${tagContent} retiré`);
      const tags = document.querySelectorAll('.tag');
      tags.forEach(tag => {
        if (tag.dataset['tagName'] === tagContent){
          tag.classList.remove('active');
        }
      });
    }
  }

  getTagContent() {
    const activeTags = document.querySelectorAll('.tag.active');
    // tableau contenant les tags est renvoyé
    const activeTagsContent = Array.from(activeTags).map(activeTag => {
      return activeTag.dataset['tagName'];
    });
    // tableau utilisé comme argument pour la fonction qui affiche les cartes
    this.displayRelevantCards(activeTagsContent);
    if (activeTagsContent.length === 0) {
      this.displayRelevantCards(undefined);
    }
  }
}