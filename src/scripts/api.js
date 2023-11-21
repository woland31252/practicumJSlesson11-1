import axios from 'axios';
const ENDPOINT = 'https://pixabay.com/api/';
const KEY = '33796051-1e422d07d8c9fc912bc2a7eb4';
const param =
  'per_page=40&image_type=photo&orientation=horyzontal&safesearch=true';

export default class ImageApiService {
  constructor() {
    this.page = 1;
    this.search = '';
  }
  async getImage() {
    const URL = `${ENDPOINT}?key=${KEY}&q=${this.search}&page=${this.page}&${param}`;
    const response = await axios.get(URL);
    this.nextPage();

    return response.data;
  }
  nextPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
}
