document.addEventListener('DOMContentLoaded', () => {
    const productModal = document.getElementById('product-modal');
    const closeModalBtn = document.querySelector('.modal .close-btn');
    const modalProductDetails = document.getElementById('modal-product-details');
    const detailButtons = document.querySelectorAll('.detail-btn');

    detailButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.produit-card');
            const productImage = card.querySelector('img').src;
            const productTitle = card.querySelector('h3').innerText;
            const productDescription = card.querySelector('.produit-description').innerText;
            const productPrice = card.querySelector('.produit-prix').innerHTML;

            modalProductDetails.innerHTML = `
                <img src="${productImage}" alt="${productTitle}">
                <div>
                    <h3>${productTitle}</h3>
                    <p>${productDescription}</p>
                    <div class="produit-prix">${productPrice}</div>
                    <button class="acheter-btn">Ajouter au panier</button>
                </div>
            `;

            productModal.style.display = 'block';
        });
    });

    const closeModal = () => {
        productModal.style.display = 'none';
    };

    closeModalBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (event) => {
        if (event.target == productModal) {
            closeModal();
        }
    });
});