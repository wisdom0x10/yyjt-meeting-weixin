Page({
  data: {
    eventChannel: null as any,

    content: '',
    loaded: false
  },
  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    this.setData({ eventChannel })
    eventChannel.on('init', (data) => {
      this.setData({ content: data.content, loaded: true })
    })
  },
  handleInput(event: any) {
    this.data.eventChannel.emit('change', event.detail.html)
  }
})
