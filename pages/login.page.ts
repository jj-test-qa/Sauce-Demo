import { Page, Locator } from "@playwright/test"

export class LoginPage {
    readonly page: Page;
    readonly loginLogoDiv: Locator;
    readonly userNameInput: Locator;
    readonly passWordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessageH3: Locator;


    constructor(page: Page) {
        this.page = page;
        this.loginLogoDiv = page.locator("div.login_logo");
        this.userNameInput = page.locator("#user-name");
        this.passWordInput = page.locator("#password");
        this.loginButton = page.locator("#login-button");
        this.errorMessageH3 = page.locator("[data-test=\"error\"]")
    }

    // Overload signatures
    //async goto(): Promise<void>;
    //async goto(url: string): Promise<void>;

    // Implementation
    async goto(): Promise<void> {
        await this.page.goto('/');
    }
    /*
    async goto(url?: string): Promise<void> {
        if (typeof url === 'string')
            await this.page.goto(url);
        else
            await this.page.goto('/');
    }
    */


    async login(userName: string, passWord: string): Promise<void> {
        await this.userNameInput.fill(userName);
        await this.passWordInput.fill(passWord);
        await this.loginButton.click();
    }

    getErrorMessage(): Locator {
        return this.errorMessageH3;
    }

    getLoginLogoTitle(): Locator {
        return this.loginLogoDiv;
    }
}