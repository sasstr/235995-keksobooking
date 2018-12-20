'use strict';

(function () {
  var mainHtmlElement = document.querySelector('main');

  // Функция создает дом элмент с сообщением о ошибки
  var createErrorMessage = function (errorText) {
    var template = document.querySelector('#error');
    var errorTemplate = template.content.querySelector('.error').cloneNode(true);
    var errorButton = errorTemplate.querySelector('.error__button');

    // Функция слушатель события клик переводит форму в неактивное состояние
    var errorButtonClickHandler = function () {
      window.map.formResetHandler();
      errorButton.removeEventListener('click', errorButtonClickHandler);
      mainHtmlElement.removeChild(errorTemplate);
    };
      // Функция закрывает popup
    var closeErrorPopup = function () {
      mainHtmlElement.removeChild(errorTemplate);
      document.removeEventListener('keydown', errorButtonKeyEscDownHandler);
      errorButton.removeEventListener('click', errorButtonClickHandler);
    };
    // Функция закрывает сообщение о ошибке по клавише ESC
    var errorButtonKeyEscDownHandler = function (evt) {
      window.map.formResetHandler();
      window.utils(closeErrorPopup, evt);
    };

    errorTemplate.querySelector('.error__message').textContent = errorText;
    mainHtmlElement.appendChild(errorTemplate);
    errorButton.addEventListener('click', errorButtonClickHandler);
    document.addEventListener('keydown', errorButtonKeyEscDownHandler);
  };

  window.error = {
    show: createErrorMessage
  };
})();
