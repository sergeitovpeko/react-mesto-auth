import { useContext } from "react"
import CurrentUserContext from "../contexts/CurrentUserContext"

function Card(props) {
  const currentUser = useContext(CurrentUserContext)
  const isLiked = props.card.likes.some((user) => user._id === currentUser._id)
  const likeButtonClassName = `elements__button elements__button_like ${
    isLiked ? "elements__button_like_active" : ""
  }`
  const isOwner = props.card.owner._id === currentUser._id

  function handleLikeClick() {
    props.onCardLike(props.card)
  }

  function handleCardClick() {
    props.onCardClick(props.card)
  }

  function handleDeleteClick() {
    props.onCardDelete(props.card)
    props.onConfirmationPopup(true)
  }

  return (
    <div className="elements__list-item">
      {isOwner && (
        <button
          className="elements__button elements__button_delete"
          onClick={handleDeleteClick}
          type="button"
        />
      )}

      <img
        className="elements__image"
        src={props.card.link}
        alt={props.card.name}
        onClick={handleCardClick}
      />
      <div className="elements__info">
        <h2 className="elements__title">{props.card.name}</h2>
        <div className="elements__like">
          <button
            className={likeButtonClassName}
            onClick={handleLikeClick}
            type="button"
          ></button>

          <p className="elements__likes-quantity">{props.card.likes.length}</p>
        </div>
      </div>
    </div>
  )
}

export default Card
