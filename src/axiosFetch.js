import axios from 'axios'

export class FetchImg {
    BASE_URL = 'https://pixabay.com/api/'
    API_KEY = 'key=35127623-0d4b7af5e30d2b7869ece6cf1'

    querry = null
    page = 1
    per_page = 40

    async axiosReturn () {
       return axios.get(`${this.BASE_URL}?${this.API_KEY}&q=${this.querry}&image_type=photo&safesearch=true&orientation=horizontal&page=${this.page}&per_page=${this.per_page}`).then(data => {return data})
    }
    
}

