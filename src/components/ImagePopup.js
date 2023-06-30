import React from "react"

function ImagePopup({ card, onClose, onCloseOverlay }) {
  return (
    <div
      className={`popup popup_type_image ${card.link ? "popup_opened" : ""}`}
      onClick={onCloseOverlay}
    >
      <div className="popup__container popup__container_image">
        <img className="popup__image" src={card.link} alt={card.name} />
        <div className="popup__image-name">{card.name}</div>
        <button
          className="popup__close"
          type="button"
          onClick={onClose}
        ></button>
      </div>
    </div>
  )
}

export default ImagePopup
