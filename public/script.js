// DOM Elements
const itemForm = document.getElementById('item-form');
const itemIdInput = document.getElementById('item-id');
const itemNameInput = document.getElementById('item-name');
const itemPriceInput = document.getElementById('item-price');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const itemsTbody = document.getElementById('items-tbody');

// Edit Mode State
let isEditing = false;

// 1. READ: Fetch all items from GET /items
async function fetchItems() {
  try {
    const response = await fetch('/items');
    if (!response.ok) {
      throw new Error(`Failed to fetch items: ${response.statusText}`);
    }
    const items = await response.json();
    renderTable(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    itemsTbody.innerHTML = `<tr><td colspan="4" class="empty-state">Error connecting to server.</td></tr>`;
  }
}

// Render items into table
function renderTable(items) {
  itemsTbody.innerHTML = '';

  if (items.length === 0) {
    itemsTbody.innerHTML = `<tr><td colspan="4" class="empty-state">No items found. Add one above!</td></tr>`;
    return;
  }

  items.forEach(item => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td class="col-id">${item.id}</td>
      <td class="col-name">${escapeHtml(item.name)}</td>
      <td class="col-price">${item.price}</td>
      <td style="text-align: center;">
        <div class="action-group">
          <button class="btn-sm btn-edit" onclick="handleEdit(${item.id}, '${escapeQuotes(item.name)}', ${item.price})">
            Edit
          </button>
          <button class="btn-sm btn-delete" onclick="handleDelete(${item.id})">
            Delete
          </button>
        </div>
      </td>
    `;

    itemsTbody.appendChild(row);
  });
}

// 2. CREATE or UPDATE on form submit
itemForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = itemNameInput.value.trim();
  const price = parseFloat(itemPriceInput.value);

  if (!name || isNaN(price)) {
    alert('Please enter a valid name and price.');
    return;
  }

  try {
    if (isEditing) {
      // UPDATE: PUT /items/:id
      const id = itemIdInput.value;
      const response = await fetch(`/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update item.');
      }
    } else {
      // CREATE: POST /items
      const response = await fetch('/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create item.');
      }
    }

    resetForm();
    await fetchItems();
  } catch (error) {
    console.error('Submission error:', error);
    alert(error.message);
  }
});

// 3. EDIT: Populate form with row values
window.handleEdit = function(id, name, price) {
  isEditing = true;
  itemIdInput.value = id;
  itemNameInput.value = name;
  itemPriceInput.value = price;

  submitBtn.textContent = 'Update';
  cancelBtn.style.display = 'inline-block';
  itemNameInput.focus();
};

// 4. DELETE: Send DELETE /items/:id
window.handleDelete = async function(id) {
  const confirmed = confirm(`Are you sure you want to delete item #${id}?`);
  if (!confirmed) return;

  try {
    const response = await fetch(`/items/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete item.');
    }

    if (isEditing && itemIdInput.value == id) {
      resetForm();
    }

    await fetchItems();
  } catch (error) {
    console.error('Delete error:', error);
    alert(error.message);
  }
};

// Cancel edit
cancelBtn.addEventListener('click', () => {
  resetForm();
});

// Reset form to default
function resetForm() {
  itemForm.reset();
  itemIdInput.value = '';
  isEditing = false;
  submitBtn.textContent = 'Submit';
  cancelBtn.style.display = 'none';
}

// Helpers
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function escapeQuotes(text) {
  return text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// Initial fetch on page load
document.addEventListener('DOMContentLoaded', fetchItems);
