document.addEventListener('DOMContentLoaded', function() {

    // Get form elements
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const fullNameInput = document.getElementById('full-name');
    const phoneNumberInput = document.getElementById('phone-number');
    const bankAccountInput = document.getElementById('bank-account');
    const screenshotInput = document.getElementById('screenshot');
    const orderTotal = document.getElementById('order-total');
    const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
    const paymentStatus = document.getElementById('payment-status');
  
    // Add event listener to confirm payment button
    confirmPaymentBtn.addEventListener('click', handlePayment);
  
    // Function to handle payment
    function handlePayment(event) {
      event.preventDefault();
  
      // Validate payment method
      let selectedPaymentMethod = '';
      paymentMethods.forEach((method) => {
        if (method.checked) {
          selectedPaymentMethod = method.value;
        }
      });
  
      if (selectedPaymentMethod === '') {
        alert('Please select a payment method.');
        return;
      }
  
      // Validate billing information
      const fullName = fullNameInput.value.trim();
      const phoneNumber = phoneNumberInput.value.trim();
      const bankAccount = bankAccountInput.value.trim();
  
      if (fullName === '' || phoneNumber === '' || bankAccount === '') {
        alert('Please fill in all billing information fields.');
        return;
      }
  
      // Validate screenshot upload
      const screenshot = screenshotInput.files[0];
  
      if (!screenshot) {
        alert('Please upload a payment screenshot or bill photo.');
        return;
      }
  
      // Perform payment processing (e.g., send data to server)
      // For demonstration purposes, we'll simulate a successful payment
      simulatePayment();
    }
  
    // Get the cart from local storage
    const cart = JSON.parse(localStorage.getItem('cart'));
  
    // Calculate the total price of the cart items
    let totalPrice = 0;
    cart.forEach(item => {
      totalPrice += item.price * item.quantity;
    });
  
    // Update the order total in the payment page
    const orderTotalElement = document.getElementById('order-total');
    orderTotalElement.textContent = `Total: ${totalPrice.toFixed(2)} Birr`;
  
    // Function to simulate payment processing
    function simulatePayment() {
      // Show payment status message
      paymentStatus.style.display = 'block';
      paymentStatus.textContent = 'Payment Successful!';
  
      // Retrieve cart total from localStorage
      const cartTotal = parseFloat(localStorage.getItem('cartTotal'));
  
      // Update order total element
      if (orderTotal) {
        orderTotal.textContent = 'Total: ' + cartTotal.toFixed(2) + ' Birr';
      }
  
      // Reset form
      document.getElementById('payment-form').reset();
  
      // Hide screenshot preview
      document.getElementById('screenshot-preview').style.display = 'none';
  
      // Disable confirm payment button
      confirmPaymentBtn.disabled = true;
  
      // Add success class to payment container
      document.getElementById('payment-section').classList.add('success');
  
      // Simulate payment delay
      setTimeout(() => {
        // Hide payment status message
        paymentStatus.style.display = 'none';
  
        // Enable confirm payment button
        confirmPaymentBtn.disabled = false;
  
        // Remove success class from payment container
        document.getElementById('payment-section').classList.remove('success');
      }, 3000);
    }
  
  });