import { match } from 'pinyin-pro'
import { throttle } from '../../utils/common'

Page({
  data: {
    eventChannel: null as any,
    multiple: true,
    showAnchor: true,

    originList: [] as any[],
    allList: [] as any[],
    filterList: [] as any[],

    search: '',
    scrollTop: 0,
    selected: [] as number[]
  },
  async initUserList(data: any[]) {
    const map = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z'
    ]
    const list: any[][] = [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
    const all = data.slice().map((item: any) => {
      return { ...item, selected: this.data.selected.includes(item.value) }
    })
    for (let keyIndex = 0; keyIndex < map.length; keyIndex++) {
      const key = map[keyIndex]
      for (let itemIndex = all.length - 1; itemIndex > -1; itemIndex--) {
        const item = all[itemIndex]
        if (match(item.text[0], key)) {
          const [target] = all.splice(itemIndex, 1)
          list[keyIndex].push(target)
        }
      }
    }

    this.setData({
      allList: map
        .map((key, index) => {
          return { key, children: list[index] }
        })
        .filter((_) => _.children.length !== 0),
      originList: list.flat()
    })
  },
  handleSearch(event: any) {
    this.setData({
      search: event.detail,
      filterList: this.data.originList.filter((item) => match(item.text, event.detail))
    })
  },
  handleCancel() {
    this.setData({ search: '', filterList: [] })
  },
  handleClick(event: any) {
    const value = event.currentTarget.dataset.value
    const keyIndex = event.currentTarget.dataset.keyIndex
    const itemIndex = event.currentTarget.dataset.itemIndex
    if (this.data.multiple) {
      // 设置选中状态
      const item = this.data.allList[keyIndex].children[itemIndex]
      item.selected = !item.selected
    } else {
      this.data.originList.forEach((item: any) => {
        if (item.value === value) {
          item.selected = !item.selected
        } else {
          item.selected = false
        }
      })
    }

    const index = this.data.selected.indexOf(value)
    if (index === -1) {
      this.setData({
        selected: this.data.multiple ? [...this.data.selected, value] : [value],
        allList: [...this.data.allList]
      })
    } else {
      this.data.selected.splice(index, 1)
      this.setData({
        selected: [...this.data.selected],
        allList: [...this.data.allList]
      })
    }

    this.data.eventChannel.emit('change', this.data.selected)
  },
  handleFilterClick(event: any) {
    const value = event.currentTarget.dataset.value
    const itemIndex = event.currentTarget.dataset.index
    // 设置选中状态
    const item = this.data.filterList[itemIndex]
    item.selected = !item.selected

    const index = this.data.selected.indexOf(value)
    if (index === -1) {
      this.setData({
        selected: [...this.data.selected, value],
        allList: [...this.data.allList],
        filterList: [...this.data.filterList]
      })
    } else {
      this.data.selected.splice(index, 1)
      this.setData({
        selected: [...this.data.selected],
        allList: [...this.data.allList],
        filterList: [...this.data.filterList]
      })
    }

    this.data.eventChannel.emit('change', this.data.selected)
  },
  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    this.setData({ eventChannel })
    eventChannel.on('init', (data) => {
      this.setData({
        selected: data.selected,
        multiple: data.multiple,
        showAnchor: data.showAnchor
      })
      this.initUserList(data.list)
    })
  },
  setPageScroll: throttle(function (this: any, scrollTop: number) {
    this.setData({ scrollTop })
  }, 300),
  onPageScroll(event: any) {
    this.setPageScroll(event.scrollTop)
  }
})
