import { config } from '@onflow/fcl'

config()
  .put('app.detail.title', 'Social Bounty dApp')
  .put('app.detail.icon', 'https://placekitten.com/g/200/200')
  .put('accessNode.api', 'https://rest-testnet.onflow.org')
  .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn')
  .put('0xSocialBounty', '0x9d2ade18cb6bea1a')