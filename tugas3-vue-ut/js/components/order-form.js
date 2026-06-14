Vue.component('order-form', {
  template: '#tpl-order',
  props: {
    paketList: { type: Array, default: () => [] },
    pengirimanList: { type: Array, default: () => [] },
    trackingData: { type: Array, default: () => [] },
    stokList: { type: Array, default: () => [] }
  },
  data() {
    return {
      statusSteps: ['Pemesanan', 'Penerimaan', 'Dalam Perjalanan', 'Tiba di Tujuan', 'Terkirim'],
      form: this.emptyForm(),
      errors: {}
    };
  },
  computed: {
    generatedNoDO() {
      const year = new Date().getFullYear();
      const prefix = `DO${year}-`;
      const max = this.trackingData
        .map((item) => String(item.noDO || ''))
        .filter((no) => no.startsWith(prefix))
        .map((no) => Number(no.replace(prefix, '')) || 0)
        .reduce((a, b) => Math.max(a, b), 0);
      return `${prefix}${String(max + 1).padStart(3, '0')}`;
    },
    selectedPaket() {
      return this.paketList.find((item) => item.kode === this.form.paket) || null;
    }
  },
  watch: {
    selectedPaket(newValue) {
      this.form.total = newValue ? Number(newValue.harga) : 0;
    },
    generatedNoDO: {
      immediate: true,
      handler(value) {
        this.form.noDO = value;
      }
    }
  },
  created() {
    this.form.tanggalKirim = new Date().toISOString().slice(0, 10);
    this.form.status = 'Penerimaan';
  },
  methods: {
    emptyForm() {
      return { noDO: '', nim: '', nama: '', ekspedisi: '', paket: '', tanggalKirim: '', total: 0, status: 'Penerimaan' };
    },
    courseName(kode) {
      const row = this.stokList.find((item) => item.kode === kode);
      return row ? row.judul : 'Data bahan ajar tidak ditemukan';
    },
    resetForm() {
      this.form = this.emptyForm();
      this.form.noDO = this.generatedNoDO;
      this.form.tanggalKirim = new Date().toISOString().slice(0, 10);
      this.form.status = 'Penerimaan';
      this.errors = {};
    },
    validate() {
      const err = {};
      if (!this.form.nim) err.nim = 'NIM wajib diisi.';
      else if (!/^\d{5,}$/.test(this.form.nim)) err.nim = 'NIM minimal 5 digit angka.';
      if (!this.form.nama) err.nama = 'Nama wajib diisi.';
      if (!this.form.ekspedisi) err.ekspedisi = 'Ekspedisi wajib dipilih.';
      if (!this.form.paket) err.paket = 'Paket bahan ajar wajib dipilih.';
      if (!this.form.tanggalKirim) err.tanggalKirim = 'Tanggal kirim wajib diisi.';
      this.errors = err;
      return Object.keys(err).length === 0;
    },
    submitOrder() {
      this.form.noDO = this.generatedNoDO;
      if (!this.validate()) return;
      const newOrder = Object.assign({}, this.form, {
        total: Number(this.form.total),
        perjalanan: [{
          waktu: this.nowText(),
          keterangan: `Delivery Order dibuat dengan status ${this.form.status}.`
        }]
      });
      this.$emit('created', newOrder);
      this.resetForm();
    },
    nowText() {
      const d = new Date();
      const pad = (value) => String(value).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }
  }
});
