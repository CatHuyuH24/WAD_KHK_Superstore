document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    buttons.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();

            const userId = 1;
            const productId = button.getAttribute('data-product-id');
            const quantity = 1;
            const price = button.getAttribute('data-product-price');
            try {
                const response = await fetch('/cart/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        product_id: productId,
                        quantity: quantity,
                        price: price
                    })
                });

                const result = await response.json();
                if (response.ok) {
                    alert(result.message); // Success message
                } else {
                    alert(`Error: ${result.error}`); // Use backticks for template strings
                }
            } catch (error) {
                console.error('Error adding product to cart:', error);
                alert("Error adding product to cart");
            }
        });
    });
});
