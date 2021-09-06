import Swiper from 'swiper/bundle'

export default () => {
  const sliderEl = document.querySelector('.js-drivers-slider')
  if (!sliderEl) return

  const swiper = new Swiper(sliderEl, {
    speed: 600,
    loop: true,
    slidesPerView: 3,
    spaceBetween: 32,
    navigation: {
      nextEl: '.drivers__arrow-next',
      prevEl: '.drivers__arrow-prev',
    },
    pagination: {
        el: '.drivers__pagination',
        type: 'bullets',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 32,
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 32,
      }
    }
  })
}
