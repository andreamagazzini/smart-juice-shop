# How to Manipulate Prices (Client-Side Exploit)

## Current Vulnerability

The shopping cart calculates prices **client-side** in the browser, which means they can be easily manipulated!

## Method 1: Using Browser DevTools

### Step-by-Step Instructions:

1. **Add items to cart**
   - Add any products to your cart

2. **Open Browser DevTools**
   - Press `F12` or right-click → Inspect
   - Go to the "Console" tab

3. **Manipulate the Cart State**
   ```javascript
   // Find the cart component
   // Open React DevTools or use this hack:
   document.querySelector('.bg-white.rounded-2xl').__reactInternalInstance
   
   // Or modify the displayed total directly:
   const totalElement = document.querySelector('text-2xl.font-bold.text-blue-600')
   totalElement.textContent = '$0.01'
   ```

4. **Change Prices in Cart Items**
   - In DevTools, find the price span elements
   - Right-click → Edit as HTML
   - Change `${product.price}` to `$0.01`

5. **Modify React State**
   ```javascript
   // In console, try to access the cart state
   // Look for the cart array in React DevTools
   // Or intercept the checkout function
   ```

---

## Method 2: Modify Product Prices Before Adding to Cart

1. **Before clicking "Add to Cart"**
2. **Open DevTools → Elements tab**
3. **Find the price element** (e.g., `<span>...</span>`)
4. **Edit it** to $0.01
5. **Add to cart** - the modified price should be in the cart!

---

## Method 3: Intercept Network Requests

When checkout is implemented, you can:

1. **Open DevTools → Network tab**
2. **Add items to cart**
3. **Click "Proceed to Checkout"**
4. **Intercept the POST request**
5. **Modify the payload** before sending:
   ```json
   {
     "items": [
       {
         "id": 1,
         "price": 0.01,  // ← Change this!
         "quantity": 1
       }
     ]
   }
   ```

---

## Why This Works

1. **Client-Side Calculation**: Prices are calculated in JavaScript
2. **No Server Validation**: No backend checks if prices are valid
3. **Trust Client Data**: Server accepts whatever the client sends

---

## The Vulnerability

```javascript
// Current vulnerable code
const getTotalPrice = () => {
  return cart.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0
  )
  // ↑ This runs in the browser - anyone can modify it!
}
```

**What should happen:**
- Prices should be fetched from server
- Server should validate prices on checkout
- Never trust client-side calculations!

---

## Real-World Impact

In e-commerce, this could mean:
- Getting products for free
- Paying 1 cent instead of $100
- Changing item quantities to negative values
- Getting refunds by manipulating totals

---

## Educational Value

This teaches students:
1. **Never trust client-side data**
2. **Always validate on server**
3. **Use server-side price verification**
4. **Sanitize all user input**
5. **Implement proper payment flows**

---

Happy (legal) hacking! 🎉

