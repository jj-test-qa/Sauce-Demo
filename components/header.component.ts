import { Locator, Page } from "@playwright/test"

export class HeaderComponent {
    readonly page: Page;

    readonly burgerMenuBtn: Locator;
    readonly burgerVisibility: Locator;
    readonly closeBurgerMenuBtn: Locator;
    readonly allItemsLink: Locator;
    readonly abountLink: Locator;
    readonly logoutLink: Locator;
    readonly resetAppStateLink: Locator;

    constructor(page: Page) {
        this.page = page;

        this.burgerMenuBtn = page.locator("#react-burger-menu-btn");
        this.burgerVisibility = page.locator(".bm-menu-wrap");
        this.closeBurgerMenuBtn = page.locator("#react-burger-cross-btn");

        this.allItemsLink = page.locator("#inventory_sidebar_link");
        this.abountLink = page.locator("#about_sidebar_link");
        this.logoutLink = page.locator("#logout_sidebar_link");
        this.resetAppStateLink = page.locator("#reset_sidebar_link");
    }

    getBurgerMenu(): Locator {
        return this.burgerMenuBtn;
    }

    getBurgerVisibility(): Locator {
        return this.burgerVisibility;
    }

    async openBurgerMenu(): Promise<void> {
        await this.burgerMenuBtn.click();
    }

    async logOut(){
        await this.logoutLink.click()
    }

    async closeBurgerMenu(): Promise<void> {
        await this.closeBurgerMenuBtn.click();
    }
}