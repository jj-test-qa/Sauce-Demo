import { Page, Locator } from "@playwright/test"

export class CartPage {
    readonly page: Page;
    readonly addedItems: {}[]; // internal array of objects that keeps track of what was added to the cart
    private _cartCount: number;
    private _cartTotal: number;

    readonly logo: Locator;
    readonly title: Locator;
    readonly cartQtyLabel: Locator;
    readonly cartDescLabel: Locator;

    readonly cartItems: Locator;

    readonly continueShoppingBtn: Locator;
    readonly checkoutBtn: Locator;

    constructor(page: Page);
    constructor(page: Page, addedItems: {}[], cartCount: number, cartTotal: number);

    constructor(page: Page, addedItems?: {}[], cartCount?: number, cartTotal?: number) {
        this.page = page;

        this.logo = page.locator(".app_logo");
        this.title = page.locator(".title");

        this.cartQtyLabel = page.locator("[data-test=\"cart-quantity-label\"]");
        this.cartDescLabel = page.locator("div.cart_desc_label");
        this.cartItems = page.locator(".cart_item"); // this matches the number of items in the cart

        this.continueShoppingBtn = page.locator('#continue-shopping');
        this.checkoutBtn = page.locator("[name='checkout']");

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
        await this.continueShoppingBtn.click();
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

    async checkOut(): Promise<void> {
        await this.checkoutBtn.click();
    }

    async sumCartItems(): Promise<number> {
        return (await this.cartItems.locator(".inventory_item_price").allTextContents()).map(el => Number(el.replace("$", ""))).reduce((acc, curr) => acc + curr, 0);
    }
}