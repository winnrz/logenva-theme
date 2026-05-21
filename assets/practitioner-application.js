(function () {
  'use strict';

  const uploader = document.querySelector('[data-uploader]');
  if (!uploader) return;

  const fileInput = document.querySelector('[data-uploader-input]');
  const trigger = document.querySelector('[data-uploader-trigger]');
  const filenameDisplay = document.querySelector('[data-uploader-filename]');

  if (trigger && fileInput) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      fileInput.click();
    });
  }

  if (fileInput && filenameDisplay) {
    fileInput.addEventListener('change', function () {
      if (fileInput.files && fileInput.files.length) {
        filenameDisplay.textContent = fileInput.files[0].name;
        filenameDisplay.classList.remove('is-hidden');
      }
    });
  }

  uploader.addEventListener('dragover', function (e) {
    e.preventDefault();
    uploader.classList.add('is-dragover');
  });
  uploader.addEventListener('dragleave', function () {
    uploader.classList.remove('is-dragover');
  });
  uploader.addEventListener('drop', function (e) {
    e.preventDefault();
    uploader.classList.remove('is-dragover');
    if (e.dataTransfer.files && e.dataTransfer.files.length && fileInput) {
      const dt = new DataTransfer();
      dt.items.add(e.dataTransfer.files[0]);
      fileInput.files = dt.files;
      fileInput.dispatchEvent(new Event('change'));
    }
  });
})();
