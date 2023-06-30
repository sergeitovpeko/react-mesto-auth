import React, { useEffect } from "react"
import PopupWithForm from "./PopupWithForm"

function EditAvatarPopup({
  onLoading,
  onClose,
  onUpdateAvatar,
  isOpen,
  onCloseOverlay,
}) {
  const avatarRef = React.useRef(null)

  useEffect(() => {
    avatarRef.current.value = ""
  }, [isOpen])

  function handleSubmit(e) {
    e.preventDefault()
    onUpdateAvatar({
      avatar: avatarRef.current.value,
    })
  }

  function handleChangeAvatar() {
    return avatarRef.current.value
  }

  return (
    <PopupWithForm
      name="popupEditAvatar"
      title="Обновить аватар"
      buttonText={onLoading ? `Сохранение...` : `Сохранить`}
      onSubmit={handleSubmit}
      onClose={onClose}
      isOpen={isOpen}
      onCloseOverlay={onCloseOverlay}
    >
      <div className="popup__form-input">
        <input
          className="popup__form-item popup__form-item_input_avatar"
          type="url"
          name="avatar"
          placeholder="Ссылка на картинку"
          onChange={handleChangeAvatar}
          ref={avatarRef}
          required
        />
        <span className="popup__form-error popup__form-error_active"></span>
      </div>
    </PopupWithForm>
  )
}

export default EditAvatarPopup
