import vhCheck from 'vh-check'
import initFeedbackSlider from '../blocks/feedback/feedback'
import initAccordion from '../blocks/faq/faq'
import initDriversSlider from '../blocks/drivers/drivers'

vhCheck()
window.addEventListener('DOMContentLoaded', function () {
  initFeedbackSlider()
  initAccordion()
  initDriversSlider()
})
