document.addEventListener('DOMContentLoaded', function() {
    // Load cart items from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTable = document.querySelector('.cart-table');
    const cartSummary = document.querySelector('.cart-summary');
    const nutritionAlcoholSummary = document.querySelector('.nutrition-alcohol-summary');
    const emptyCartMessage = document.querySelector('.empty-cart');
    
    // Check if cart is empty
    if (cart.length === 0) {
        cartTable.style.display = 'none';
        cartSummary.style.display = 'none';
        if (nutritionAlcoholSummary) nutritionAlcoholSummary.style.display = 'none';
        emptyCartMessage.style.display = 'block';
    } else {
        // Clear any example items
        cartItemsContainer.innerHTML = '';
        
        // Add each item to the cart
        cart.forEach((item, index) => {
            const row = document.createElement('tr');
            row.dataset.index = index;
            
            const itemPrice = parseFloat(item.price.replace(' ', 'Birr'));
            const itemTotal = itemPrice * item.quantity;
            
            row.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image me-3">
                        <span>${item.name}</span>
                    </div>
                </td>
                <td>${item.price}</td>
                <td>
                    <div class="quantity-control">
                        <button class="quantity-btn decrease">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}">
                        <button class="quantity-btn increase">+</button>
                    </div>
                </td>
                <td>${itemTotal.toFixed(2)} Birr</td>
                <td><button class="remove-btn">Remove</button></td>
            `;
            
            cartItemsContainer.appendChild(row);
        });
        
        // Update cart totals
        updateCartTotals();
        // Update nutrition and alcohol summary
        updateNutritionAndAlcoholSummary();
    }
    
    // Add event listeners for quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const index = parseInt(row.dataset.index);
            const input = this.parentElement.querySelector('.quantity-input');
            let value = parseInt(input.value);
            
            if (this.classList.contains('increase')) {
                value++;
            } else if (this.classList.contains('decrease') && value > 1) {
                value--;
            }
            
            input.value = value;
            
            // Update cart in localStorage
            cart[index].quantity = value;
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update row total
            const itemPrice = parseFloat(cart[index].price.replace(' ', 'Birr'));
            const itemTotal = itemPrice * value;
            row.querySelector('td:nth-child(4)').textContent = `${itemTotal.toFixed(2)} Birr`;
            
            updateCartTotals();
            updateNutritionAndAlcoholSummary();
        });
    });
    
    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const index = parseInt(row.dataset.index);
            
            // Remove item from cart array
            cart.splice(index, 1);
            
            // Update localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Remove row from table
            row.remove();
            
            // Update indices for remaining rows
            document.querySelectorAll('#cart-items tr').forEach((row, i) => {
                row.dataset.index = i;
            });
            
            updateCartTotals();
            updateNutritionAndAlcoholSummary();
            
            // Show empty cart message if cart is empty
            if (cart.length === 0) {
                cartTable.style.display = 'none';
                cartSummary.style.display = 'none';
                if (nutritionAlcoholSummary) nutritionAlcoholSummary.style.display = 'none';
                emptyCartMessage.style.display = 'block';
            }
        });
    });
    
    // Function to update cart totals
    function updateCartTotals() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Calculate subtotal
        const subtotal = cart.reduce((total, item) => {
            const price = parseFloat(item.price.replace(' ', 'Birr'));
            return total + (price * item.quantity);
        }, 0);
        
        // Calculate tax (10%)
        const tax = subtotal * 0.1;
        
        // Delivery fee
        const delivery = 5.00;
        
        // Calculate total
        const total = subtotal + tax + delivery;
        
        // Update summary display
        const summaryRows = document.querySelectorAll('.summary-row');
        if (summaryRows.length >= 4) {
            summaryRows[0].querySelector('span:last-child').textContent = `${subtotal.toFixed(2)} Birr`;
            summaryRows[1].querySelector('span:last-child').textContent = `${tax.toFixed(2)} Birr`;
            summaryRows[2].querySelector('span:last-child').textContent = `${delivery.toFixed(2)} Birr`;
            summaryRows[3].querySelector('span:last-child').textContent = `${total.toFixed(2)} Birr`;
        }
    }
    
    // Function to update nutrition and alcohol summary
    function updateNutritionAndAlcoholSummary() {
        if (!document.getElementById('total-calories')) return;
        
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Initialize nutrition totals
        let totalCalories = 0;
        let totalCarbs = 0;
        let totalProtein = 0;
        let totalFat = 0;
        let totalCholesterol = 0;
        
        // Initialize alcohol totals
        let totalAlcoholPercentage = 0;
        let totalAlcoholItems = 0;
        let totalAlcoholUnits = 0;
        
        // Calculate nutrition and alcohol totals
        cart.forEach(item => {
            const quantity = item.quantity;
            
            // Add nutrition facts if available
            if (item.nutritionFacts) {
                if (item.nutritionFacts.calories) totalCalories += item.nutritionFacts.calories.value * quantity;
                if (item.nutritionFacts.carbs) totalCarbs += item.nutritionFacts.carbs.value * quantity;
                if (item.nutritionFacts.protein) totalProtein += item.nutritionFacts.protein.value * quantity;
                if (item.nutritionFacts.fat) totalFat += item.nutritionFacts.fat.value * quantity;
                if (item.nutritionFacts.cholesterol) totalCholesterol += item.nutritionFacts.cholesterol.value * quantity;
            }
            
            // Add alcohol content if available
            if (item.alcoholContent) {
                totalAlcoholPercentage += item.alcoholContent * quantity;
                totalAlcoholItems += quantity;
                
                // Calculate alcohol units (rough estimation: percentage * volume in liters)
                // Assuming a standard drink is about 0.25L
                const estimatedVolume = 0.25; // liters
                const alcoholUnits = (item.alcoholContent / 100) * estimatedVolume * 8 * quantity;
                totalAlcoholUnits += alcoholUnits;
            }
        });
        
        // Calculate average alcohol percentage
        const avgAlcoholPercentage = totalAlcoholItems > 0 ? totalAlcoholPercentage / totalAlcoholItems : 0;
        
        // Update nutrition display
        document.getElementById('total-calories').textContent = `${Math.round(totalCalories)} kcal`;
        document.getElementById('total-carbs').textContent = `${Math.round(totalCarbs)} g`;
        document.getElementById('total-protein').textContent = `${Math.round(totalProtein)} g`;
        document.getElementById('total-fat').textContent = `${Math.round(totalFat)} g`;
        document.getElementById('total-cholesterol').textContent = `${Math.round(totalCholesterol)} mg`;
        
        // Update alcohol display
        document.getElementById('avg-alcohol').textContent = `${avgAlcoholPercentage.toFixed(1)}%`;
        document.getElementById('total-alcohol-units').textContent = `${totalAlcoholUnits.toFixed(1)} units`;
        
        // Update alcohol warning message
        const alcoholWarningElement = document.getElementById('alcohol-warning');
        if (alcoholWarningElement) {
            if (totalAlcoholUnits > 0) {
                let warningMessage = '';
                
                if (totalAlcoholUnits < 2) {
                    warningMessage = 'Low alcohol content. Safe for most adults.';
                    alcoholWarningElement.className = 'alcohol-warning low';
                } else if (totalAlcoholUnits < 4) {
                    warningMessage = 'Moderate alcohol content. Please drink responsibly.';
                    alcoholWarningElement.className = 'alcohol-warning moderate';
                } else {
                    warningMessage = 'High alcohol content. Please drink responsibly and consider sharing.';
                    alcoholWarningElement.className = 'alcohol-warning high';
                }
                
                alcoholWarningElement.textContent = warningMessage;
                alcoholWarningElement.style.display = 'block';
            } else {
                alcoholWarningElement.style.display = 'none';
            }
        }
    }
});

