import React from "react"

function PopupWithForm({
  name,
  title,
  buttonText,
  children,
  isOpen,
  onClose,
  onSubmit,
  onCloseOverlay,
}) {
  return (
    <div
      className={`popup popup_type_${name} ${isOpen ? "popup_opened" : ""}`}
      onClick={onCloseOverlay}
    >
      <div className="popup__container">
        <button
          className="popup__close"
          name="close-edit"
          type="button"
          onClick={onClose}
        />
        <form
          className="popup__form"
          id="edit-form"
          name={name}
          onSubmit={onSubmit}
        >
          <h2 className="popup__title">{title}</h2>
          {children}
          <button className="popup__save" type="submit">
            {buttonText || "Сохранить"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PopupWithForm
