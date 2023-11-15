import { testWithSynpress } from 'fixtures'
import { MetaMask, unlockForFixture } from '../../../src'

import connectedSetup from '../wallet-setup/connected.setup'

const test = testWithSynpress(connectedSetup, unlockForFixture)

const { expect, describe } = test

describe('when adding a new network', () => {
  test('should switch to the new network', async ({ context, metamaskPage, page, extensionId }) => {
    const metamask = new MetaMask(context, metamaskPage, connectedSetup.walletPassword, extensionId)

    await page.goto('https://metamask.github.io/test-dapp/')

    await expect(page.locator('#chainId')).toHaveText('0x1')

    await page.locator('#addEthereumChain').click()

    await metamask.approveNewNetwork()
    await metamask.approveSwitchNetwork()

    await expect(page.locator('#chainId')).toHaveText('0x53a')
  })
})

test('should switch to the requested network', async ({ context, metamaskPage, page, extensionId }) => {
  const metamask = new MetaMask(context, metamaskPage, connectedSetup.walletPassword, extensionId)

  await page.goto('https://metamask.github.io/test-dapp/')

  await page.locator('#addEthereumChain').click()

  await metamask.approveNewNetwork()
  await metamask.rejectSwitchNetwork()

  await expect(page.locator('#chainId')).toHaveText('0x1')

  await page.locator('#switchEthereumChain').click()

  await metamask.approveSwitchNetwork()

  await expect(page.locator('#chainId')).toHaveText('0x53a')
})
