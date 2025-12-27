import { test, expect } from "@playwright/test";

import { LoginPage } from "../pages/login.page";
import { InventoryPage } from "../pages/inventory.page";
import { sku, backpack, bikeLight, boltTShirt, fleeceJacket, onesie, redTShirt } from "../data/sku.data";
import { user } from "../data/login.data";
import { carts } from "../data/carts.data";
import { HeaderComponent } from "../components/header.component";
import { FooterComponent } from "../components/footer.component";

test.describe("Inventory", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/inventory.html"); // we should be logged in based on auth.setup and playwright.config so go straight to the inventory page
        await expect(page).toHaveURL("/inventory.html");
    });

    test("@smoke Verify Inventory Page Has the Correct Logo", async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        await expect(inventoryPage.getLogo()).toHaveText("Swag Labs");
    })

    test("@smoke Verify Inventory Page Has the Title", async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        await expect(inventoryPage.getTitle()).toHaveText("Products");
    })

    test("@smoke Verify Items on Inventory Page Are Correct", async ({ page }) => {
        const inventoryPage = new InventoryPage(page);

        const items = await inventoryPage.getInventoryItems();

        for (const expectedItem of sku) {
            expect(items).toContainEqual(expectedItem);
        }
    })

    test("@smoke Verify Hamburger Menu on the Inventory Page", async ({ page }) => {
        const inventoryPage = new InventoryPage(page);

        const header: HeaderComponent = inventoryPage.getHeader();
        await expect(header.getBurgerVisibility()).toHaveAttribute("hidden", "true");
        await header.openBurgerMenu();
        await expect(header.getBurgerVisibility()).toHaveAttribute("aria-hidden", "false");
    })

    test("@smoke Verify Hamburger Menu Logout Functionality on the Inventory Page", async ({ page }) => {
        const inventoryPage = new InventoryPage(page);

        const header: HeaderComponent = inventoryPage.getHeader();
        await header.openBurgerMenu();
        await header.logOut();

        expect(page).toHaveURL('/');
    })

    test("@smoke Verify Footer Text on the Inventory Page", async ({ page }) => {
        const inventoryPage = new InventoryPage(page);

        const footer: FooterComponent = inventoryPage.getFooter();

        await expect(footer.getFooterMessage()).toHaveText(`© ${new Date().getFullYear()} Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy`)
    })

    test("@smoke Verify Twitter Navigation From the Footer on the Inventory Page", async ({ page }) => {
        const inventoryPage = new InventoryPage(page);

        const footer: FooterComponent = inventoryPage.getFooter();

        // 1. Start waiting for the new page (popup) event before the action
        const popupPromise = page.waitForEvent('popup');
        // Alternatively, you can listen on the context for the 'page' event if the above doesn't work for your use case
        // const popupPromise = context.waitForEvent('page');

        // 2. Perform the action that opens the new tab
        await footer.goToTwitterSocial();

        // 3. Await the promise to get a reference to the new Page object
        const newPage = await popupPromise;

        // 4. Wait for the new page to finish loading its state
        await newPage.waitForLoadState('load'); // 'load' waits for the full page load event

        // 5. Assert the URL of the new page using web-first assertions
        await expect(newPage).toHaveURL('https://x.com/saucelabs');
    })

    for (const cart of carts) {
        test(`@smoke Inventory Page: Verify Add to cart Functionality with ${cart.map(el => ` ${el.name}`).join(", ")}`, async ({ page }) => {
            const inventoryPage = new InventoryPage(page);
            let count = 0;
            let total = 0;
            // Helper function with internal price calculation
            const addAndVerifyItem = async (product: {
                name: string,
                description: string,
                price: string
            }) => {

                // Add item to cart
                const index = await inventoryPage.addToCart(product);

                // The "Add to Cart" button for the added item should have text Remove
                await expect(await inventoryPage.buttonText(index)).toHaveText("Remove");

                // Update counters
                count++;
                total += Number(product.price?.replace('$', '') || '0');

                // Verify cart count in shopping cart icon
                await expect(inventoryPage.getShoppingCartCount()).toBeVisible();
                const cartText = await inventoryPage.getShoppingCartCount().textContent();
                expect(Number(cartText)).toEqual(count);

                // Verify cart count via method
                expect(inventoryPage.getCartCount()).toEqual(count);

                // Verify total
                expect(inventoryPage.getCartTotal()).toEqual(total);

                //return { count, total };
            };

            for (const items of cart) {
                // Add items
                await addAndVerifyItem(items);
            }
            //await page.waitForTimeout(10000);
        })
    }

    test("@smoke Verify Items are sorted A to Z", async ({ page }) => {
        // this is the default behaviour
        const inventoryPage: InventoryPage = new InventoryPage(page);

        const retreivedItemNames = await inventoryPage.getItemNames();
        const itemNames = sku.map(el => el.name);
        const sortedItemNames = itemNames.sort((a, b) => a.localeCompare(b)) // case-insensitive sort, we can use .sort() to do case sensitive sort

        expect(sortedItemNames).toEqual(retreivedItemNames);
    })

    test("@smoke Verify Items are sorted Z to A", async ({ page }) => {
        // this is the default behaviour
        const inventoryPage: InventoryPage = new InventoryPage(page);

        await inventoryPage.sortCart("Z to A");

        const retreivedItemNames = await inventoryPage.getItemNames();
        const itemNames = sku.map(el => el.name);
        const sortedItemNames = itemNames.sort((a, b) => {

            const nameA = a.toUpperCase(); // ignore upper and lowercase
            const nameB = b.toUpperCase(); // ignore upper and lowercase

            if (nameA < nameB) {
                return 1; // nameA comes after nameB in descending order
            }
            if (nameA > nameB) {
                return -1; // nameA comes before nameB in descending order
            }
            return 0; // names must be equal

        })

        expect(sortedItemNames).toEqual(retreivedItemNames);
    })


    test("@smoke Verify Items are by price low to high", async ({ page }) => {
        // this is the default behaviour
        const inventoryPage: InventoryPage = new InventoryPage(page);

        await inventoryPage.sortCart("Low to High");

        const retreivedItemPrices = (await inventoryPage.getItemPrices()).map(el => Number(el.replace("$", "")))
        const itemPrices = sku.map(el => el.price).map(el => Number(el.replace("$", ""))).sort((a, b) => a - b);

        expect(retreivedItemPrices).toEqual(itemPrices);
    })

    test("@smoke Verify Items are by price High to Low", async ({ page }) => {
        // this is the default behaviour
        const inventoryPage: InventoryPage = new InventoryPage(page);

        await inventoryPage.sortCart("High to Low");

        const retreivedItemPrices = (await inventoryPage.getItemPrices()).map(el => Number(el.replace("$", "")))
        const itemPrices = sku.map(el => el.price).map(el => Number(el.replace("$", ""))).sort((a, b) => b - a);

        expect(retreivedItemPrices).toEqual(itemPrices);
    })
})