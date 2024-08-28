import { formatToDateTime } from '../../utils/date'
import { themeMixin } from '../../behaviors/theme'
import { effect, getStoreData, storeCommit } from 'wxminishareddata'

Page({
  behaviors: [themeMixin],
  data: {
    title: '会议主题',
    type: '会议类型',
    tags: [
      { color: 'red', text: '测试' },
      { color: 'blue', text: '测试测试' },
      { color: 'green', text: '测试测试测试' },
      { color: 'yellow', text: '测试' },
      { color: '#f2826a', text: '测试测试' },
      { color: '#7232dd', text: '测试测试测试' },
      { color: '#7232dd', text: '测试' },
      { color: '#ffe1e1', text: '测试测试' },
      { color: '#789536', text: '测试测试测试' }
    ],
    time: formatToDateTime('2024-05-01 12:00:00'),
    address: '会议地点',
    internal: [
      '张<15300000000>',
      '王<15300000000>',
      '李<15300000000>',
      '孙<15300000000>'
    ],
    content: '<p style="height:2000px">content</p><p>end</p>',
    decision: '<p>decision</p>',
    external: '参会人员(外部)',
    taskList: [
      {
        id: 0,
        title: '工作任务',
        description: 'description_56abca5340f0',
        meetingId: 0,
        header: 'header_666ba9c35363',
        headerList: ['张<15300000000>', '王<15300000000>'],
        endTime: '2024-08-27 15:07:34',
        statusText: 'statusText_b37ccedb2fec',
        statusValue: 0,
        expectedResult: 'expectedResult_49a42086c63f',
        criterion: 'criterion_77c775f20be6',
        incentiveMeasures:
          '这是一个很长的文本内容，它会自动换行，它会自动换行这是一个很长的文本内容，它会自动换行这是一个很长的文本内容，它会自动换行这是一个很长的文本内容，它会自动换行这是一个很长的文本内容，它会自动换行这是一个很长的文本内容，它会自动换行',
        checker: 'checker_1dbfd84768e0',
        checkerList: ['张<15300000000>', '王<15300000000>'],
        checkValue: 0,
        checkText: 'checkText_cf980e8885db'
      }
    ],
    remark: '备注',

    visible: false,
    mode: 'content'
  },
  handleOpen(event: any) {
    const {
      target: { dataset }
    } = event

    switch (dataset.mode) {
      case 'content':
        this.setData({ visible: true, mode: 'content' })
        break
      case 'decision':
        this.setData({ visible: true, mode: 'decision' })
        break
      case 'task':
        this.setData({ visible: true, mode: 'task' })
        break
      default:
    }
  },
  handleClose() {
    this.setData({ visible: false })
  },
  async onLoad(options: any) {
    effect(
      () => {
        this.setData({
          text: getStoreData().appName
        })
      },
      {
        scheduler: (fn: any) => {
          fn()
        },
        lazy: true
      }
    )
  }
})
