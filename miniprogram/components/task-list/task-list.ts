Component({
  behaviors: [],
  properties: {
    data: { type: Array, value: [] },
    activityKey: { type: String, value: 'id' },
    expandAll: { type: Boolean }
  },
  data: {
    activeNames: []
  },
  lifetimes: {
    ready(this: any) {
      const {
        properties: { data, activityKey, expandAll }
      } = this

      if (expandAll) {
        this.setData({
          activeNames: data.map((item: any) => item[activityKey])
        })
      }
    }
  },
  methods: {
    onChange(this: any, event: any) {
      this.setData({ activeNames: event.detail })
    }
  }
})
