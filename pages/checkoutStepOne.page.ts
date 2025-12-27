import { Page, Locator } from "@playwright/test"

export class CheckoutStepOne {
    readonly page: Page;

    readonly logoDiv: Locator;
    readonly titleSpan: Locator;

    readonly firstNameInput: Locator
    readonly lastNameInput: Locator;
    readonly zipCodeInput: Locator;

    readonly errorMessage: Locator;

    readonly cancelBtn: Locator;
    readonly continueInput: Locator;

    constructor(page: Page) {
        this.page = page;

        this.logoDiv = page.locator(".app_logo");
        this.titleSpan = page.locator('[data-test="title"]');

        this.firstNameInput = page.locator("[placeholder=\"First Name\"]");
        this.lastNameInput = page.locator("#last-name");
        this.zipCodeInput = page.locator("[name='postalCode']");

        this.errorMessage = page.locator("[data-test='error']")

        this.cancelBtn = page.locator("button:has-text('Cancel')");
        this.continueInput = page.locator('input[value="Continue"]');
    }

    // Overload 1: Accept object
    async enterAddress(user: {
        firstName: string,
        lastName: string,
        zipCode: number
    }): Promise<void>;

    // Overload 2: Accept individual parameters
    async enterAddress(firstName: string, lastName: string, zipCode: number): Promise<void>;

    // Implementation signature
    async enterAddress(
        firstNameOrObject: string | { firstName: string, lastName: string, zipCode: number },
        lastName?: string,
        zipCode?: number
    ): Promise<void> {
        // Handle object case
        if (typeof firstNameOrObject === 'object') {
            await this.firstNameInput.fill(firstNameOrObject.firstName);
            await this.lastNameInput.fill(firstNameOrObject.lastName);
            await this.zipCodeInput.fill(firstNameOrObject.zipCode.toString());
        }
        // Handle individual parameters case
        else {
            // Check if lastName and zipCode are provided
            if (lastName === undefined || zipCode === undefined) {
                throw new Error('Missing required parameters: lastName and zipCode must be provided when using individual parameters');
            }
            await this.firstNameInput.fill(firstNameOrObject);
            await this.lastNameInput.fill(lastName);
            await this.zipCodeInput.fill(zipCode.toString());
        }
    }

    getErrorMessage(): Locator {
        return this.errorMessage;
    }

    async cancel(): Promise<void> {
        await this.cancelBtn.click();
    }

    async continue(): Promise<void> {
        await this.continueInput.click();
    }
}