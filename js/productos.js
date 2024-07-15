urlApi = "https://control-stock-api-977u.onrender.com/api/v1/articles/?offset=0&limit=100&student=pedro";

async function getProducts() {
    const response = await axios.get(urlApi);
    return await response.data;
}

function createProductCard(product) {
    return `
        <div class="col">
            <div class="card h-100 bg-dark border-light">
                <img src="${product.image}" class="card-img-top" alt="${product.name}" width="80" height="350">
                <div class="card-body">
                    <h5 class="card-title text-light">${product.name}</h5>
                    <p class="card-text text-muted">Categoría: ${product.category.name}</p>
                    <p class="card-text text-light">${product.description}</p>
                    <p class="card-text text-light"><strong>Precio: $${product.sale_price}</strong></p>
                    <button class="btn btn-success buy-button" onclick="buyProduct()">Comprar</button>
                </div>
            </div>
        </div>
    `;
}

async function buyProduct() {
   await Swal.fire({
        title: 'Comprar',
        text: '¿Desea comprar este producto?',
        icon: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: 'Comprar',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => { 
        if (result.isConfirmed) {
            await Swal.fire({
                title: "Producto comprado!",
                icon: "success",
            });
        } 
    });
}

async function home() {
    const products = await getProducts();
    const productsHtml = document.getElementById("products");
    productsHtml.innerHTML = products.map(createProductCard).join("");
}
home();
