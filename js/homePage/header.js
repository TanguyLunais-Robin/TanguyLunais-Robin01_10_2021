export default class Header{
    constructor(selector, photographerList){
        this.selector = selector;
        this.photographerList = photographerList;
    }

    createHeader(){        
        const headerElements = document.createElement('div');
        headerElements.classList.add('header-elements');

        const logoLink = document.createElement('a');
        logoLink.setAttribute('href', 'index.html');
        logoLink.setAttribute('aria-current', 'page');
        logoLink.classList.add('logo');
        
        const logoImg = document.createElement('img');
        logoImg.setAttribute('src', 'images/Logo/logo.png');
        logoImg.setAttribute('alt', 'FishEye Home Page');

        const goToMain = document.createElement('a');
        goToMain.setAttribute('href', '#section-homepage');
        goToMain.classList.add('go_to_main');
        goToMain.setAttribute('tabindex', '2');
        goToMain.appendChild(document.createTextNode('Passer au contenu'));
        goToMain.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.querySelector('.sectionHomepage').focus();
            }
        });

        const navbar = this.createNavbar();

        logoLink.appendChild(logoImg);
        headerElements.append(logoLink, goToMain, navbar);
        this.selector.appendChild(headerElements);
    }

    createNavbar() {
        const navbar = document.createElement('nav');
        navbar.setAttribute('role', 'nav');
        navbar.setAttribute('tabindex', '3');
        navbar.setAttribute('aria-label', 'navigation principale');
        const tagsName = ['portrait', 'art', 'fashion', 'architecture', 'travel', 'sport', 'animals', 'events'];

        tagsName.forEach(tagName => {
            const tag = this.photographerList.createTag(navbar, tagName);
            tag.classList.add('navigation-item');
            tag.setAttribute('tabindex', '0');
            return tag;
        });
        return navbar;
    }
}