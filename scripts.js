const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');
const productsApi = "https://fakestoreapi.com/products";
let allProducts = [];
mobileMenu.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

showLoader = () => {
  document.getElementById("loader").style.display = "block";
}

// Function to hide the loader
hideLoader = ()=> {
  document.getElementById("loader").style.display = "none";
}

const showShimmer = () => {
  document.getElementById('shimmer-wrapper').style.display = 'flex';
}

const hideShimmer = () => {
  document.getElementById('shimmer-wrapper').style.display = 'none';
}


getProducts = async () => {
    console.log("Get Products Api Called!");
    // showLoader();
    showShimmer();
    try{

   
    const response = await fetch(productsApi);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
  }
    const data = await response.json();
    const products = JSON.parse(JSON.stringify(data));
    allProducts = JSON.parse(JSON.stringify(data));
    displayProducts(products);
    
    let categories = [];
    products.forEach((product) => {
        if (!categories.some((category) => category.name === product.category)) {
            let newCategory = {
                id: Math.floor(Math.random() * 10000),
                name: product.category
            }
            categories.push(newCategory);
        }
    });
    console.log({ categories });
    displayCategory(categories);
  } catch(error){
    console.error("There was an error fetching the products:", error);
    displayError("Unable to fetch products. Please try again later.");
    hideShimmer();
  }
};

displayError = (message) => {
  const productsContainer = document.querySelector('.products');
  productsContainer.innerHTML = `<div class="error">${message}</div>`;
  // hideLoader();
  hideShimmer();
}

displayProducts = (products) => {
    const productsContainer = document.querySelector('.products');
    productsContainer.innerHTML = ''; // Clear previous products

    products.forEach(product => {
        // Create product card element
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        // Create and append product image
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.title;
        productCard.appendChild(img);

        // Create and append product info container
        const productInfo = document.createElement('div');
        productInfo.classList.add('product-info');

        // Create and append product name
        const productName = document.createElement('h4');
        productName.textContent = product.title;
        productInfo.appendChild(productName);

        // Create and append product price
        const productPrice = document.createElement('p');
        productPrice.textContent = `$${product.price}`;
        productInfo.appendChild(productPrice);

         // Create and append heart icon
         const heartIcon = document.createElement('i');
         heartIcon.classList.add('far', 'fa-heart');
         heartIcon.style.cursor = 'pointer'; // Optional: Change cursor to pointer
         productInfo.appendChild(heartIcon);

        // Append product info to product card
        productCard.appendChild(productInfo);

        // Append product card to products container
        productsContainer.appendChild(productCard);
    });

    updateResultCount(products.length);
}

displayCategory = (categories) => {
    const categoryList = document.getElementById('category-list');
    categoryList.innerHTML = ''; // Clear previous categories

    categories.forEach(category => {
        const listItem = document.createElement('li');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = category.name;
        checkbox.id = `category-${category.id}`;
        checkbox.addEventListener('change', filterItems);

        const label = document.createElement('label');
        label.htmlFor = `category-${category.id}`;
        label.textContent = category.name;

        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        categoryList.appendChild(listItem);
    });
}

filterItems = async () => {
    const selectedCategories = Array.from(document.querySelectorAll('#category-list input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);

    const response = await fetch(productsApi);
    const products = await response.json();

    const filteredProducts = selectedCategories.length === 0 ? products : products.filter(product => selectedCategories.includes(product.category));
    // displayProducts(filteredProducts);
    sortAndDisplayProducts(filteredProducts);
}

sortAndDisplayProducts = (products) => {
  // showLoader();
  showShimmer();

  console.log({products})
  const sortCriteria = document.getElementById('sort').value;

  let sortedProducts = [...products];
  if (sortCriteria === 'lowToHigh') {
      sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortCriteria === 'highToLow') {
      sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortCriteria === 'name') {
      sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
  }

  displayProducts(sortedProducts);
}

handleSearch = (event) => {
  const searchTerm = event.target.value.toLowerCase();
  const filteredProducts = allProducts.filter(product => 
      product.title.toLowerCase().includes(searchTerm)
  );

  displayProducts(filteredProducts);
}

// Event listener for the search bar
document.getElementById('search').addEventListener('input', handleSearch);

updateResultCount = (count) => {
  const resultCountElement = document.querySelector('.result-count p');
  resultCountElement.textContent = `${count} Results`;
  hideLoader();

}

document.getElementById('sort').addEventListener('change', () => {
  filterItems();
});



getProducts();
