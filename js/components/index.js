const request = new Request();

const idInputSearchGif = document.getElementById('input-search-gif');
const idDivAutocompleteSuggestedSearch = document.getElementById('div-autocomplete-suggested-search');
const idBtnSearchGif = document.getElementById('btn-search-gif');
const idDivAutocompleteHashTag = document.getElementById('div-autocomplete-hashTag');

/**
 * Search gif.This function is called from:
 * Search button, suggested option, suggested tag and see more button
 * @param {string} inputSearch - It's optional. Only for search button.
 * @param {event} e
 */
const getSearchGif = async (inputSearch, e) => {
  const idInputSearchTrendingGif = document.getElementById('input-search-trending-gif');

  if (e) e.preventDefault();

  let search = inputSearch; // For suggested option, suggested tag and see more button.
  if (!search) search = idInputSearchGif.value; // For search button

  if (search) {
    idInputSearchGif.value = search;
    idInputSearchTrendingGif.placeholder = `${search} (resultados)`;

    const searchGif = await request.get(
      `${URL_SEARCH_GIF_GIPHY}${search}&api_key=${APY_KEY_GIPHY}${LIMIT}24`
    );
    utilities.drawGif(searchGif?.data, 'div-trending-gif', 'bottom', false);

    // Close Autocomplete suggested options
    if (search && idDivAutocompleteSuggestedSearch.classList.contains('show')) {
      idDivAutocompleteSuggestedSearch.classList.replace('show', 'hide');
    }
  } else {
    // If the title of the gif to search is empty.
    idInputSearchTrendingGif.placeholder = 'Tendencias';
    getSuggestionsAndTredingGif();
  }
};

/**
 * Get the gifs for the suggestions and trends section.
 */
const getSuggestionsAndTredingGif = async () => {
  const trendingSuggestionGif = await request.get(
    `${URL_TRENDING_GIF_GIPHY}?api_key=${APY_KEY_GIPHY}${LIMIT}24`
  );

  // The first 4 gifs are shown in the suggestions section.
  utilities.drawGif(trendingSuggestionGif?.data.slice(0, 4), 'div-suggestion-gif', 'top', true);

  // The other gifs are shown in the trends section.
  utilities.drawGif(trendingSuggestionGif?.data.slice(4, 24), 'div-trending-gif', 'bottom', false);
};

/**
 * Change a suggestion gif for a gif obtained from the giphy random endpoint.
 * @param {number} index - Index gif
 */
const changeGif = async (index, section) => {
  document.getElementById(`span-img-gif-${index}`).innerHTML = null;
  document.getElementById(`${section}-img-gif-${index}`).src = null;

  const randomGif = await request.get(`${URL_GET_RANDOM_GIF}&api_key=${APY_KEY_GIPHY}`);

  if (randomGif?.data) {
    const {
      title,
      images: {
        fixed_height: { url }
      }
    } = randomGif.data;
    const search = title.substring(0, title.indexOf('GIF')).trim();
    const tag = search.replace(/ /g, '');

    document.getElementById(`span-img-gif-${index}`).innerHTML = `#${tag}`;
    document.getElementById(`${section}-img-gif-${index}`).src = url;
    document.getElementById(`a-show-more-${index}`).setAttribute('onClick', `getSearchGif("${search}");`);
  }
};

/**
 * Enable the search button and the suggested autocomplete select
 * if the text entered in the input is greater than or equal to 3.
 */
const keyupInputSearchGif = () => {
  const wordSearch = idInputSearchGif.value;
  if (wordSearch.length >= 3) {
    getAutocompleteSuggestedSearch(wordSearch);
  } else {
    idDivAutocompleteSuggestedSearch.classList.replace('show', 'hide');
    idDivAutocompleteHashTag.classList.replace('show', 'hide');
    idBtnSearchGif.classList.replace('btn-primary', 'btn-disabled');
  }
};

/**
 * Search for related words using an entered word.
 * @param {string} wordSearch
 */
const getAutocompleteSuggestedSearch = async (wordSearch) => {
  const sugestedWords = await request.get(
    `${URL_RELATED_TAG_GIF_GIPHY}${wordSearch}?api_key=${APY_KEY_GIPHY}`
  );

  const divAutocompleteSuggestedOptions = document.getElementById('div-autocomplete-suggested-options');
  divAutocompleteSuggestedOptions.innerHTML = '';
  idDivAutocompleteHashTag.innerHTML = '';

  let tag = wordSearch.trim().replace(/ /g, '');
  // Suggested autocomplete select
  let aBusqueda = `<a class="a-busqueda" onclick="getSearchGif('${wordSearch}')">${wordSearch}</a>`;
  divAutocompleteSuggestedOptions.innerHTML += aBusqueda;
  // Suggested autocomplete tag
  let aAutocompleteHashTag = `<a onclick="getSearchGif('${wordSearch}')">#${tag}</a>`;
  idDivAutocompleteHashTag.innerHTML += aAutocompleteHashTag;

  if (sugestedWords?.data.length) {
    sugestedWords.data.slice(0, 6).forEach((element) => {
      const word = element.name;
      tag = word.trim().replace(/ /g, '');
      // Suggested autocomplete select
      aBusqueda = `<a class="a-busqueda" onclick="getSearchGif('${word}')">${word}</a>`;
      divAutocompleteSuggestedOptions.innerHTML += aBusqueda;
      // Suggested autocomplete tag
      aAutocompleteHashTag = `<a onclick="getSearchGif('${word}')">#${tag}</a>`;
      idDivAutocompleteHashTag.innerHTML += aAutocompleteHashTag;
    });
  }

  idDivAutocompleteSuggestedSearch.classList.replace('hide', 'show');
  idDivAutocompleteHashTag.classList.replace('hide', 'show');
  idBtnSearchGif.classList.replace('btn-disabled', 'btn-primary');
};

getSuggestionsAndTredingGif();
