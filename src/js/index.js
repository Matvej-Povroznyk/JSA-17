class PixabayApi {
    constructor({ apiKey, baseUrl = "https://pixabay.com/api/" }) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.page = 1;
    this.perPage = 15;
  }

  fetchImages() {
    const url = `${this.baseUrl}?key=${this.apiKey}&editors_choice=true&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`;
    return fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  incrementPage() {
    this.page += 1;
  }
  decrementPage() {
    this.page -= 1;
  }
  resetPage() {
    this.page = 1;
  }
}

const pixabayAPI = new PixabayApi({ apiKey: "39409700-74de25685e9a6a3e702d9f6e8" });

const imagesList = document.querySelector("[data-list]");
const loadMoreBtn = document.querySelector("[data-btn='load-more']");
const noMoreMsg = document.querySelector("[data-no-more]");

const renderImages = (hits) => {
    const markup = hits.map(img => {
        return `
        <li class="image-item">
          <img src="${img.webformatURL}" alt="${img.tags}" />
        </li>

        `
    }).join("")
    imagesList.insertAdjacentHTML("beforeend", markup);
}

const fetchAndRenderImages = () => {
    pixabayAPI.fetchImages()
        .then(data => {
            if (!data || !data.hits) return;
            renderImages(data.hits);

            const totalLoaded = pixabayAPI.page * pixabayAPI.perPage;
            if (totalLoaded >= data.totalHits || data.hits.length === 0) {
                loadMoreBtn.style.display = "none";
                noMoreMsg.style.display = "block";
            } else {
                loadMoreBtn.style.display = "block";
                noMoreMsg.style.display = "none";
            }
        }
    )
}

const handleLoadMoreClick = () => {
    pixabayAPI.incrementPage();
    fetchAndRenderImages();
}

loadMoreBtn.addEventListener("click", handleLoadMoreClick);

fetchAndRenderImages();
