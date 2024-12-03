import { config } from '@onflow/fcl'

config({
    'app.detail.title': 'Multi-Sig Wallet',
    'app.detail.icon': 'https://placekitten.com/g/200/200',
    'accessNode.api': 'https://rest-testnet.onflow.org',
    'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
    '0xMultiSigWallet': '0x9d2ade18cb6bea1a' // Your deployed contract address
})