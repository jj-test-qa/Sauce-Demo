import { test, expect, Locator } from "@playwright/test"
import { InventoryPage } from "../pages/inventory.page";
import { CartPage } from "../pages/cart.page";
import { carts } from "../data/carts.data";


test.describe("Cart", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/inventory.html");
        await expect(page).toHaveURL("/inventory.html");
    });


    test("@smoke Validate going back to Inventory Page", async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addToCart("Sauce Labs Backpack");
        await inventoryPage.goToCart();
        await expect(page).toHaveURL("/cart.html");

        const cartPage = new CartPage(page);
        await cartPage.goBack();
        await expect(page).toHaveURL("/inventory.html");
    })

    for (const cart of carts) {
        test(`@smoke Cart Page: Validate Carts [${cart.map(el => el.name).join(", ")}]`, async ({ page }) => {
            const inventoryPage = new InventoryPage(page);
            for (const item of cart)
                await inventoryPage.addToCart(item);
            await inventoryPage.goToCart();

            const items: {}[] = inventoryPage.getItems();
            const itemCount: number = inventoryPage.getCartCount();
            const cartTotal: number = inventoryPage.getCartTotal();

            const cartPage = new CartPage(page, items, itemCount, cartTotal);

            const cartItems = await cartPage.getInventoryItems();

            for (const expectedItem of items) {
                expect(cartItems).toContainEqual(expectedItem)
            }

            const button: Locator[] = await cartPage.getButtons();
            expect(button).toHaveLength(itemCount);

            for (const el of button) {
                expect(el).toHaveText("Remove")
            }

            expect(cartTotal).toEqual(await cartPage.sumCartItems())

        })
    }
})