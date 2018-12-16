'use strict';

(function () {
  var TIMEOUT = 1000; // @fixme вернуть 10000

  // Пречисление кодов статусас сервера
  var ServerStatusCode = {
    'SUCCESS': 200,
    'BAD_REQUEST': 400,
    'UNAUTHORIZED': 401,
    'NOT_FOUND': 404,
    'REQUEST_TIMEOUT': 408,
    'INTERNAL_SERVER_ERROR': 500,
    'GATEWAY_TIMEOUT': 504
  };

  // Функция получения информайции с сервера
  var createXmlHttpRequest = function (loadHandler, errorHandler) {

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;
    // Функция слушатель что вернет сервер ошибку или успешную загрузку
    var xhrLoadHandler = function () {
      if (xhr.status === ServerStatusCode.SUCCESS) {
        loadHandler(xhr.response);
      } else {
        xhr.addEventListener('error', function () {
          var errorText;
          switch (xhr.status) {
            case ServerStatusCode.BAD_REQUEST:
              errorText = 'Неверный запрос';
              break;
            case ServerStatusCode.UNAUTHORIZED:
              errorText = 'Пользователь не авторизован';
              break;
            case ServerStatusCode.NOT_FOUND:
              errorText = 'Ничего не найдено';
              break;
            case ServerStatusCode.REQUEST_TIMEOUT:
              errorText = 'Сервер хотел бы закрыть это неиспользуемое соединение';
              break;
            case ServerStatusCode.INTERNAL_SERVER_ERROR:
              errorText = 'Внутренняя ошибка сервера';
              break;
            case ServerStatusCode.GATEWAY_TIMEOUT:
              errorText = 'Сервер действует как шлюз и не может получить ответ вовремя.';
              break;
            default:
              errorText = 'Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText;
          }
          errorHandler(errorText);
        });
      }
    };
    xhr.addEventListener('load', xhrLoadHandler);
    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    return xhr;
  };
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
      window.utils.invokeCallbackByKeydownEsc(closeErrorPopup, evt);
    };

    errorTemplate.querySelector('.error__message').textContent = errorText;
    mainHtmlElement.appendChild(errorTemplate);
    errorButton.addEventListener('click', errorButtonClickHandler);
    document.addEventListener('keydown', errorButtonKeyEscDownHandler);
  };
  var successMessageTamplate = document.querySelector('#success');
  var successMessage = successMessageTamplate.content.querySelector('.success').cloneNode(true);

  // Функция удаляет дом элемент с сообщением о успешной загрузке
  var mainHtmlElementRemove = function () {
    var successMessageDivElement = document.querySelector('.success');
    mainHtmlElement.removeChild(successMessageDivElement);
  };
  // Функция слушатель клика по сообщению о успешной загрзке
  var successMessageClickHandler = function () {
    mainHtmlElementRemove();
  };
  // Функция слушатель нажатия на  Esc по сообщению о успешной загрзке
  var successMessageEscKeydownHandler = function (evtKey) {
    document.addEventListener('keydown', mainHtmlElementRemove);
    window.utils.invokeCallbackByKeydownEsc(mainHtmlElementRemove, evtKey);
  };
  document.addEventListener('click', successMessageEscKeydownHandler);
  /* var createSuccessMessage = function () {

  }; */

  //  Функция слушатель события submit в случае удачного соединения выводит сообщение SUCCESS
  var submitLoadHandler = function () {
    window.map.formResetHandler();
    document.addEventListener('click', successMessageClickHandler);
    document.addEventListener('click', successMessageEscKeydownHandler);
    mainHtmlElement.appendChild(successMessage);
  };

  // Функция получения информайции с сервера
  var receiveDataFromServer = function (loadHandler, errorHandler, urlDownloadData) {
    var xhr = createXmlHttpRequest(loadHandler, errorHandler, urlDownloadData);
    xhr.open('GET', urlDownloadData);
    xhr.send();
  };
  // Функция отправки информайции на сервер
  var sendDataToServer = function (data, loadHandler, errorHandler, urlSendData) {
    var xhr = createXmlHttpRequest(loadHandler, errorHandler, urlSendData);
    xhr.open('POST', urlSendData);
    xhr.send(data);
  };

  window.backend = {
    receiveDataFromServer: receiveDataFromServer,
    sendDataToServer: sendDataToServer,
    createErrorMessage: createErrorMessage,
    submitLoadHandler: submitLoadHandler
  };
})();
