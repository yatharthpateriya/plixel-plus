// ------------------------------
// GET HTML ELEMENTS
// ------------------------------

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultsContainer = document.getElementById("results");
const status = document.getElementById("status");


// ------------------------------
// SEARCH FUNCTION
// ------------------------------

async function searchImages() {

    // Get the search word
    const query = searchInput.value.trim();


    // ------------------------------
    // EMPTY SEARCH
    // ------------------------------

    if (query === "") {

        status.textContent = "Please enter something to search.";

        resultsContainer.innerHTML = "";

        return;
    }


    // ------------------------------
    // LOADING STATE
    // ------------------------------

    status.innerHTML = `
        <span class="spinner"></span>
        Searching...
    `;

    resultsContainer.innerHTML = "";

    searchButton.disabled = true;


    // ------------------------------
    // API URL
    // ------------------------------

    const url =
        `https://commons.wikimedia.org/w/api.php` +
        `?action=query` +
        `&generator=search` +
        `&gsrsearch=${encodeURIComponent(query)}` +
        `&gsrnamespace=6` +
        `&gsrlimit=20` +
        `&prop=imageinfo` +
        `&iiprop=url|extmetadata` +
        `&iiurlwidth=400` +
        `&format=json` +
        `&origin=*`;


    // ------------------------------
    // TRY API REQUEST
    // ------------------------------

    try {

        const response = await fetch(url);


        // ------------------------------
        // ERROR CHECK
        // ------------------------------

        if (!response.ok) {
            throw new Error("Request failed");
        }


        // Convert response to JSON
        const data = await response.json();


        // ------------------------------
        // GET RESULTS
        // ------------------------------

        const pages = data.query
            ? Object.values(data.query.pages)
            : [];


        // ------------------------------
        // EMPTY STATE
        // ------------------------------

        if (pages.length === 0) {

            status.textContent =
                "No results found. Try another search.";

            resultsContainer.innerHTML = "";

            return;
        }


        // ------------------------------
        // RESULT COUNT / POLISH
        // ------------------------------

        status.textContent =
            `Showing ${pages.length} results for "${query}".`;


        // ------------------------------
        // DISPLAY RESULTS
        // ------------------------------

        pages.forEach(page => {

            // Make sure image information exists
            if (
                !page.imageinfo ||
                !page.imageinfo[0]
            ) {
                return;
            }


            const imageInfo = page.imageinfo[0];


            // Create card
            const card = document.createElement("article");

            card.className = "card";


            // Get image URL
            const imageUrl =
                imageInfo.thumburl || imageInfo.url;


            // Create title
            const title =
                page.title
                    .replace("File:", "")
                    .replace(/_/g, " ");


            // Create card HTML
            card.innerHTML = `
                <img
                    src="${imageUrl}"
                    alt="${title}"
                    loading="lazy"
                >

                <div class="card-content">

                    <h3>${title}</h3>

                    <a
                        href="https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View on Wikimedia Commons →
                    </a>

                </div>
            `;


            // Add card to page
            resultsContainer.appendChild(card);

        });

    }


    // ------------------------------
    // ERROR STATE
    // ------------------------------

    catch (error) {

        console.error(error);

        status.textContent =
            "Something went wrong. Please try again.";

        resultsContainer.innerHTML = "";

    }


    // Enable button again
    searchButton.disabled = false;
}


// ------------------------------
// BUTTON CLICK
// ------------------------------

searchButton.addEventListener(
    "click",
    searchImages
);


// ------------------------------
// ENTER KEY
// ------------------------------

searchInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            searchImages();
        }

    }
);