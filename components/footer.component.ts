import { Locator, Page } from "@playwright/test"

export class FooterComponent {
    readonly page: Page;

    readonly twitterLink: Locator;
    readonly facebookLink: Locator;
    readonly linkedinLink: Locator;

    readonly footerDiv: Locator;

    constructor(page: Page) {
        this.page = page;
        this.twitterLink = page.locator("[data-test=\"social-twitter\"]");
        this.facebookLink = page.locator('xpath=//a[text()="Facebook"]');
        this.linkedinLink = page.locator('a[data-test="social-linkedin"]');

        this.footerDiv = page.locator('[data-test="footer-copy"]');
    }

    async goToTwitterSocial(): Promise<void> {
        await this.twitterLink.click();
    }

    async goToFaceBookSocial(): Promise<void> {
        await this.facebookLink.click();
    }

    async goToLinkedInSocial(): Promise<void> {
        await this.linkedinLink.click();
    }

    getFooterMessage(): Locator {
        return this.footerDiv;
    }
}