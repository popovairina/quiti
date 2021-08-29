import vhCheck from 'vh-check'
import initHeader from '../blocks/header/header'
import initFeedbackSlider from '../blocks/feedback/feedback'
import initAccordion from '../blocks/faq/faq'
import initDriversSlider from '../blocks/drivers/drivers'

vhCheck()
window.addEventListener('DOMContentLoaded', function () {
  initHeader()
  initFeedbackSlider()
  initAccordion()
  initDriversSlider()
})
