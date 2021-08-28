import Swiper from 'swiper/bundle'

export default () => {
  const sliderEl = document.querySelector('.js-drivers-slider')
  if (!sliderEl) return

  const swiper = new Swiper(sliderEl, {
    speed: 600,
    loop: true,
    spaceBetween: 32,
    slidesPerView: 3,
    navigation: {
      nextEl: '.drivers__arrow-next',
      prevEl: '.drivers__arrow-prev',
    },
  })
}
