import type { Page } from '@playwright/test'
import Selectors from '../selectors'

const signMessage = async (notificationPage: Page) => {
  const scrollDownButton = notificationPage.locator(Selectors.SignaturePage.structuredMessage.scrollDownButton)
  const signButton = notificationPage.locator(Selectors.SignaturePage.structuredMessage.signButton)

  while (await signButton.isDisabled()) {
    await scrollDownButton.click()
  }

  await notificationPage.locator(Selectors.SignaturePage.structuredMessage.signButton).click()
}

const rejectMessage = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.SignaturePage.structuredMessage.rejectButton).click()
}

// Used for:
// - `eth_signTypedData_v3`
// - `eth_signTypedData_v4`
export const signStructuredMessage = {
  sign: signMessage,
  reject: rejectMessage
}
