import { match } from 'pinyin-pro'

Component({
  behaviors: [],
  properties: {
    label: String,
    value: Number,
    placeholder: String,
    useSearch: { type: Boolean, value: true },
    maskClick: { type: Boolean, value: true },
    columns: { type: Array, value: [] }
  },
  observers: {
    'search,columns': function (search, columns) {
      if (!!search) {
        this.setData({
          filterColumns: columns.filter((item: any) => match(item.text, search))
        })
      } else {
        this.setData({
          filterColumns: columns
        })
      }
    },
    'value,columns': function (value, columns) {
      const currentItem = columns.find((item: any) => item.value === value)
      if (currentItem) {
        this.setData({ text: currentItem.text, defaultIndex: columns.indexOf(currentItem) })
      }
    },
    'show,value,filterColumns': function (show, value, filterColumns) {
      if (show) {
        if (filterColumns.length) {
          const currentSelect = value
            ? filterColumns.find((item: any) => item.value === value)
            : filterColumns[0]
          this.setData({
            selected: currentSelect
          })
        } else {
          this.setData({
            selected: undefined
          })
        }
      }
    }
  },
  data: {
    show: false,
    text: undefined,
    search: '',
    filterColumns: [] as any[],
    selected: undefined as any,
    defaultIndex: 0
  },
  methods: {
    handleClick() {
      this.setData({
        show: true
      })
    },
    handleSearch(event: any) {
      this.setData({
        search: event.detail
      })
    },
    handleChange(event: any) {
      this.setData({
        selected: event.detail.value
      })
    },
    handleClose() {
      if (this.data.maskClick) {
        this.setData({
          show: false,
          search: ''
        })
      }
    },
    handleCancel() {
      this.setData({ show: false })
    },
    handleConfirm() {
      if (this.data.selected) {
        this.setData({
          show: false,
          search: ''
        })
        this.triggerEvent('change', this.data.selected.value)
      } else {
        wx.showToast({ title: '未选择选项', icon: 'error' })
      }
    }
  }
})
