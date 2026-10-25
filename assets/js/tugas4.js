// Halaman Kelola Produk: Tambah, Edit, Hapus, Cari
let products = loadProducts();
let editingId = null;   // null = mode tambah, angka = ID produk yang sedang diedit
let highlightId = null; // baris yang diberi efek sorot setelah ditambah/diedit

// ---------- Helper ----------
const showFeedback = (message, type) => {
    const box = $('#form-feedback');
    box.textContent = message;
    box.className = message ? `feedback-msg ${type}` : 'feedback-msg';
};

const MIN_PRICE = 1000; // sama dengan atribut min pada input price

const getFormValues = () => ({
    name: $('#product-name').value.trim(),
    category: $('#product-category').value,
    price: parseFloat($('#product-price').value),
    stock: parseFloat($('#product-stock').value) // tidak dibulatkan agar desimal bisa ditolak
});

const validateProduct = (data) => {
    if (!data.name) return 'Name wajib diisi!';
    // Nama tidak boleh kembar (abaikan huruf besar/kecil); produk yang sedang diedit dikecualikan
    const isDuplicate = products.some((item) => item.id !== editingId && item.name.toLowerCase() === data.name.toLowerCase());
    if (isDuplicate) return `Produk dengan name '${data.name}' sudah ada!`;
    if (data.category === '') return 'Silakan pilih categori produk!';
    if (isNaN(data.price) || data.price <= 0) return 'Price harus berupa angka lebih dari 0!';
    if (data.price < MIN_PRICE) return 'Price minimal Rp 1.000!';
    if (isNaN(data.stock) || data.stock < 0) return 'Stok harus berupa angka 0 atau lebih!';
    if (!Number.isInteger(data.stock)) return 'Stok harus berupa bilangan bulat!';
    return null;
};

// ---------- Render ----------
const renderPreview = () => {
    const container = $('#live-preview');
    const data = getFormValues();
    const hasPrice = !isNaN(data.price) && data.price > 0;
    const hasStock = !isNaN(data.stock) && data.stock >= 0;

    if (!data.name && data.category === '' && !hasPrice && !hasStock) {
        container.textContent = 'Belum ada data. Mulai isi form di samping.';
        container.className = 'preview-box empty';
        return;
    }

    const lines = [
        `Name: ${data.name || '-'}`,
        `Categori: ${data.category || '-'}`,
        `Price: ${hasPrice ? formatRupiah(data.price) : '-'}`,
        `Stok: ${hasStock ? data.stock : '-'}`,
        `Nilai stok: ${hasPrice && hasStock ? formatRupiah(data.price * data.stock) : '-'}`
    ];

    container.textContent = '';
    lines.forEach((line) => {
        const p = document.createElement('p');
        p.textContent = line;
        container.append(p);
    });
    container.className = 'preview-box';
};

// Pencarian (nama/kategori) digabung dengan filter kategori
const getVisibleProducts = () => {
    const keyword = $('#search-input').value.trim().toLowerCase();
    const category = $('#filter-category').value;
    return products.filter((product) => {
        const matchCategory = category === 'Semua' || product.category === category;
        const matchKeyword = keyword === ''
            || product.name.toLowerCase().includes(keyword)
            || product.category.toLowerCase().includes(keyword);
        return matchCategory && matchKeyword;
    });
};

const renderTable = () => {
    const tbody = $('#product-table-body');
    const visible = getVisibleProducts();
    tbody.innerHTML = '';

    if (visible.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 6;
        cell.className = 'empty-row';
        cell.textContent = 'Tidak ada produk yang cocok.';
        row.append(cell);
        tbody.append(row);
    }

    visible.forEach((product) => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', product.id);
        if (product.id === editingId) row.classList.add('editing');
        if (product.id === highlightId) row.classList.add('row-new');

        [product.id, product.name, product.category, formatRupiah(product.price), product.stock].forEach((value) => {
            const td = document.createElement('td');
            td.textContent = value;
            row.append(td);
        });

        const actions = document.createElement('td');
        actions.className = 'action-cell';
        actions.innerHTML = `
            <button type="button" class="btn btn-small btn-edit" data-action="edit" data-id="${product.id}">Edit</button>
            <button type="button" class="btn btn-small btn-delete" data-action="delete" data-id="${product.id}">Hapus</button>
        `;
        row.append(actions);
        tbody.append(row);
    });

    $('#stock-summary').textContent =
        `Menampilkan ${visible.length} dari ${products.length} produk | Total nilai stok: ${formatRupiah(getStockValue(visible))}`;
    highlightId = null;
};

// ---------- Mode Tambah / Edit ----------
const enterEditMode = (id) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;

    editingId = id;
    $('#product-name').value = product.name;
    $('#product-category').value = product.category;
    $('#product-price').value = product.price;
    $('#product-stock').value = product.stock;

    $('#form-title').textContent = 'Edit Produk';
    $('#btn-submit').textContent = 'Simpan Perubahan';
    $('#btn-cancel').hidden = false;

    showFeedback(`Mengedit produk ID ${id}: ${product.name}`, 'info');
    renderPreview();
    renderTable();
    $('#product-name').focus();
    console.log('[EDIT] Mode edit dibuka untuk produk:', product);
};

const exitEditMode = () => {
    editingId = null;
    $('#product-form').reset();
    $('#form-title').textContent = 'Tambah Produk Baru';
    $('#btn-submit').textContent = 'Simpan Produk';
    $('#btn-cancel').hidden = true;
    renderPreview();
};

// ---------- Hapus ----------
const handleDeleteProduct = (id) => {
    const product = products.find((item) => item.id === id);
    const row = $(`tr[data-id="${id}"]`);
    if (!product || (row && row.classList.contains('fade-out'))) return;

    const finishDelete = () => {
        products = products.filter((item) => item.id !== id);
        saveProducts(products);
        if (editingId === id) exitEditMode();
        renderTable();
        showFeedback(`Produk '${product.name}' berhasil dihapus.`, 'success');
        console.log(`[HAPUS] Produk ID ${id} (${product.name}) dihapus. Sisa produk: ${products.length}`);
        console.table(products);
    };

    if (row) {
        row.classList.add('fade-out');     
        setTimeout(finishDelete, 300);
    } else {
        finishDelete();
    }
};

// ---------- Inisialisasi event ----------
document.addEventListener('DOMContentLoaded', () => {
    const form = $('#product-form');

    renderPreview();
    renderTable();
    console.log(`Data produk dimuat: ${products.length} produk`);
    console.table(products);

    // Live preview (Pertemuan 4)
    form.addEventListener('input', renderPreview);
    form.addEventListener('change', renderPreview);

    // Tambah / Edit
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const data = getFormValues();
        const errorMessage = validateProduct(data);
        if (errorMessage) {
            showFeedback(errorMessage, 'error');
            console.warn('[VALIDASI] Gagal:', errorMessage);
            return;
        }

        let message;
        const index = products.findIndex((item) => item.id === editingId);

        if (editingId !== null && index !== -1) {
            products[index] = { ...products[index], ...data };
            highlightId = editingId;
            message = `Produk '${data.name}' berhasil diperbarui.`;
            console.log('[EDIT] Produk diperbarui:', products[index]);
            exitEditMode();
        } else {
            const newProduct = { id: getNextId(products), ...data, active: true };
            products.push(newProduct);
            highlightId = newProduct.id;
            message = `Sukses! Produk '${newProduct.name}' (${formatRupiah(newProduct.price)}, stok ${newProduct.stock}) tersimpan.`;
            console.log('[TAMBAH] Produk baru ditambahkan:', newProduct);
            form.reset();
            renderPreview();
        }

        saveProducts(products);
        renderTable();
        showFeedback(message, 'success');
        console.table(products);
    });

    $('#btn-clear').addEventListener('click', () => {
        if (editingId !== null) {
            exitEditMode();
            renderTable();
        } else {
            form.reset();
            renderPreview();
        }
        showFeedback('', '');
    });

    $('#btn-cancel').addEventListener('click', () => {
        exitEditMode();
        renderTable();
        showFeedback('Edit dibatalkan.', 'info');
        console.log('[EDIT] Dibatalkan.');
    });

    // untuk semua tombol Edit/Hapus di tabel
    $('#product-table-body').addEventListener('click', (event) => {
        const button = event.target.closest('button[data-action]');
        if (!button) return;
        const id = Number(button.dataset.id);
        if (button.dataset.action === 'edit') enterEditMode(id);
        if (button.dataset.action === 'delete') handleDeleteProduct(id);
    });

    // Pencarian dan filter
    $('#search-input').addEventListener('input', () => {
        renderTable();
        const keyword = $('#search-input').value.trim();
        console.log(`[CARI] Kata kunci "${keyword}" -> ${getVisibleProducts().length} produk ditemukan`);
    });

    $('#filter-category').addEventListener('change', () => {
        renderTable();
        console.log(`[FILTER] Kategori "${$('#filter-category').value}" -> ${getVisibleProducts().length} produk`);
    });

    // Kembalikan data awal
    $('#btn-reset-data').addEventListener('click', () => {
        products = resetProducts();
        $('#search-input').value = '';
        $('#filter-category').value = 'Semua';
        exitEditMode();
        renderTable();
        showFeedback('Data dikembalikan ke dataset awal.', 'info');
        console.log('[RESET] Data dikembalikan ke dataset awal:', products.length, 'produk');
    });
});