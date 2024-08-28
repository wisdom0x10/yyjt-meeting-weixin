export const themeMixin = Behavior({
  data: {
    theme: 'light'
  },
  methods: {
    changeTheme(this: any, theme: 'light' | 'dark') {
      this.setData({ theme })
    },
    setDarkTheme() {
      this.changeTheme('dark')
    },
    setLightTheme() {
      this.changeTheme('light')
    }
  }
})
