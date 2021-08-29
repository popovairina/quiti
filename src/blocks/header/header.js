export default () => {
    const burger = document.querySelector('.js-burger');
    const nav = document.querySelector('.js-nav');
    const navClose = document.querySelector('.js-nav-close');

    const toggleNav = () => {
        nav.classList.toggle('opened');
        document.body.classList.toggle('js-no-scroll')
    }
    burger.addEventListener('click', toggleNav);
    navClose.addEventListener('click', toggleNav);
}