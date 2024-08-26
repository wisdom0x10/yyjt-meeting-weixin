class Storage {
  static set<T>(key: string, value: T): void {
    try {
      wx.setStorageSync(key, value)
    } catch (e) {
      console.error('Set storage failed:', e)
    }
  }

  static get<T>(key: string, defVal: T | null = null): T | null {
    try {
      const value = wx.getStorageSync(key)
      return value ? (value as T) : defVal
    } catch (e) {
      console.error('Get storage failed:', e)
      return null
    }
  }

  static remove(key: string): void {
    try {
      wx.removeStorageSync(key)
    } catch (e) {
      console.error('Remove storage failed:', e)
    }
  }

  static clear(): void {
    try {
      wx.clearStorageSync()
    } catch (e) {
      console.error('Clear storage failed:', e)
    }
  }
}

export default Storage
