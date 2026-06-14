Vue.component('ba-stock-table', {
  template: '#tpl-stock',
  props: {
    items: { type: Array, default: () => [] },
    upbjjList: { type: Array, default: () => [] },
    kategoriList: { type: Array, default: () => [] }
  },
  data() {
    return {
      stagedItems: [],
      formVisible: false,
      editIndex: null,
      hoveredCode: '',
      filters: {
        search: '',
        upbjj: '',
        kategori: '',
        alertOnly: false,
        sortBy: 'judul'
      },
      form: this.emptyForm(),
      errors: {},
      modal: {
        show: false,
        kode: '',
        message: ''
      }
    };
  },
  computed: {
    dependentKategori() {
      if (!this.filters.upbjj) return [];
      const set = new Set(
        this.stagedItems
          .filter((item) => item.upbjj === this.filters.upbjj)
          .map((item) => item.kategori)
      );
      return Array.from(set).sort((a, b) => a.localeCompare(b, 'id-ID'));
    },
    filteredItems() {
      const keyword = this.filters.search.toLowerCase();
      const rows = this.stagedItems.filter((item) => {
        const searchable = `${item.kode} ${item.judul} ${item.kategori} ${item.upbjj} ${item.lokasiRak}`.toLowerCase();
        const matchSearch = !keyword || searchable.includes(keyword);
        const matchArea = !this.filters.upbjj || item.upbjj === this.filters.upbjj;
        const matchKategori = !this.filters.kategori || item.kategori === this.filters.kategori;
        const matchAlert = !this.filters.alertOnly || Number(item.qty) === 0 || Number(item.qty) < Number(item.safety);
        return matchSearch && matchArea && matchKategori && matchAlert;
      });

      return rows.slice().sort((a, b) => {
        if (this.filters.sortBy === 'qty' || this.filters.sortBy === 'harga') {
          return Number(a[this.filters.sortBy]) - Number(b[this.filters.sortBy]);
        }
        return String(a[this.filters.sortBy]).localeCompare(String(b[this.filters.sortBy]), 'id-ID');
      });
    },
    stockStats() {
      return this.stagedItems.reduce((acc, item) => {
        if (Number(item.qty) === 0) acc.kosong += 1;
        else if (Number(item.qty) < Number(item.safety)) acc.menipis += 1;
        else acc.aman += 1;
        return acc;
      }, { aman: 0, menipis: 0, kosong: 0 });
    }
  },
  watch: {
    items: {
      immediate: true,
      deep: true,
      handler(value) {
        this.stagedItems = JSON.parse(JSON.stringify(value || []));
      }
    },
    'filters.upbjj'(newValue, oldValue) {
      if (newValue !== oldValue) this.filters.kategori = '';
    }
  },
  methods: {
    emptyForm() {
      return { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: 0, qty: 0, safety: 0, catatanHTML: '' };
    },
    toggleForm() {
      this.formVisible = !this.formVisible;
      if (!this.formVisible) this.resetForm();
    },
    resetForm() {
      this.form = this.emptyForm();
      this.errors = {};
      this.editIndex = null;
    },
    resetFilters() {
      this.filters = { search: '', upbjj: '', kategori: '', alertOnly: false, sortBy: 'judul' };
    },
    validateForm() {
      const err = {};
      const kode = String(this.form.kode || '').trim().toUpperCase();
      const duplicate = this.stagedItems.some((item, index) => item.kode.toUpperCase() === kode && index !== this.editIndex);
      if (!kode) err.kode = 'Kode wajib diisi.';
      else if (duplicate) err.kode = 'Kode sudah digunakan.';
      if (!this.form.judul) err.judul = 'Nama mata kuliah wajib diisi.';
      if (!this.form.kategori) err.kategori = 'Kategori wajib dipilih.';
      if (!this.form.upbjj) err.upbjj = 'UT-Daerah wajib dipilih.';
      if (!this.form.lokasiRak) err.lokasiRak = 'Lokasi rak wajib diisi.';
      if (this.form.harga === '' || Number(this.form.harga) < 0) err.harga = 'Harga tidak valid.';
      if (this.form.qty === '' || Number(this.form.qty) < 0) err.qty = 'Jumlah stok tidak valid.';
      if (this.form.safety === '' || Number(this.form.safety) < 0) err.safety = 'Safety stock tidak valid.';
      this.errors = err;
      return Object.keys(err).length === 0;
    },
    submitForm() {
      if (!this.validateForm()) return;
      const payload = Object.assign({}, this.form, {
        kode: this.form.kode.trim().toUpperCase(),
        harga: Number(this.form.harga),
        qty: Number(this.form.qty),
        safety: Number(this.form.safety),
        catatanHTML: this.form.catatanHTML || 'Tidak ada catatan.'
      });
      if (this.editIndex === null) {
        this.stagedItems.push(payload);
        this.$emit('notify', 'Data bahan ajar berhasil ditambahkan.');
      } else {
        this.$set(this.stagedItems, this.editIndex, payload);
        this.$emit('notify', 'Data bahan ajar berhasil diperbarui.');
      }
      this.emitStockChange();
      this.formVisible = false;
      this.resetForm();
    },
    editItem(kode) {
      const index = this.stagedItems.findIndex((item) => item.kode === kode);
      if (index < 0) return;
      this.editIndex = index;
      this.form = Object.assign({}, this.stagedItems[index]);
      this.errors = {};
      this.formVisible = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    askDelete(kode) {
      const item = this.stagedItems.find((row) => row.kode === kode);
      if (!item) return;
      this.modal = { show: true, kode, message: `Hapus data ${item.kode} - ${item.judul}?` };
    },
    emitStockChange() {
      this.$emit('stock-updated', JSON.parse(JSON.stringify(this.stagedItems)));
    },
    deleteItem() {
      const index = this.stagedItems.findIndex((item) => item.kode === this.modal.kode);
      if (index >= 0) {
        this.stagedItems.splice(index, 1);
        this.emitStockChange();
        this.$emit('notify', 'Data bahan ajar berhasil dihapus.');
      }
      this.modal.show = false;
    }
  }
});
