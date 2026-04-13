const detailsContainer = document.getElementById('productDetails');
const messageContainer = document.getElementById('message');

const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

const renderError = (text) => {
  messageContainer.innerHTML = `<div class="alert error">${text}</div>`;
};

const loadProductDetails = async () => {
  if (!productId) {
    renderError('Product ID is missing in URL.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);

    if (!response.ok) {
      throw new Error('Product not found.');
    }

    const product = await response.json();

    detailsContainer.innerHTML = `
      <img src="${product.image}" alt="${product.name}" style="width: 100%; max-height: 350px; object-fit: cover; border-radius: 8px;" />
      <h1>${product.name}</h1>
      <p class="price">$${Number(product.price).toFixed(2)}</p>
      <p class="muted">Category: ${product.category}</p>
      <p>${product.description}</p>
      <div class="actions">
        <a href="${product.affiliateLink}" target="_blank" rel="noopener noreferrer"><button>Buy Now</button></a>
        <a href="./index.html"><button class="secondary">Back to Store</button></a>
      </div>
    `;
  } catch (error) {
    renderError(error.message);
  }
};

loadProductDetails();
