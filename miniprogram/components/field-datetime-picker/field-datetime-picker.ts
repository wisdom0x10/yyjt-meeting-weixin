import { formatToDate, formatToDateTime, formatToTime } from '../../utils/date'
import dayjs from 'dayjs'

Component({
  behaviors: [],
  properties: {
    label: String,
    value: String,
    placeholder: { type: String, default: '' },
    type: { type: String, value: 'datetime' },
    min: { type: String }
  },
  observers: {
    value(data) {
      const now = new Date()
      now.setMinutes(0)
      now.setSeconds(0)
      this.setData({
        pickerValue: data ? dayjs(data).valueOf() : now.getTime()
      })
    },
    min(min) {
      this.setData({ minDate: min ? dayjs(min).valueOf() : undefined })
    }
  },
  data: {
    show: false,
    pickerValue: undefined as number | undefined,
    filter(type: string, options: any) {
      if (type === 'minute') {
        return options.filter((option: any) => option % 5 === 0)
      }

      return options
    },
    minDate: undefined as any
  },
  methods: {
    handleClick() {
      this.setData({ show: true })
    },
    handleConfirm(event: any) {
      if (this.data.type === 'date') {
        this.triggerEvent('change', formatToDate(event.detail))
      } else if (this.data.type === 'datetime') {
        this.triggerEvent('change', formatToDateTime(event.detail))
      } else if (this.data.type === 'time') {
        this.triggerEvent('change', formatToTime(event.detail))
      }
      this.setData({ show: false })
    },
    handleCancel() {
      this.setData({ show: false })
    },
    handleClose() {
      this.setData({ show: false })
    }
  }
})
