import React, { useState, useEffect } from "react"
import Header from "../components/Header"
import Main from "../components/Main"
import Footer from "../components/Footer"
import EditProfilePopup from "./EditProfilePopup"
import EditAvatarPopup from "./EditAvatarPopup"
import AddPlacePopup from "./AddPlacePopup"
import PopupConfirmation from "../components/PopupConfirmation"
import ImagePopup from "../components/ImagePopup"
import CurrentUserContext from "../contexts/CurrentUserContext"
import api from "../utils/Api"
import { Route, Switch, Redirect, useHistory } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import Register from "./Register"
import Login from "./Login"
import * as auth from "../utils/auth"
import InfoToolTip from "./InfoToolTip"

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false)
  const [deletedCard, setDeletedCard] = useState({})
  const [selectedCard, setSelectedCard] = useState({})
  const [currentUser, setCurrentUser] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [cards, setCards] = useState([])

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState("")
  const history = useHistory()
  const [isInfoToolTipPopupOpen, setInfoToolTipPopupOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  //ПРОВЕРКА ТОКЕНА
  useEffect(() => {
    const jwt = localStorage.getItem("jwt")
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((res) => {
          setIsLoggedIn(true)
          setEmail(res.data.email)
          history.push("/")
        })
        .catch((err) => {
          if (err.status === 401) {
            console.log("401 — Токен не передан или передан не в том формате")
          }
          console.log("401 — Переданный токен некорректен")
        })
    }
  }, [history])

  //ОТРИСОВКА ДАННЫХ ПОЛЬЗОВАТЕЛЯ И КАРТОЧЕК
  useEffect(() => {
    if (isLoggedIn) {
      api
        .getUserInfo()
        .then((profileInfo) => setCurrentUser(profileInfo))
        .catch((error) => console.log(`Ошибка: ${error}`))

      api
        .getInitialCards()
        .then((data) => {
          setCards(
            data.map((card) => ({
              _id: card._id,
              name: card.name,
              link: card.link,
              likes: card.likes,
              owner: card.owner,
            }))
          )
        })
        .catch((error) => console.log(`Ошибка: ${error}`))
    }
  }, [isLoggedIn])

  //ФУНКЦИЯ ЗАКРЫТИЯ ПО ОВЕРЛЕЙ
  function closeByOverlay(evt) {
    if (evt.target === evt.currentTarget) {
      closeAllPopups()
    }
  }

  // ПЕРЕМЕННОЙ ПРИСВАИВАЕМ ОДИН ИЗ ПОПАПОВ, ДЛЯ ДАЛЬНЕЙШЕЙ ПРОВЕРКИ СОСТОЯНИЯ В useEffect
  const isOpen =
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    isConfirmationPopupOpen ||
    selectedCard.link

  //ПРОВЕРКА ОТКРЫТ ЛИ ОДИН ИЗ ПОПАПОВ ДЛЯ СОЗДАНИЯ И УДАЛЕНИЯ ОБРАБОТЧИКА ESC
  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === "Escape") {
        closeAllPopups()
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", closeByEscape)
      return () => {
        document.removeEventListener("keydown", closeByEscape)
      }
    }
  }, [isOpen])

  //ФУНКЦИЯ ЗАКРЫТИЯ ПОПАПОВ ЕСЛИ НАХОДЯТЬСЯ В TRUE
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setIsConfirmationPopupOpen(false)
    setDeletedCard({})
    setSelectedCard({})
    setInfoToolTipPopupOpen(false)
  }

  //РЕДАКТИРОВАНИЕ АВАТАРА ЗАПРОС АПИ
  function handleEditAvatar(newAvatar) {
    setIsLoading(true)
    api
      .editUserPhoto(newAvatar)
      .then((data) => {
        setCurrentUser(data)
        closeAllPopups()
      })
      .catch((error) => console.log(`Ошибка: ${error}`))
      .finally(() => setIsLoading(false))
  }

  //РЕДАКТИРОВАНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ ЗАПРОС АПИ
  function handleEditUserInfo(newUserInfo) {
    setIsLoading(true)
    api
      .editUserInfo(newUserInfo)
      .then((data) => {
        setCurrentUser(data)
        closeAllPopups()
      })
      .catch((error) => console.log(`Ошибка: ${error}`))
      .finally(() => setIsLoading(false))
  }

  //ДОБАВЛЕНИЕ НОВОЙ КАРТОЧКИ ПО ЗАПРОСУ АПИ
  function handleAddPlaceCard(data) {
    setIsLoading(true)
    api
      .addNewCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards])
        console.log(cards)
        closeAllPopups()
      })
      .catch((error) => console.log(`Ошибка: ${error}`))
      .finally(() => setIsLoading(false))
  }

  //ПОСТАНОВКА ЛАЙКА И ДИЗЛАЙК В ОДНОЙ ФУНКЦИИ ПО ЗАПРОСУ АПИ
  function handleCardLike(card) {
    const isLiked = card.likes.some((user) => user._id === currentUser._id)

    if (isLiked) {
      api
        .dislikeCard(card._id)
        .then((newCard) =>
          setCards((state) =>
            state.map((item) => (item._id === card._id ? newCard : item))
          )
        )
        .catch((error) => console.log(`Ошибка: ${error}`))
    } else {
      api
        .likeCard(card._id)
        .then((newCard) =>
          setCards((state) =>
            state.map((item) => (item._id === card._id ? newCard : item))
          )
        )
        .catch((error) => console.log(`Ошибка: ${error}`))
    }
  }

  //ФУНКЦИЯ УДАЛЕНИЯ КАРТОЧКИ ПО ЗАПРОСУ АПИ
  function handleDeleteCard(card) {
    setIsLoading(true)
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((item) => item._id !== card._id))
        closeAllPopups()
      })

      .catch((error) => console.log(`Ошибка: ${error}`))
      .finally(() => setIsLoading(false))
  }

  //ФУНКЦИЯ РЕГИСТРАЦИИ ПОЛЬЗОВАТЕЛЯ И ОТКРЫТИЕ ПОПАПА В
  // ЗАВИСИМОСТИ УСПЕШНО ЗАРЕНИСТРИРОВАН ИЛИ ПОПАПА С ОШИБКОЙ
  function handleRegisterUser(email, password) {
    auth
      .registerUser(email, password)
      .then((res) => {
        setInfoToolTipPopupOpen(true)
        setIsSuccess(true)
        history.push("/sign-in")
      })
      .catch((err) => {
        if (err.status === 400) {
          console.log("400 - некорректно заполнено одно из полей")
        }
        setInfoToolTipPopupOpen(true)
        setIsSuccess(false)
      })
  }

  //ФУНКЦИЯ ВВОДА ЛОГИНА ДЛЯ ВХОДА ПОЛЬЗОВАТЕЛЯ
  function handleLoginUser(email, password) {
    auth
      .loginUser(email, password)
      .then((res) => {
        localStorage.setItem("jwt", res.token)
        setIsLoggedIn(true)
        setEmail(email)
        history.push("/")
      })
      .catch((err) => {
        if (err.status === 400) {
          console.log("400 - не передано одно из полей")
        } else if (err.status === 401) {
          console.log("401 - пользователь с email не найден")
        }
        setInfoToolTipPopupOpen(true)
        setIsSuccess(false)
      })
  }

  //ФУНКЦИЯ ВЫХОДА ИЗ ПРИЛОЖЕНИЯ И УДАЛЕНИЕ ТОКЕНА ИЗ ЛОКАЛЬНОГО ХРАНИЛИЩА
  function handleSignOut() {
    localStorage.removeItem("jwt")
    setIsLoggedIn(false)
    setIsMobileMenuOpen(false)
    history.push("/sign-in")
    setIsMobileMenuOpen(false)
  }

  //ФУНКЦИЯ ОТКРЫТИЯ МОБИЛЬНОГО МЕНЮ ЕСЛИ ПОЛЬЗОВАТЕЛЬ АВТОРИЗОВАН
  function handleClickOpenMobileMenu() {
    if (isLoggedIn) {
      setIsMobileMenuOpen(!isMobileMenuOpen)
    }
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="body">
        <div className="page">
          <Header
            email={email}
            onSignOut={handleSignOut}
            isMobileMenuOpen={isMobileMenuOpen}
            handleClickOpenMobileMenu={handleClickOpenMobileMenu}
            isLoggedIn={isLoggedIn}
          />

          <Switch>
            <ProtectedRoute
              exact
              path="/"
              isLoggedIn={isLoggedIn}
              onEditAvatar={setIsEditAvatarPopupOpen}
              onEditProfile={setIsEditProfilePopupOpen}
              onConfirmationPopup={setIsConfirmationPopupOpen}
              onAddPlace={setIsAddPlacePopupOpen}
              onCardClick={setSelectedCard}
              onCardLike={handleCardLike}
              onDeletedCard={setDeletedCard}
              cards={cards}
              component={Main}
              isLoading={isLoading}
            />
            <Route path="/sign-in">
              <Login onLogin={handleLoginUser} />
            </Route>
            <Route path="/sign-up">
              <Register onRegister={handleRegisterUser} />
            </Route>
            <Route>
              {isLoggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
            </Route>
          </Switch>

          {isLoggedIn && <Footer />}
          <AddPlacePopup
            onAddPlace={handleAddPlaceCard}
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onLoading={isLoading}
            onCloseOverlay={closeByOverlay}
          />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onUpdateUser={handleEditUserInfo}
            onClose={closeAllPopups}
            onLoading={isLoading}
            onCloseOverlay={closeByOverlay}
          />
          <EditAvatarPopup
            onUpdateAvatar={handleEditAvatar}
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onLoading={isLoading}
            onCloseOverlay={closeByOverlay}
          />
          <PopupConfirmation
            onClose={closeAllPopups}
            isOpen={isConfirmationPopupOpen}
            onCardDelete={handleDeleteCard}
            onLoading={isLoading}
            card={deletedCard}
            onCloseOverlay={closeByOverlay}
          />

          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
            onCloseOverlay={closeByOverlay}
          />

          <InfoToolTip
            isOpen={isInfoToolTipPopupOpen}
            onClose={closeAllPopups}
            isSuccess={isSuccess}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  )
}

export default App
