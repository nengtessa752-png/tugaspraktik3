Vue.component('status-badge', {
  template: '#tpl-badge',
  props: {
    qty: { type: Number, required: true },
    safety: { type: Number, required: true }
  },
  computed: {
    label() {
      if (Number(this.qty) === 0) return 'Kosong';
      if (Number(this.qty) < Number(this.safety)) return 'Menipis';
      return 'Aman';
    },
    icon() {
      if (this.label === 'Kosong') return '🔴';
      if (this.label === 'Menipis') return '🟠';
      return '🟢';
    },
    badgeClass() {
      if (this.label === 'Kosong') return 'badge-danger';
      if (this.label === 'Menipis') return 'badge-warning';
      return 'badge-success';
    }
  }
});
