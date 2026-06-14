window.ApiService = {
  async loadBahanAjar() {
    try {
      const response = await fetch('data/dataBahanAjar.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('File JSON tidak dapat dibaca.');
      const data = await response.json();
      return this.normalize(data);
    } catch (error) {
      console.warn('Menggunakan fallback data karena fetch JSON gagal:', error.message);
      return this.normalize(window.FALLBACK_DATA);
    }
  },

  normalize(data) {
    const cloned = JSON.parse(JSON.stringify(data || {}));
    cloned.upbjjList = cloned.upbjjList || [];
    cloned.kategoriList = cloned.kategoriList || [];
    cloned.pengirimanList = cloned.pengirimanList || [];
    cloned.paket = cloned.paket || [];
    cloned.stok = cloned.stok || [];
    cloned.tracking = this.normalizeTracking(cloned.tracking || []);
    return cloned;
  },

  normalizeTracking(rows) {
    const result = [];
    rows.forEach((row) => {
      if (row.noDO) {
        result.push(row);
        return;
      }
      Object.keys(row).forEach((key) => {
        result.push(Object.assign({ noDO: key }, row[key]));
      });
    });

    const unique = new Map();
    result.forEach((item) => {
      if (!item || !item.noDO) return;
      unique.set(item.noDO, Object.assign({
        nim: '',
        nama: '',
        status: 'Penerimaan',
        ekspedisi: '',
        tanggalKirim: new Date().toISOString().slice(0, 10),
        paket: '',
        total: 0,
        perjalanan: []
      }, item));
    });
    return Array.from(unique.values());
  }
};
