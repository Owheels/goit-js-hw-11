import axios from 'axios';

export async function getPhotos(inputValue, page) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '37802122-29025f785365a066da92fbf75',
        q: inputValue,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: page,
      },
    });

    return response.data.hits;
  } catch (error) {
    console.log(error);
  }
}
