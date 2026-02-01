import './PhoneModal.css';
import Evgeniya from '../../images/Evgeniya.png';

export default function PhoneModal({ isOpen, onClose }) {

  return (
    <div className={isOpen ? 'modal-container modal-container_visible' : 'modal-container'}>
      <button type="button" className="modal__close-button" onClick={onClose}>× закрыть</button>
      <div className='modal-container_grid'>
        <div>
          <div className='modal-container_text'>Специалист по камням Евгения — консультация и <b>оформление заказа по телефону!</b> Звоните!</div>
          <div className='modal-container_phone'>8 800 200 17 05</div>
        </div>
        <img src={Evgeniya} />
      </div>
      <div className='modal-container_working_hours'>Пн-Пт: 08:00-17:00, бесплатно по России</div>
    </div>
  )
}