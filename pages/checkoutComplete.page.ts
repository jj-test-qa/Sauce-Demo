import { Page, Locator } from "@playwright/test"

export class CheckoutComplete {
    readonly page: Page;

    readonly logoDiv: Locator;
    readonly titleSpan: Locator;
    readonly checkoutComplete: Locator;

    readonly backToHome: Locator;


    constructor(page: Page) {
        this.page = page;

        this.logoDiv = page.locator(".app_logo");
        this.titleSpan = page.locator('[data-test="title"]');
        this.checkoutComplete = page.locator("#checkout_complete_container");
        this.backToHome = page.locator("#back-to-products")
    }

    getImage(): Locator {
        return this.checkoutComplete.locator("img.pony_express");
    }

    getHeader(): Locator {
        return this.checkoutComplete.locator(".complete-header");
    }

    getCompleteText(): Locator {
        return this.checkoutComplete.locator(".complete-text");
    }

    async goBackHome(): Promise<void> {
        await this.backToHome.click();
    }


}