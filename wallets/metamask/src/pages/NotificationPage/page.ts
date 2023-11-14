import type { Page } from '@playwright/test'
import { getNotificationPageAndWaitForLoad } from '../../utils/getNotificationPageAndWaitForLoad'
import { waitFor } from '../../utils/waitFor'
import { connectToDapp, signSimpleMessage, signStructuredMessage } from './actions'
import Selectors from './selectors'

export class NotificationPage {
  static readonly selectors = Selectors
  readonly selectors = Selectors

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async connectToDapp(extensionId: string) {
    await connectToDapp(this.page.context(), extensionId)
  }

  // TODO: Revisit this logic in the future to see if we can increase the performance by utilizing `Promise.race`.
  private async beforeMessageSignature(extensionId: string) {
    const notificationPage = await getNotificationPageAndWaitForLoad(this.page.context(), extensionId)

    // Most of the time, this function will be used to sign structured messages, so we check for the scroll button first.
    const isScrollButtonVisible = await waitFor(
      notificationPage.locator(Selectors.SignaturePage.structuredMessage.scrollDownButton),
      'visible',
      1_500, // TODO: Make this configurable.
      false
    )

    return {
      notificationPage,
      isScrollButtonVisible
    }
  }

  async signMessage(extensionId: string) {
    const { notificationPage, isScrollButtonVisible } = await this.beforeMessageSignature(extensionId)

    if (isScrollButtonVisible) {
      await signStructuredMessage.sign(notificationPage)
    } else {
      await signSimpleMessage.sign(notificationPage)
    }
  }

  async rejectMessage(extensionId: string) {
    const { notificationPage, isScrollButtonVisible } = await this.beforeMessageSignature(extensionId)

    if (isScrollButtonVisible) {
      await signStructuredMessage.reject(notificationPage)
    } else {
      await signSimpleMessage.reject(notificationPage)
    }
  }
}
