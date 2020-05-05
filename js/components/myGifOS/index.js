const viewMyGifos = { nameView: 'myGifos', searchView: '?view=list' };
const viewCreateGifos = { nameView: 'createGifos', searchView: '?view=create' };

const idVideoRecord = document.getElementById('video-record');
const idImgPreview = document.getElementById('img-preview');
const idInputChronometer = document.getElementById('input-chronometer');

const request = new Request();
const recording = new Recording(idVideoRecord, idImgPreview);
const chronometer = new Chronometer(idInputChronometer);
const progressBar = new ProgressBar();

const clipboard = new Clipboard();

var myGifosFromLocalStorage;

const idSpanTitleCreateGifos = document.getElementById('span-title-create-gifos');
const idSectionCreateGifos = document.getElementById('section-create-gifos');

const idDivContentCheckBeforeStart = document.getElementById('div-content-check-before-start');
const idDivContentUploadingGif = document.getElementById('div-content-uploading-gif');

const idBtnCaptureGif = document.getElementById('btn-capture-gif');
const idBtnReadyGif = document.getElementById('btn-ready');
const idBtnPlayPreviewGif = document.getElementById('btn-play-preview-gif');
const idBtnRepeatCapture = document.getElementById('btn-repeat-capture');
const idBtnUploadGif = document.getElementById('btn-upload-gif');

const idACloseCreateGif = document.getElementById('a-close-create-gif');

/**
 * Shows view depending the url.
 * Views are: Show my guifos and create guifos
 */
const showView = () => {
  const { search } = window.location;
  if (search === viewMyGifos?.searchView) {
    // View my gifos
    idSectionCreateGifos.style.display = 'none';
  } else {
    // View create gifos
    idSectionCreateGifos.style.display = 'block';
    const idDivHeaderButtons = document.getElementById('div-header-buttons');
    idDivHeaderButtons.style.display = 'none';
    const idImgArrowBack = document.getElementById('img-arrow-back');
    idImgArrowBack.classList.toggle('hide');
  }
};

/**
 * Get my gifos id from local storage and
 * search them in giphy endpoint search gif by id
 */
const getMyGifOS = async () => {
  const uploadedGifs = localStorage.getItem(KEY_UPLOADED_GIFS);

  if (uploadedGifs) {
    myGifosFromLocalStorage = await request.get(
      `${URL_GET_GIF_BY_ID}${uploadedGifs}&api_key=${APY_KEY_GIPHY}`
    );
  }

  utilities.drawGif(myGifosFromLocalStorage?.data, 'div-my-gifos-gif', 'bottom', false);
};

/**
 * Get stream and resize container view.
 */
const start = async () => {
  await recording.getStream(idVideoRecord);

  viewStart();
};

const viewStart = () => {
  idSpanTitleCreateGifos.textContent = 'Un chequeo antes de empezar';

  const idDivContentCreateGuifo = document.getElementById('div-content-create-guifo');
  idDivContentCreateGuifo.classList.toggle('hide');
  idDivContentCheckBeforeStart.classList.toggle('hide');

  idACloseCreateGif.classList.replace('hide', 'show');

  // Resize container view.
  idSectionCreateGifos.style.width = '860px';
  idSectionCreateGifos.style.height = '548px';
  document.getElementById('div-create-gifos').style.padding = '8px 14px 13px 8px';
};

/**
 * Start recording
 */
const capture = async () => {
  idSpanTitleCreateGifos.textContent = 'Capturando tu guifo';

  idBtnCaptureGif.style.pointerEvents = 'none';
  let btnsReadyGif = document.querySelectorAll('.btn-capture-gif span');
  btnsReadyGif.forEach((element) => {
    element.classList.replace('btn-primary', 'btn-disabled');
  });

  await recording.start('capture-my-guifos');
};

/**
 * When class Recording execute start - onGifRecordingStarted() successfully
 * show view capture
 */
const viewCapture = () => {
  idBtnCaptureGif.classList.toggle('hide');

  idBtnReadyGif.classList.replace('hide', 'show');

  chronometer.idInputChronometer.classList.toggle('hide');
  chronometer.start();
  const idDivChronoProgressRepeatUploadReadyGif = document.getElementById(
    'div-chronometer-progress-repeat-upload-ready-gif'
  );
  idDivChronoProgressRepeatUploadReadyGif.classList.replace('hide', 'show');
};

/**
 * Stop recording
 */
const ready = async () => {
  await recording.stop();

  viewReady();
};

const viewReady = () => {
  idSpanTitleCreateGifos.textContent = 'Vista previa';

  idImgPreview.classList.toggle('hide');
  idVideoRecord.classList.toggle('hide');

  idBtnReadyGif.classList.replace('show', 'hide');

  idBtnPlayPreviewGif.classList.replace('hide', 'show');
  progressBar.build('preview-progress-bar-gif', 'previewProgressBar', 17, 'inProgressBar');
  idBtnRepeatCapture.classList.replace('hide', 'show');
  idBtnUploadGif.classList.replace('hide', 'show');

  chronometer.stop();
};

/**
 * Play gif preview
 */
const playPreview = () => {
  idBtnPlayPreviewGif.style.pointerEvents = 'none';
  idBtnPlayPreviewGif.classList.toggle('inProgressBar');

  chronometer.reset();

  idImgPreview.src = recording.urlBlobGif;
  progressBar.start(chronometer.timeElapsed);
  chronometer.start(idInputChronometer);

  setTimeout(() => {
    idImgPreview.src = recording.urlBlobPng;
    progressBar.reset();
    chronometer.stop();
    idBtnPlayPreviewGif.style.pointerEvents = 'auto';
    idBtnPlayPreviewGif.classList.toggle('inProgressBar');
  }, chronometer.timeElapsed);
};

/**
 * Repeat recording
 */
const repeat = async () => {
  await recording.getStream(idVideoRecord);

  viewRepeat();
};

const viewRepeat = () => {
  idSpanTitleCreateGifos.textContent = 'Un chequeo antes de empezar';
  idBtnCaptureGif.classList.replace('hide', 'show');
  idBtnCaptureGif.style.pointerEvents = 'auto';
  let btnsReadyGif = document.querySelectorAll('.btn-capture-gif span');
  btnsReadyGif.forEach((element) => {
    element.classList.replace('btn-disabled', 'btn-primary');
  });

  idImgPreview.classList.toggle('hide');
  idVideoRecord.classList.toggle('hide');

  idInputChronometer.classList.toggle('hide');
  chronometer.reset();
  idBtnPlayPreviewGif.classList.replace('show', 'hide');
  progressBar.delete();

  idBtnRepeatCapture.classList.replace('show', 'hide');
  idBtnUploadGif.classList.replace('show', 'hide');
};

/**
 * Upload gif
 */
const upload = async () => {
  const idBtnCancelGif = document.getElementById('btn-cancel-gif');

  viewUpload(idBtnCancelGif);

  let formdata = new FormData();
  formdata.append('api_key', APY_KEY_GIPHY);
  formdata.append('username', USER_NAME_GIPHY);
  formdata.append('file', recording.blob, `CustomGif-${utilities.getDateDDMMYYHHMMSS()}.gif`);
  formdata.append('tags', `CustomGif-${utilities.getDateDDMMYYHHMMSS()}`);

  const uploadGif = await request.post(URL_UPLOAD_ENDPOINT_GIPHY, formdata);

  if (uploadGif?.data) {
    viewFinish(idBtnCancelGif);

    modal.open('myModal', '¡Exitoso!', 'Guifo subido con éxito', 'sucess_icon', null);

    let uploadedGifs = localStorage.getItem(KEY_UPLOADED_GIFS);
    if (uploadedGifs) {
      uploadedGifs += ',' + uploadGif.data.id;
      localStorage.setItem(KEY_UPLOADED_GIFS, uploadedGifs);
    } else {
      localStorage.setItem(KEY_UPLOADED_GIFS, uploadGif.data.id);
    }
    await getMyGifOS();
    await getGifByIDFromLocalStorage(uploadGif.data.id);
  }
};

const viewUpload = (idBtnCancelGif) => {
  idSpanTitleCreateGifos.textContent = 'Subiendo guifo';

  idBtnCancelGif.classList.replace('btn-secundary', 'btn-disabled');
  idACloseCreateGif.classList.toggle('disabled');

  idDivContentCheckBeforeStart.classList.toggle('hide');
  idDivContentUploadingGif.classList.toggle('hide');

  progressBar.delete();
  progressBar.build('div-upload-progress-bar-gif', 'uploadProgressBar', 23, 'inProgressBar');
  progressBar.startLoop();
};

const viewFinish = (idBtnCancelGif) => {
  const idImgGifPreview = document.getElementById('img-gif-preview');
  const idDivContentSuccessfullyUploadedGif = document.getElementById(
    'div-content-successfully-uploaded-gif'
  );

  idSpanTitleCreateGifos.textContent = 'Guifo subido con éxito';
  idSectionCreateGifos.style.width = '721px';
  idSectionCreateGifos.style.height = '391px';

  idBtnCancelGif.classList.replace('btn-secundary', 'btn-primary');
  idACloseCreateGif.classList.toggle('disabled');
  idImgGifPreview.src = recording.urlBlobGif;
  idDivContentSuccessfullyUploadedGif.classList.toggle('hide');

  idDivContentUploadingGif.classList.toggle('hide');
  progressBar.delete();
};

/**
 * Cancel upload gif
 */
const cancel = async () => {
  location.reload();
};

/**
 * Write contents of the URL Gif to the clipboard
 * when clicking "Copy Guifo Link"
 */
const copyLinkGuifo = () => {
  clipboard.copy(urlGif);
};

/**
 * Download gif.
 * Convert the blob to a gif.
 * @param {event} e
 */
const downloadGuifo = (e) => {
  e.preventDefault();
  invokeSaveAsDialog(recording.blob, `CustomGif-${utilities.getDateDDMMYYHHMMSS()}.gif`);
};

const getGifByIDFromLocalStorage = async (id) => {
  const gifById = myGifosFromLocalStorage.data.filter((gif) => gif.id === id)[0];
  let {
    images: {
      fixed_height: { url }
    }
  } = gifById;
  urlGif = url;
};

/**
 * Reload the page to reset it to default.
 */
const finish = () => {
  location.reload();
};

showView();

getMyGifOS();
