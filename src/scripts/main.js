import ImageApiService from './api.js';
import LoadMoreBtn from './btn.js';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');

const imageApiService = new ImageApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

form.addEventListener('submit', onSubmit);
loadMoreBtn.button.addEventListener('click', fetchHits);

function onSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const value = form.elements.searchQuery.value.trim();
  imageApiService.search = value;
  if (value === '') {
    console.log('Please formulate a request');
    return;
  }
  imageApiService.resetPage();
  clearList();
  loadMoreBtn.show();
  fetchHits().finally(() => form.reset());
}

async function fetchHits() {
  loadMoreBtn.disable();
  try {
    const hits = await imageApiService.getImage();
    console.log('hits:', hits);
    if (hits.length === 0)
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    const markup = hits.reduce((markup, hit) => createMarkup(hit) + markup, '');
    appendToList(markup);
    loadMoreBtn.enable();
  } catch (err) {
    onError(err);
  }
}

function appendToList(markup) {
  gallery.insertAdjacentHTML('beforeend', markup);
}

function createMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
  <a class = "gallery__link" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
  </a>
</div>`;
}

function clearList() {
  gallery.innerHTML = '';
}

function onError(err) {
  console.error(err);
  loadMoreBtn.hide();
  appendToList('<p>Articles not found</p>');
}
