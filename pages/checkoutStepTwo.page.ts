import { Page, Locator } from "@playwright/test"

export class CheckoutStepTwo {
    readonly page: Page;
    readonly addedItems: {}[]; // internal array of objects that keeps track of what was added to the cart
    private _cartCount: number;
    private _cartTotal: number;

    readonly logo: Locator;
    readonly title: Locator;
    readonly cartQtyLabel: Locator;
    readonly cartDescLabel: Locator;

    readonly cartItems: Locator;

    readonly shippingMethod: Locator;

    readonly subtotal: Locator;
    readonly tax: Locator;
    readonly total: Locator;

    readonly cancelBtn: Locator;
    readonly finishBtn: Locator;

    constructor(page: Page);
    constructor(page: Page, addedItems: {}[], cartCount: number, cartTotal: number);

    constructor(page: Page, addedItems?: {}[], cartCount?: number, cartTotal?: number) {
        this.page = page;

        this.logo = page.locator(".app_logo");
        this.title = page.locator(".title");

        this.cartQtyLabel = page.locator(".cart_quantity");
        this.cartDescLabel = page.locator(".inventory_item_desc");
        this.cartItems = page.locator("[data-test='inventory-item']"); // this matches the number of items in the cart

        this.shippingMethod = page.locator("[data-test=\"shipping-info-label\"] + [data-test=\"shipping-info-value\"]")

        this.cancelBtn = page.locator('#cancel');
        this.finishBtn = page.locator("button[name=\"finish\"]");

        this.subtotal = page.locator("[data-test='subtotal-label']");
        this.tax = page.locator("[data-test='tax-label']");
        this.total = page.locator("[data-test=\"total-label\"]");

        // Initialize with defaults first
        this.addedItems = [];
        this._cartCount = -1;
        this._cartTotal = -1;

        // Then override if valid parameters are provided
        if (Array.isArray(addedItems) && typeof cartCount === 'number' && typeof cartTotal === 'number') {
            if (addedItems.every(item => typeof item === 'object' && item !== null && !Array.isArray(item))) {
                this.addedItems = addedItems;
                this._cartCount = cartCount;
                this._cartTotal = cartTotal;
            }
        }
    }

    async goBack(): Promise<void> {
        await this.cancelBtn.click();
    }

    async getInventoryItems(): Promise<{
        name: string,
        description: string,
        price: string
    }[]> {
        const names = await this.cartItems.locator("[data-test=\"inventory-item-name\"]").allInnerTexts();
        const descriptions = await this.cartItems.locator("[data-test='inventory-item-desc']").allInnerTexts();
        const prices = await this.cartItems.locator("[data-test='inventory-item-price']").allInnerTexts();

        return names.map((name, index) => ({
            name,
            description: descriptions[index],
            price: prices[index]
        }));
    }

    async getButtons(): Promise<Locator[]> {
        return await this.cartItems.locator("button[name^='remove']").all();
    }

    async scrollToTax(){
        await this.tax.scrollIntoViewIfNeeded();
    }

    getShippingMethod(): Locator {
        return this.shippingMethod;
    }

    getSubtotal(): Locator {
        return this.subtotal;
    }

    getTax(): Locator {
        return this.tax;
    }

    getTotal(): Locator {
        return this.total;
    }


    async finish(): Promise<void> {
        await this.finishBtn.click();
    }

    async sumCartItems(): Promise<number> {
        return (await this.cartItems.locator(".inventory_item_price").allTextContents()).map(el => Number(el.replace("$", ""))).reduce((acc, curr) => acc + curr, 0);
    }


}