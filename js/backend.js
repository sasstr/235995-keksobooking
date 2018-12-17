'use strict';

(function () {
  var TIMEOUT = 10000;

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
    load: receiveDataFromServer,
    save: sendDataToServer
  };
})();
