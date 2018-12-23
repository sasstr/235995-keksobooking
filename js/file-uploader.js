'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var fileChooserAvatar = document.querySelector('#avatar');
  var previewImage = document.querySelector('.ad-form-header__preview img');
  var fileChooserPhoto = document.querySelector('.ad-form__input');
  var previewPhoto = document.querySelector('.ad-form__photo');

  var imageOfAvatarChangeHandler = function () {
    var file = fileChooserAvatar.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    var imageOfAvatarLoadHandler = function () {
      previewImage.src = reader.result;
    };

    if (matches) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', imageOfAvatarLoadHandler);
    }
  };

  var imageUpload = function () {
    fileChooserAvatar.addEventListener('change', imageOfAvatarChangeHandler);
  };

  var photoOfDwellingChangeHandler = function () {
    var file = fileChooserPhoto.files[0];
    var fileName = file.name.toLowerCase();
    var photoMatches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    var photoOfDwellingLoadHandler = function () {
      var photoImage = document.createElement('img');
      photoImage.src = reader.result;
      photoImage.alt = 'Фото жилья';
      photoImage.style = 'max-width: 70px; max-height: 70px; margin-top: 5px; float: left;';
      previewPhoto.appendChild(photoImage);
    };
    if (photoMatches) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', photoOfDwellingLoadHandler);
    }
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
    removePhotoAndImageListener: removePhotoAndImageListener
  };
})();
