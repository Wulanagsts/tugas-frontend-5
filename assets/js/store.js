// Fungsi bersama untuk kedua halaman 
// Data disimpan di localStorage agar perubahan di satu halaman terlihat di halaman lain.
const STORAGE_KEY = 'katalogUmkmProducts';

// Pembantu: ambil satu elemen dengan CSS selector
const $ = (selector) => document.querySelector(selector);

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
};

// Mengamankan teks dari input pengguna sebelum disisipkan lewat innerHTML
const escapeHtml = (text) => {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(text).replace(/[&<>"']/g, (char) => map[char]);
};

const cloneSeed = () => ProductDataset.map((product) => ({ ...product }));

// Hanya menerima data yang bentuknya benar; properti active yang hilang dianggap aktif
const normalizeProducts = (list) => list
    .filter((p) => p && typeof p === 'object' && Number.isFinite(p.id) && typeof p.name === 'string'
        && Number.isFinite(p.price) && Number.isFinite(p.stock))
    .map((p) => ({ ...p, category: String(p.category ?? ''), active: p.active !== false }));

const loadProducts = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                const valid = normalizeProducts(parsed);
                if (valid.length > 0 || parsed.length === 0) return valid;
                console.warn('Data tersimpan tidak valid, memakai data awal.');
            }
        }
    } catch (error) {
        console.warn('Gagal membaca localStorage, memakai data awal:', error);
    }
    return cloneSeed();
};

const saveProducts = (products) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
        console.warn('Gagal menyimpan ke localStorage:', error);
    }
};

const resetProducts = () => {
    const seed = cloneSeed();
    saveProducts(seed);
    return seed;
};

// ID baru = ID terbesar + 1 (aman walaupun ada produk yang sudah dihapus)
const getNextId = (products) => products.reduce((max, product) => Math.max(max, product.id), 0) + 1;

const getStockValue = (products) => products.reduce((total, product) => total + product.price * product.stock, 0);