Component({
  behaviors: [],
  properties: {
    options: { type: Array, value: [] },
    value: { type: Array, value: [] },
    fieldNames: { type: Object, value: { text: 'text', value: 'value' } },
    color: { type: String, value: '#333' }
  },
  observers: {
    'options,value,fieldNames': function (options, value, fieldNames) {
      if (value.length) {
        this.setData({
          showList: options
            .filter((item: any) => value.includes(item[fieldNames.value]))
            .map((item: any) => item[fieldNames.text])
        })
      } else {
        this.setData({
          showList: []
        })
      }
    }
  },
  data: {
    showList: [] as any[]
  }
})
