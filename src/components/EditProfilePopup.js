import React, { useState, useEffect } from "react"
import CurrentUserContext from "../contexts/CurrentUserContext"
import PopupWithForm from "./PopupWithForm"

function EditProfilePopup({
  isOpen,
  onUpdateUser,
  onLoading,
  onClose,
  onCloseOverlay,
}) {
  const currentUser = React.useContext(CurrentUserContext)
  const [about, setAbout] = useState("")
  const [name, setName] = useState("")

  useEffect(() => {
    setName(currentUser.name)
    setAbout(currentUser.about)
  }, [currentUser, isOpen])

  function handleSubmit(e) {
    e.preventDefault()
    onUpdateUser({
      name: name,
      about: about,
    })
  }

  function handleChangeName(e) {
    setName(e.target.value)
  }

  function handleChangeAbout(e) {
    setAbout(e.target.value)
  }

  return (
    <PopupWithForm
      name="popupEditProfile"
      title="Редактировать профиль"
      buttonText={onLoading ? `Сохранение...` : `Сохранить`}
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
          placeholder="Имя"
          minLength="2"
          maxLength="40"
          value={name || ""}
          onChange={handleChangeName}
          required
        />
        <span
          className="popup__form-error popup__form-error_active"
          id="error-profile"
        ></span>
      </div>
      <div className="popup__form-input">
        <input
          className="popup__form-item popup__form-item_input_job"
          type="text"
          name="about"
          placeholder="Профессия"
          minLength="2"
          maxLength="200"
          value={about || ""}
          onChange={handleChangeAbout}
          required
        />
        <span className="popup__form-error popup__form-error_active"></span>
      </div>
    </PopupWithForm>
  )
}

export default EditProfilePopup
