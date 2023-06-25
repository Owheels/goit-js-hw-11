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
  let inputValue = encodeURIComponent(formInput.value);
  const photos = await getPhotos(inputValue, currentPage);

  gallery.innerHTML = '';

  gallery.insertAdjacentHTML('beforeend', createMarkup(photos));
  console.log(inputValue);
}

loadMoreBtn.addEventListener('click', loadMore);

async function loadMore() {
  currentPage++;
  let inputValue = encodeURIComponent(formInput.value);
  const photos = await getPhotos(inputValue, currentPage);

  gallery.innerHTML += createMarkup(photos);
}
