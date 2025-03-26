document.addEventListener('DOMContentLoaded', function() {
  // Get references to elements
  const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
  const fullNameInput = document.getElementById('full-name');
  const phoneNumberInput = document.getElementById('phone-number');
  const bankAccountInput = document.getElementById('bank-account');
  const screenshotInput = document.getElementById('screenshot');
  const screenshotPreview = document.getElementById('screenshot-preview');
  const orderTotalDisplay = document.getElementById('order-total');
  const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
  const cancelPaymentBtn = document.getElementById('cancel-payment-btn');
  const paymentStatus = document.getElementById('payment-status');

  // Dummy order total (replace with actual order total from your system)
  const orderTotal = 150.00;
  orderTotalDisplay.textContent = `Total: ${orderTotal.toFixed(2)} Birr`;

  // Screenshot upload preview
  screenshotInput.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
          const reader = new FileReader();
          screenshotPreview.style.display = 'block';
          reader.addEventListener('load', function() {
              screenshotPreview.setAttribute('src', this.result);
          });
          reader.readAsDataURL(file);
      } else {
          screenshotPreview.style.display = 'none';
          screenshotPreview.setAttribute('src', '');
      }
  });

  // Confirm payment button click
  confirmPaymentBtn.addEventListener('click', function() {
      // Validate form inputs
      if (!fullNameInput.value || !phoneNumberInput.value || !bankAccountInput.value) {
          alert('Please fill in all required fields.');
          return;
      }

      if (!document.querySelector('input[name="payment-method"]:checked')) {
          alert('Please select a payment method.');
          return;
      }

      if (!screenshotInput.files[0]) {
          alert('Please upload a payment screenshot.');
          return;
      }

      // Simulate payment processing (replace with actual payment processing logic)
      setTimeout(function() {
          paymentStatus.style.display = 'block';
          // You can redirect the user to a thank you page or update the UI as needed
      }, 2000);
  });

  // Cancel payment button click
  cancelPaymentBtn.addEventListener('click', function() {
      // Redirect to the previous page or clear the form
      alert('Payment cancelled.');
  });
});
