import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'y15xx98w',
    dataset: 'production'
  },
  deployment: {
    appId: 'wlybp3vqsrdrxrp1zcb3h9wk',
    autoUpdates: true,
  }
})
