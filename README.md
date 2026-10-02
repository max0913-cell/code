# maxic

Website for **maxic**, homemade cookies by Max.

Everything is in one file, `index.html`. To see it, open the file in a browser.

## What's on the site

- Four cookies, priced per cookie: Chocolate Chip €2.00, Almond €2.25, Red Velvet €2.50, Macadamia White Chocolate €2.75
- **Pay 3, get 4**: for every 4 cookies in an order, the cheapest one is free
- Taster box (one of each flavour, €7.50 with the deal), free delivery from €15 (otherwise €2.50), and a stamp card
- An order box with a live receipt. Customers fill in their name, pickup or delivery, and a date, and the site writes out the order for them to send to you

## Changing things

Look for the `Shop settings` block near the bottom of `index.html`:

- `COOKIES`: names and prices, in cents
- `DELIVERY_FEE` and `FREE_DELIVERY_FROM`: delivery fee and the free-delivery amount, in cents
- `CONTACT`: add your WhatsApp number (digits only, with country code, e.g. `31612345678`) and/or email address. A "Send on WhatsApp" or "Send by email" button then shows up after someone places an order

Descriptions, allergens and the deal text are in the HTML itself.

## Photos

The photos come from Pexels and Wikimedia Commons and are loaded from those sites. Credits are in the footer. If a photo can't load, a drawn cookie shows in its place. To use your own photos, put them next to `index.html` and change the `src` of each `<img>`.

## Putting it online

With GitHub Pages: go to the repository's **Settings → Pages**, choose "Deploy from a branch", and pick the branch that has `index.html`, with the root folder. The site then goes live at `https://<your-username>.github.io/<repo-name>/`.
