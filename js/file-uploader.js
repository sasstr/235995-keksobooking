'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var fileChooserAvatar = document.querySelector('#avatar');
  var previewImage = document.querySelector('.ad-form-header__preview img');
  var fileChooserPhoto = document.querySelector('.ad-form__input');
  var previewPhoto = document.querySelector('.ad-form__photo');
  var adFormHeader = document.querySelector('.ad-form-header__drop-zone');
  var adForm = document.querySelector('.ad-form__drop-zone');

  var targeElementStopEventHandler = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  };

  var adFormLoadHandler = function (evtLoad) {
    var image = new Image(70, 70);
    image.src = evtLoad.target.result;
    previewPhoto.appendChild(image);
  };

  var adFormDropHandler = function (evt) {
    htmlElmentDropHandler(evt, adFormLoadHandler, targeElementStopEventHandler);
  };

  var htmlElmentDropHandler = function (evt, loadHandler, stopEventHandler) {
    stopEventHandler(evt);
    var file = evt.dataTransfer.files[0];
    var reader = new FileReader();
    reader.addEventListener('load', loadHandler);
    reader.readAsDataURL(file);
  };

  var adFormHeaderLoadHandler = function (evtLoad) {
    previewImage.src = evtLoad.target.result;
  };

  var adFormHeaderDropHandler = function (evt) {
    htmlElmentDropHandler(evt, adFormHeaderLoadHandler, targeElementStopEventHandler);
  };

  adFormHeader.addEventListener('dragenter', targeElementStopEventHandler);
  adForm.addEventListener('dragenter', targeElementStopEventHandler);
  adFormHeader.addEventListener('dragover', targeElementStopEventHandler);
  adForm.addEventListener('dragover', targeElementStopEventHandler);
  adForm.addEventListener('drop', adFormDropHandler);
  adFormHeader.addEventListener('drop', adFormHeaderDropHandler);

  var removeAllPhotosFromScreen = function () {
    var photoListElement = document.querySelectorAll('.ad-form__photo img');

    photoListElement.forEach(function (item) {
      item.remove();
    });
  };

  var fileChangeHandler = function (fileChooser, cb) {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();
    var photoMatches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (photoMatches) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', cb);
    }
  };

  var imageOfAvatarLoadHandler = function (evtLoad) {
    previewImage.src = evtLoad.target.result;
  };

  var imageOfAvatarChangeHandler = function () {
    fileChangeHandler(fileChooserAvatar, imageOfAvatarLoadHandler);
  };

  var imageUpload = function () {
    fileChooserAvatar.addEventListener('change', imageOfAvatarChangeHandler);
  };

  var photoOfDwellingLoadHandler = function (evt) {
    var photoImage = document.createElement('img');
    photoImage.src = evt.target.result;
    photoImage.alt = 'Фото жилья';
    photoImage.style = 'max-width: 70px; max-height: 70px; margin-top: 5px;';
    previewPhoto.appendChild(photoImage);
  };

  var photoOfDwellingChangeHandler = function () {
    fileChangeHandler(fileChooserPhoto, photoOfDwellingLoadHandler);
  };

  var photoUload = function () {
    fileChooserPhoto.addEventListener('change', photoOfDwellingChangeHandler);
  };

  var removePhotoAndImageListener = function () {
    fileChooserPhoto.removeEventListener('change', photoOfDwellingChangeHandler);
    fileChooserAvatar.removeEventListener('change', imageOfAvatarChangeHandler);
  };
  window.fileUploader = {
    photoOfAvatar: photoUload,
    imageOfDwelling: imageUpload,
    removePhotoAndImageListener: removePhotoAndImageListener,
    removeAllPhotosFromScreen: removeAllPhotosFromScreen
  };
})();
