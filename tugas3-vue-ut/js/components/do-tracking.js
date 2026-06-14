Vue.component('do-tracking', {
  template: '#tpl-tracking',
  props: {
    trackingData: { type: Array, default: () => [] }
  },
  data() {
    return {
      search: '',
      selectedNoDO: '',
      statusSteps: ['Pemesanan', 'Penerimaan', 'Dalam Perjalanan', 'Tiba di Tujuan', 'Terkirim'],
      progress: { status: 'Penerimaan', keterangan: '' }
    };
  },
  computed: {
    stats() {
      const terkirim = this.trackingData.filter((item) => item.status === 'Terkirim').length;
      const proses = this.trackingData.length - terkirim;
      const nim = new Set(this.trackingData.map((item) => item.nim)).size;
      return { terkirim, proses, nim };
    },
    displayList() {
      const keyword = this.search.toLowerCase();
      const rows = !keyword ? this.trackingData : this.trackingData.filter((item) => {
        return String(item.noDO).toLowerCase().includes(keyword) || String(item.nim).toLowerCase().includes(keyword);
      });
      return rows.slice().sort((a, b) => String(b.noDO).localeCompare(String(a.noDO), 'id-ID'));
    },
    selectedItem() {
      return this.trackingData.find((item) => item.noDO === this.selectedNoDO) || null;
    },
    currentStepIndex() {
      if (!this.selectedItem) return 0;
      const index = this.statusSteps.indexOf(this.selectedItem.status);
      return index >= 0 ? index : 0;
    },
    reversedTimeline() {
      if (!this.selectedItem) return [];
      return (this.selectedItem.perjalanan || []).slice().reverse();
    }
  },
  watch: {
    selectedItem(newValue) {
      if (newValue) this.progress.status = newValue.status;
    },
    trackingData: {
      immediate: true,
      handler(value) {
        if (!this.selectedNoDO && value.length) this.selectDO(value[0].noDO);
      }
    }
  },
  methods: {
    selectDO(noDO) {
      this.selectedNoDO = noDO;
      const item = this.trackingData.find((row) => row.noDO === noDO);
      if (item) this.progress.status = item.status;
    },
    submitSearch() {
      if (this.displayList.length > 0) this.selectDO(this.displayList[0].noDO);
      else this.selectedNoDO = '';
    },
    clearSearch() {
      this.search = '';
      if (this.trackingData.length) this.selectDO(this.trackingData[0].noDO);
    },
    statusBadgeClass(status) {
      if (status === 'Terkirim') return 'badge-success';
      if (status === 'Dalam Perjalanan') return 'badge-info';
      if (status === 'Tiba di Tujuan') return 'badge-warning';
      return 'badge-muted';
    },
    stepClass(index) {
      if (index < this.currentStepIndex) return 'done';
      if (index === this.currentStepIndex) return 'active';
      return '';
    },
    addProgress() {
      if (!this.selectedItem) return;
      const text = this.progress.keterangan || `Status diperbarui menjadi ${this.progress.status}.`;
      const updated = JSON.parse(JSON.stringify(this.trackingData));
      const index = updated.findIndex((item) => item.noDO === this.selectedItem.noDO);
      if (index < 0) return;
      updated[index].status = this.progress.status;
      updated[index].perjalanan = updated[index].perjalanan || [];
      updated[index].perjalanan.push({ waktu: this.nowText(), keterangan: text });
      this.$emit('tracking-updated', updated);
      this.$emit('notify', 'Progress pengiriman berhasil diperbarui.');
      this.progress.keterangan = '';
    },
    nowText() {
      const d = new Date();
      const pad = (value) => String(value).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }
  }
});
