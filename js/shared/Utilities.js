const body = document.getElementsByTagName('body')[0];
const idMyDropdownTheme = document.getElementById('my-dropdown-theme');
const idVisitorCounter = document.getElementById('span-visitor-counter');
const idFavicon = document.getElementById('favicon');
const theme = localStorage.getItem(KEY_THEME);

class Utilities {
  /**
   * Creates an instance of Utilities.
   * Execute countVisitors and countVisitors functions.
   * @memberof Utilities
   */
  constructor() {
    this.countVisitors();
    this.showTheme(theme);
  }

  /**
   * Each time the page is opened or refreshed, the visitor counter is increased by one unit,
   * which is stored in the localStorage.
   */
  countVisitors = () => {
    let count = 1;

    const visitorCounter = localStorage.getItem(KEY_VISITOR_COUNTER);
    if (visitorCounter) count = Number(visitorCounter) + 1;

    localStorage.setItem(KEY_VISITOR_COUNTER, count);

    idVisitorCounter.innerHTML = count;
  };

  /**
   * Show the theme saved in localStorage.
   * Change the body class and also change the favicon depending on the theme.
   * @param {string} theme
   */
  showTheme = (theme) => {
    if (theme) {
      // Change css theme
      if (theme === 'theme-sailor-day') {
        body.classList.replace('theme-sailor-night', 'theme-sailor-day');
      } else {
        body.classList.replace('theme-sailor-day', 'theme-sailor-night');
      }

      // Change favicon depending from theme
      const pathName = window.location.pathname;
      if (pathName.toLowerCase().includes('mygifos')) {
        favicon.setAttribute('href', `../../../assets/icons/${theme}.ico`);
      } else {
        favicon.setAttribute('href', `./assets/icons/${theme}.ico`);
      }
    }
  };

  /**
   * Show the gifs of the entire application:
   * - Suggestions gifs.
   * - Trending gifs.
   * - My gifOS.
   * @param {object []} images
   * @param {HTMLElement} section
   * @param {string} whereShowHashTag
   * @param {boolean} showButton
   */
  drawGif = (images, section, whereShowHashTag, showButton) => {
    const divSection = document.getElementById(section);
    divSection.innerHTML = '';

    if (!images || !images.length) {
      divSection.innerHTML = "<p class='without-results'> Sin resultados </p>";
    } else {
      images.forEach((image, index) => {
        const {
          title,
          images: {
            fixed_height: { url }
          }
        } = image;
        const wordSearch = title.substring(0, title.indexOf('GIF')).trim();
        const tag = wordSearch.replace(/ /g, '');

        const img = `<img class="img-gif" id="${section}-img-gif-${index}" src=${url} alt="${title}"></img>`;

        // A background is added to the image to be viewed this color while image is loading.
        const backGroundColor = Math.floor(Math.random() * 16777215).toString(16);
        const divGif = `<div class="div-img-gif div-img-gif-${section}" style="background: #${backGroundColor};">
          ${
            whereShowHashTag == 'top' // For Suggestion gifs
              ? `<p class="gradient hash-tag-top">
                  <span id="span-img-gif-${index}">#${tag}</span>
                  <a onclick="changeGif(${index},'${section}')">
                    <img id="img-gif-(${index})" src="./assets/icons/close.svg" alt="close-gif" class="close-gif" />
                  </a>
                </p>`
              : ''
          }
          <a href="${url}" target="_blank"> ${img} </a>
          ${
            showButton // For Suggestion gifs
              ? `<a id="a-show-more-${index}" class="a-show-more" onclick="getSearchGif('${wordSearch}')">Ver más..</a>`
              : ''
          }
          ${
            whereShowHashTag == 'bottom' // For Trending gifs
              ? `<p class="gradient hash-tag-bottom">#${tag}</p>`
              : ''
          }
        </div>`;

        divSection.innerHTML += divGif;
      });
    }
  };

  /**
   * Return a string with format DD-MM-YY-HH-MM-SS using the current date.
   * @returns
   */
  getDateDDMMYYHHMMSS = () => {
    const date = new Date();
    const dateStr =
      ('00' + date.getDate()).slice(-2) +
      '-' +
      ('00' + (date.getMonth() + 1)).slice(-2) +
      '-' +
      date.getFullYear() +
      '-' +
      ('00' + date.getHours()).slice(-2) +
      '-' +
      ('00' + date.getMinutes()).slice(-2) +
      '-' +
      ('00' + date.getSeconds()).slice(-2);
    return dateStr;
  };
}

const utilities = new Utilities();

/**
 * Change the selected theme of theme menu.
 * @param {string} theme
 */
const changeTheme = (theme) => {
  utilities.showTheme(theme);
  localStorage.setItem(KEY_THEME, theme);
  idMyDropdownTheme.classList.toggle('hide');
};

/**
 * Open/show display theme menu
 */
const displayThemeMenu = () => {
  idMyDropdownTheme.classList.toggle('hide');
};

const locationReload = () => {
  location.reload();
};
