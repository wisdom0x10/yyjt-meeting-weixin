import './store/index'
import { storeDispatch, storeCommit } from 'wxminishareddata'

App<IAppOption>({
  async onLaunch(options) {
    storeCommit('setId', options.query.id ?? 14)
    await storeDispatch('login')
  }
})
