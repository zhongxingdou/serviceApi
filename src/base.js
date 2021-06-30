import Vue from 'vue'

export default Vue.extend({
  created() {
    this.emit = this.$emit
    this.on = this.$on
    this.once = this.$once
    this.off = this.$off
  },
})
