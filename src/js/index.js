import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getPhotos } from './api';

const form = document.querySelector('.search-form');
const formInput = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let currentPage = 1;
let totalPages = 0;
let lightbox = null;

hideElement(loadMoreBtn);

function showElement(element) {
  element.style.display = 'block';
}

function hideElement(element) {
  element.style.display = 'none';
}

form.addEventListener('submit', onSubmit);

function createMarkup(photos) {
  return photos
    .map(
      photo => `
      <a href="${photo.largeImageURL}">
        <div class="photo-card container-inner">
          <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes<br></b>${photo.likes}
            </p>
            <p class="info-item">
              <b>Views<br></b>${photo.views}
            </p>
            <p class="info-item">
              <b>Comments<br></b>${photo.comments}
            </p>
            <p class="info-item">
              <b>Downloads<br></b>${photo.downloads}
            </p>
          </div>
        </div>
        </a>
      `
    )
    .join('');
}

async function onSubmit(evt) {
  evt.preventDefault();
  currentPage = 1;
  let inputValue = encodeURIComponent(formInput.value);
  const response = await getPhotos(inputValue, currentPage);

  if (response.photos.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      {
        width: '500px',
        timeout: '5000',
        fontSize: '25px',
        opacity: 0.7,
      }
    );
  } else {
    gallery.innerHTML = '';
    const photos = response.photos;
    gallery.insertAdjacentHTML('beforeend', createMarkup(photos));
    lightbox = new SimpleLightbox('.gallery a');
    showElement(loadMoreBtn);
  }
}

loadMoreBtn.addEventListener('click', loadMore);

async function loadMore() {
  currentPage++;
  let inputValue = encodeURIComponent(formInput.value);
  const response = await getPhotos(inputValue, currentPage);

  if (currentPage <= Math.ceil(response.totalHits / 40)) {
    const photos = response.photos;
    gallery.insertAdjacentHTML('beforeend', createMarkup(photos));
    lightbox.refresh();
    gallery.refresh();
  } else {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results.",
      {
        width: '500px',
        timeout: '5000',
        fontSize: '25px',
        opacity: 0.7,
      }
    );
    hideElement(loadMoreBtn);
  }
}
