import Swiper from 'swiper/bundle';

export default () => {
    const sliderEl = document.querySelector('.js-feedback-slider')
    if (!sliderEl) return;

    const swiper = new Swiper(sliderEl, {
        speed: 600,
        loop: true,
        spaceBetween: 10,
        slidesPerView: 1,
        navigation: {
            nextEl: '.feedback__arrow-next',
            prevEl: '.feedback__arrow-prev',
        },
        pagination: {
            el: '.feedback__pagination',
            type: 'bullets',
        },
        autoHeight: true,
    });
}