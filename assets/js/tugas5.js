// Halaman Kartu Produk: render dinamis, hapus, dan toggle status 
let products = loadProducts();

const getStatusLabel = (isActive) => (isActive ? 'Aktif' : 'Nonaktif');

// 1. Membuat satu kartu (createElement + setAttribute + innerHTML)
const buildCard = (prod) => {
    const card = document.createElement('article');
    card.className = 'product-card dynamic-item';
    card.setAttribute('data-id', prod.id);
    card.dataset.active = prod.active;
    if (!prod.active) card.classList.add('is-inactive');

    card.innerHTML = `
        <span class="category-tag">${escapeHtml(prod.category)}</span>
        <h3 class="product-title">${escapeHtml(prod.name)}</h3>
        <p class="product-price">${formatRupiah(prod.price)}</p>
        <p class="product-stock">Sisa Stok: <span class="badge">${prod.stock}</span></p>
        <p class="product-status">Status: <span class="status-badge${prod.active ? '' : ' inactive'}">${getStatusLabel(prod.active)}</span></p>
        <div class="card-actions">
            <button type="button" class="btn btn-toggle" data-action="toggle" data-id="${prod.id}">Ubah Status</button>
            <button type="button" class="btn btn-delete" data-action="delete" data-id="${prod.id}">Hapus Produk</button>
        </div>
    `;
    return card;
};

// 2. Ringkasan di bagian atas halaman
const updateSummary = () => {
    const activeCount = products.filter((product) => product.active).length;
    $('#stat-total').textContent = products.length;
    $('#stat-active').textContent = activeCount;
    $('#stat-inactive').textContent = products.length - activeCount;
    $('#stat-value').textContent = formatRupiah(getStockValue(products));
    $('#empty-state').hidden = products.length > 0;
};

// 3. Render seluruh kartu ke container
const renderProductCards = (list) => {
    const container = $('#product-container');
    container.innerHTML = '';

    list.forEach((prod, index) => {
        const card = buildCard(prod);
        card.classList.add('enter');              
        container.append(card);
        setTimeout(() => card.classList.remove('enter'), 30 + index * 60);  
    });

    updateSummary();
    console.log(`[RENDER] ${list.length} kartu produk ditampilkan.`);
};

// 4. Toggle status aktif/nonaktif memakai classList.toggle
const handleToggleStatus = (id) => {
    const card = $(`article[data-id="${id}"]`);
    const product = products.find((item) => item.id === id);
    if (!card || !product) return;

    const badge = card.querySelector('.status-badge');
    badge.classList.toggle('inactive');
    card.classList.toggle('is-inactive');

    const isActive = !badge.classList.contains('inactive');
    badge.textContent = getStatusLabel(isActive);
    card.dataset.active = isActive;

    product.active = isActive;
    saveProducts(products);
    updateSummary();
    console.log(`[TOGGLE] Produk ID ${id} (${product.name}) sekarang ${getStatusLabel(isActive)}`);
};

// 5. Hapus kartu: fade-out dulu, baru remove()
const handleDeleteProduct = (id) => {
    const cardToDelete = $(`article[data-id="${id}"]`);
    if (!cardToDelete || cardToDelete.classList.contains('fade-out')) return;

    cardToDelete.classList.add('fade-out');
    setTimeout(() => {
        cardToDelete.remove();
        products = products.filter((item) => item.id !== id);
        saveProducts(products);
        updateSummary();
        console.log(`Elemen produk dengan ID ${id} berhasil dihapus dari antarmuka.`);
        console.log(`[DATA] Sisa produk: ${products.length}`);
    }, 300);
};

document.addEventListener('DOMContentLoaded', () => {
    renderProductCards(products);

    // Event delegation untuk tombol pada kartu (kartu dibuat dinamis)
    $('#product-container').addEventListener('click', (event) => {
        const button = event.target.closest('button[data-action]');
        if (!button) return;
        const id = Number(button.dataset.id);
        if (button.dataset.action === 'toggle') handleToggleStatus(id);
        if (button.dataset.action === 'delete') handleDeleteProduct(id);
    });
});
