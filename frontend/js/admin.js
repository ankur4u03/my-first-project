const form = document.getElementById('productForm');
const messageEl = document.getElementById('message');
const productListEl = document.getElementById('productList');
const submitButton = document.getElementById('submitButton');
const cancelEditButton = document.getElementById('cancelEdit');

let editingProductId = null;

const showMessage = (text, type = 'success') => {
  messageEl.innerHTML = `<div class="alert ${type}">${text}</div>`;
};

const clearMessage = () => {
  messageEl.innerHTML = '';
};

const resetForm = () => {
  form.reset();
  editingProductId = null;
  submitButton.textContent = 'Add Product';
  cancelEditButton.style.display = 'none';
};

const readFormData = () => {
  const formData = new FormData();
  formData.append('name', document.getElementById('name').value.trim());
  formData.append('price', document.getElementById('price').value);
  formData.append('description', document.getElementById('description').value.trim());
  formData.append('category', document.getElementById('category').value.trim());
  formData.append('affiliateLink', document.getElementById('affiliateLink').value.trim());

  const imageFile = document.getElementById('image').files[0];
  const imageUrl = document.getElementById('imageUrl').value.trim();

  if (imageFile) {
    formData.append('image', imageFile);
  }

  if (imageUrl) {
    formData.append('imageUrl', imageUrl);
  }

  return formData;
};

const loadProducts = async () => {
  try {
    clearMessage();
    const response = await fetch(`${API_BASE_URL}/products`);

    if (!response.ok) {
      throw new Error('Unable to load products.');
    }

    const products = await response.json();

    productListEl.innerHTML = products
      .map(
        (product) => `
        <article class="card product">
          <img src="${product.image}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <p class="price">$${Number(product.price).toFixed(2)}</p>
          <p class="muted">${product.category}</p>
          <div class="actions">
            <button onclick="startEdit('${product._id}')" class="secondary">Edit</button>
            <button onclick="deleteProduct('${product._id}')" class="danger">Delete</button>
          </div>
        </article>
      `
      )
      .join('');

    if (!products.length) {
      productListEl.innerHTML = '<p class="muted">No products yet.</p>';
    }
  } catch (error) {
    showMessage(error.message, 'error');
  }
};

const startEdit = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Product not found.');
    }

    const product = await response.json();
    editingProductId = id;
    document.getElementById('name').value = product.name;
    document.getElementById('price').value = product.price;
    document.getElementById('description').value = product.description;
    document.getElementById('category').value = product.category;
    document.getElementById('affiliateLink').value = product.affiliateLink;
    document.getElementById('imageUrl').value = product.image;

    submitButton.textContent = 'Update Product';
    cancelEditButton.style.display = 'block';
    showMessage('Editing product. Update and submit to save changes.');
  } catch (error) {
    showMessage(error.message, 'error');
  }
};

const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete product.');
    }

    if (editingProductId === id) {
      resetForm();
    }

    await loadProducts();
    showMessage('Product deleted successfully.');
  } catch (error) {
    showMessage(error.message, 'error');
  }
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    const formData = readFormData();
    const url = editingProductId
      ? `${API_BASE_URL}/products/${editingProductId}`
      : `${API_BASE_URL}/products`;

    const response = await fetch(url, {
      method: editingProductId ? 'PUT' : 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Operation failed.');
    }

    showMessage(editingProductId ? 'Product updated successfully.' : 'Product added successfully.');
    resetForm();
    await loadProducts();
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

cancelEditButton.addEventListener('click', () => {
  resetForm();
  clearMessage();
});

window.startEdit = startEdit;
window.deleteProduct = deleteProduct;

loadProducts();
