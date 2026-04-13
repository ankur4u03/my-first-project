const storeContainer = document.getElementById('storeProducts');
const message = document.getElementById('message');

const showError = (text) => {
  message.innerHTML = `<div class="alert error">${text}</div>`;
};

const loadStoreProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products from API.');
    }

    const products = await response.json();

    if (!products.length) {
      storeContainer.innerHTML = '<p class="muted">No products available.</p>';
      return;
    }

    storeContainer.innerHTML = products
      .map(
        (product) => `
        <article class="card product">
          <img src="${product.image}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <p class="price">$${Number(product.price).toFixed(2)}</p>
          <p class="muted">${product.category}</p>
          <div class="actions">
            <a href="./product.html?id=${product._id}"><button class="secondary">View Details</button></a>
            <a href="${product.affiliateLink}" target="_blank" rel="noopener noreferrer"><button>Buy Now</button></a>
          </div>
        </article>
      `
      )
      .join('');
  } catch (error) {
    showError(error.message);
  }
};

loadStoreProducts();
