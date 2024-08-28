Component({
  properties: {
    value: { type: Object, value: { headerList: [] } }
  },
  lifetimes: {
    ready(this: any) {
      console.log('lifetimes :>> ', this.properties.value)
    }
  },
  methods: {
    getTag(value) {
      console.log('value :>> ', value)
      return 1
    }
  }
})
