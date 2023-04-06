import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios'
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
var debounce = require('lodash.debounce');
import { FetchImg } from './axiosFetch';

const refs = {
  form: document.querySelector('#search-form'),
  btnSubmit: document.querySelector('button'),
  galleryBox: document.querySelector('.gallery'),
  btnLoad: document.querySelector('.load-more')
}
const fetchFor = new FetchImg();
const TIME = 400;

refs.btnLoad.classList.add('is-hidden');
refs.btnSubmit.setAttribute('disabled', true);

refs.form.addEventListener('submit', onBtnSubmit);
refs.btnLoad.addEventListener('click', debounce(onBtnLoadClick, TIME));
refs.form.addEventListener('input', onBtnInput);

function onBtnInput(e) {
  fetchFor.querry = e.target.value.trim();
  fetchFor.querry
    ? refs.btnSubmit.removeAttribute('disabled')
    : refs.btnSubmit.setAttribute('disabled', true);
}

async function onBtnSubmit(e) {
  e.preventDefault();
  fetchFor.page = 1;
  refs.galleryBox.innerHTML = '';
  fetchFor.querry = e.target.elements.searchQuery.value.trim();
  refs.btnLoad.classList.add('is-hidden');
  try {
    const { data } = await fetchFor.axiosReturn();
    makeMurkup(data.hits);
    noMoreResult(data.totalHits);

    if (!data.hits.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    if (data.hits.length > 0) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      refs.btnLoad.classList.remove('is-hidden');
    }
  } catch (err) {
    console.log(err);
  }
}

async function onBtnLoadClick() {
  fetchFor.page += 1;

  try {
    const { data } = await fetchFor.axiosReturn();
    makeMurkup(data.hits);
    noMoreResult(data.totalHits);
  } catch (err) {
    console.log(err);
  }
}

function makeMurkup(data) {
  const murkup = data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card"> 
      <a class="gallery__item" href="${largeImageURL}"/>   
      <img src="${webformatURL}" alt="${tags}" loading="lazy" width = 350px height=200px/>
   <div class="info">
      <p class="info-item">
        <b>Likes:</b><span>${likes}</span>
      </p>
      <p class="info-item">
        <b>Views:</b><span>${views}</span>
      </p>
      <p class="info-item" >
        <b> Comments:</b><span>${comments}</span>
      </p>
      <p class="info-item">
        <b>Downloads:</b><span>${downloads}</span>
      </p>
    </div>
  </div>`
    )
    .join('');

  refs.galleryBox.insertAdjacentHTML('beforeend', murkup);

  var lightbox = new SimpleLightbox('.gallery a', {
    captionSelector: 'img',
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
    scrollZoom: false,
  });
}

function noMoreResult(totalHits) {
  if (fetchFor.page * fetchFor.per_page > totalHits && totalHits !== 0) {
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
    refs.btnLoad.classList.add('is-hidden');
    return;
  }
}
