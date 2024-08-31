Component({
  behaviors: [],
  properties: {
    onChange: { type: Function }
  },
  data: {
    visible: false,
    columns: [
      { text: '杭州', id: 0 },
      { text: '宁波', id: 1 },
      { text: '温州', id: 2 },
      { text: '嘉兴', id: 3 },
      { text: '湖州', id: 4 }
    ]
  },
  lifetimes: {
    created() {},
    attached() {},
    moved() {},
    detached() {}
  },
  methods: {
    open() {
      this.setData({ visible: true })
    },
    close() {
      this.setData({ visible: false })
    },
    onCancel() {
      this.close()
    },
    onConfirm(data: any) {
      this.close()
      this.triggerEvent('change', data.detail.value)
    }
  }
})
