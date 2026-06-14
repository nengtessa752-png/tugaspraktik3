Vue.filter('rupiah', function(value) {
  return 'Rp ' + Number(value || 0).toLocaleString('id-ID');
});

Vue.filter('buah', function(value) {
  return Number(value || 0).toLocaleString('id-ID') + ' buah';
});

Vue.filter('tanggalId', function(value) {
  if (!value) return '-';
  const date = new Date(value + 'T00:00:00');
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
});

Vue.filter('datetimeId', function(value) {
  if (!value) return '-';
  const normalized = String(value).replace(' ', 'T');
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'medium' });
});

new Vue({
  el: '#app',
  data: {
    tab: 'home',
    isLoading: true,
    toast: { show: false, message: '', type: 'success' },
    state: {
      upbjjList: [],
      kategoriList: [],
      pengirimanList: [],
      paket: [],
      stok: [],
      tracking: []
    }
  },
  watch: {
    'state.stok': {
      deep: true,
      handler(value) {
        localStorage.setItem('tp3_stok', JSON.stringify(value));
      }
    },
    'state.tracking': {
      deep: true,
      handler(value) {
        localStorage.setItem('tp3_tracking', JSON.stringify(value));
      }
    }
  },
  async created() {
    const data = await ApiService.loadBahanAjar();
    const savedStok = this.readStorage('tp3_stok', data.stok);
    const savedTracking = this.readStorage('tp3_tracking', data.tracking);
    this.state = Object.assign({}, data, { stok: savedStok, tracking: savedTracking });
    this.isLoading = false;
  },
  methods: {
    setTab(name) {
      this.tab = name;
    },
    readStorage(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (error) {
        return fallback;
      }
    },
    handleStockUpdated(rows) {
      this.state.stok = rows;
    },
    handleOrderCreated(order) {
      this.state.tracking = [order].concat(this.state.tracking);
      this.showToast(`Delivery Order ${order.noDO} berhasil dibuat.`);
      this.tab = 'tracking';
    },
    handleTrackingUpdated(rows) {
      this.state.tracking = rows;
    },
    showToast(message, type = 'success') {
      this.toast = { show: true, message, type };
      window.clearTimeout(this.toastTimer);
      this.toastTimer = window.setTimeout(() => {
        this.toast.show = false;
      }, 2800);
    },
    resetSampleData() {
      localStorage.removeItem('tp3_stok');
      localStorage.removeItem('tp3_tracking');
      location.reload();
    }
  }
});
