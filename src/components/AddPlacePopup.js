import PopupWithForm from "./PopupWithForm"
import React, { useState, useEffect } from "react"

function AddPlacePopup({
  isOpen,
  onAddPlace,
  onLoading,
  onClose,
  onCloseOverlay,
}) {
  const [placeName, setPlaceName] = useState("")
  const [placeLink, setPlaceLink] = useState("")

  useEffect(() => {
    setPlaceName("")
    setPlaceLink("")
  }, [isOpen])

  function handleSubmit(event) {
    event.preventDefault()
    onAddPlace({
      name: placeName,
      link: placeLink,
    })
  }

  function handleChangePlaceName(event) {
    setPlaceName(event.target.value)
  }

  function handleChangePlaceLink(event) {
    setPlaceLink(event.target.value)
  }

  return (
    <PopupWithForm
      name="popupNewPlace"
      title="Новое место"
      buttonText={onLoading ? `Сохранение` : `Создать`}
      onSubmit={handleSubmit}
      onClose={onClose}
      isOpen={isOpen}
      onCloseOverlay={onCloseOverlay}
    >
      <div className="popup__form-input">
        <input
          className="popup__form-item popup__form-item_input_name"
          type="text"
          name="name"
          placeholder="Название"
          minLength="2"
          maxLength="30"
          value={placeName}
          onChange={handleChangePlaceName}
          required
        />
        <span
          className="popup__form-error popup__form-error_active"
          id="error-place"
        ></span>
      </div>
      <div className="popup__form-input">
        <input
          className="popup__form-item popup__form-item_input_job"
          type="url"
          name="link"
          placeholder="Ссылка на картинку"
          value={placeLink}
          onChange={handleChangePlaceLink}
          required
        />
        <span className="popup__form-error popup__form-error_active"></span>
      </div>
    </PopupWithForm>
  )
}

export default AddPlacePopup
