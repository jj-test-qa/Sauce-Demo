import { Page, Locator } from "@playwright/test"
import { HeaderComponent } from "../components/header.component";
import { FooterComponent } from "../components/footer.component";

export class InventoryPage {
    readonly page: Page;
    readonly addedItems: {
        name: string,
        description: string,
        price: string
    }[]; // internal array of objects that keeps track of what was added to the cart
    private _cartCount: number;
    private _cartTotal: number;

    readonly logo: Locator;
    readonly title: Locator;

    readonly inventoryList: Locator; // holds all the items
    readonly inventoryListNames: Locator; // holds all the item names
    readonly inventoryListDescriptions: Locator; // holds all the item descriptions
    readonly inventoryListPrices: Locator; // holds all the item prices
    readonly inventoryListAddToCart: Locator; // holds all the Add to Card Buttons

    readonly sortItems: Locator; // select tag with sort options
    readonly cart: Locator;

    readonly header: HeaderComponent; // when logged in every page "has a" (composition) header
    readonly footer: FooterComponent; // has a footer

    constructor(page: Page) {
        this.page = page;

        this.logo = page.locator(".app_logo");
        this.title = page.locator("[data-test=\"title\"]");

        this.inventoryList = page.locator("[data-test='inventory-item']");
        this.inventoryListNames = this.inventoryList.locator("[data-test='inventory-item-name']");
        this.inventoryListDescriptions = this.inventoryList.locator("[data-test='inventory-item-desc']");
        this.inventoryListPrices = this.inventoryList.locator("[data-test='inventory-item-price']");
        this.inventoryListAddToCart = this.inventoryList.locator("button.btn_inventory");

        this.sortItems = page.locator("[data-test='product-sort-container']");
        this.cart = page.locator("[data-test=\"shopping-cart-link\"]");

        this.header = new HeaderComponent(page); //"has a"
        this.footer = new FooterComponent(page); //"has a"

        this.addedItems = [];
        this._cartCount = 0;
        this._cartTotal = 0;
    }

    getLogo(): Locator {
        return this.logo;
    }

    getTitle(): Locator {
        return this.title;
    }

    async getInventoryItems(): Promise<{
        name: string,
        description: string,
        price: string
    }[]> {
        const names = await this.inventoryListNames.allInnerTexts();
        const descriptions = await this.inventoryListDescriptions.allInnerTexts();
        const prices = await this.inventoryListPrices.allInnerTexts();

        return names.map((name, index) => ({
            name,
            description: descriptions[index],
            price: prices[index]
        }));
    }

    async getItemNames(): Promise<string[]> {
        return await this.inventoryListNames.allInnerTexts();
    }

    async getItemDescriptions(): Promise<string[]> {
        return await this.inventoryListDescriptions.allInnerTexts();
    }

    async getItemPrices(): Promise<string[]> {
        return await this.inventoryListPrices.allInnerTexts();
    }

    private async findItem(name: string): Promise<number> {
        const count = await this.inventoryList.count();
        let index = -1;
        for (let i = 0; i < count; i++) {
            if (await this.inventoryListNames.nth(i).innerText() === name) // n-th is 0 based
                return i;
        }
        return index;
    }

    async addToCart(item: {
        name: string,
        description: string,
        price: string
    }): Promise<number>;
    async addToCart(item: string): Promise<void>;


    async addToCart(item: {
        name: string,
        description: string,
        price: string
    } | string): Promise<number | void> {
        if (typeof item === 'string') { // item should not be a string for E2E testing
            const index = await this.findItem(item);
            await this.inventoryListAddToCart.nth(index).click();
            return;
        }
        else {
            const index = await this.findItem(item.name);
            if (index != -1) {
                this.addedItems.push(item);
                await this.inventoryListAddToCart.nth(index).click();
                this._cartCount++;
                this._cartTotal += Number((await this.inventoryListPrices.nth(index).innerText())?.replace('$', '') || '0');
                return index
            }
            else
                return index;
        }

    }

    // returns the button locator. when an item is added the text changes from "Add to Cart" to "Remove"
    async buttonText(index: number): Promise<Locator> {
        return this.inventoryListAddToCart.nth(index);
    }

    async sortCart(option: string): Promise<void> {
        if (option === "A to Z")
            return;
        //await this.sortItems.selectOption('Name (A to Z)');
        else if (option === "Z to A")
            await this.sortItems.selectOption('Name (Z to A)');
        else if (option === "Low to High")
            await this.sortItems.selectOption('Price (low to high)');
        else if (option === "High to Low")
            await this.sortItems.selectOption('Price (high to low)');
        else
            return;
    }

    async goToCart(): Promise<void> {
        await this.cart.click();
    }

    getItems(): {}[] {
        return this.addedItems;
    }

    getCartCount(): number {
        return this._cartCount;
    }

    getCartTotal(): number {
        return this._cartTotal;
    }

    getShoppingCartCount(): Locator {
        return this.cart.locator("[data-test='shopping-cart-badge']"); // this element should be visible when an item is added to the cart
    }

    getHeader(): HeaderComponent {
        return this.header;
    }

    getFooter(): FooterComponent {
        return this.footer;
    }
}