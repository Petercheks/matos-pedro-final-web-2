urlApiGet = "https://control-stock-api-977u.onrender.com/api/v1/articles/?offset=0&limit=100&student=pedro";

urlApiArticles = "https://control-stock-api-977u.onrender.com/api/v1/articles/";

const PRODUCTOS = getProducts();

async function getProducts() {
    const response = await axios.get(urlApiGet);
    return await response.data;
}

function formateaFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const año = fecha.getFullYear();
    const fechaFormato = `${dia}-${mes}-${año}`;
    return fechaFormato;
}

async function deleteProduct(productId) {
    await Swal.fire({
        title: 'Eliminar',
        text: '¿Desea eliminar este producto?',
        icon: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await axios.delete(urlApiArticles + productId);
                await Swal.fire({
                    title: "Producto eliminado!",
                    icon: "success",
                });

                home();
            } catch (error) {
                await Swal.fire({
                    title: "Error!",
                    text: "No se pudo eliminar el producto.",
                    icon: "error",
                });
            }
        }
    });
}

async function createProduct() {
    const form = document.getElementById("formCrearProducto");

    const data = {
        name: form.name.value,
        units: form.units.value,
        image: form.image.value,
        description: form.description.value,
        purchase_price: form.price.value,
        sale_price: form.price.value,
        category_id: form.category.value,
        student: 'pedro',
    };

    let formularioValido = await camposValidos(data);
    if (formularioValido) {
        await axios.post(urlApiArticles, data)
            .then(async response => {
                await Swal.fire({
                    title: "Producto creado!",
                    icon: "success",
                });

                window.location.reload();
            })
            .catch(async error => {
                await Swal.fire({
                    title: "Error!",
                    text: "No se pudo crear el producto.",
                    icon: "error",
                });
            });
    }
}

async function actualizarProducto() {
    const form = document.getElementById("formEditarProducto");
    const data = {
        name: form.name.value,
        units: form.units.value,
        image: form.image.value,
        description: form.description.value,
        purchase_price: form.price.value,
        sale_price: form.price.value,
        category_id: form.category.value,
        student: 'pedro',
    };

    let formularioValido = await camposValidos(data);
    if (formularioValido) {
        const productId = form.id.value;
        await axios.patch(urlApiArticles + productId, data)
            .then(async response => {
                await Swal.fire({
                    title: "Producto actualizado!",
                    icon: "success",
                });

                window.location.reload();
            })
            .catch(async error => {
                await Swal.fire({
                    title: "Error!",
                    text: "No se pudo actualizar el producto.",
                    icon: "error",
                });
            });
    }
}

async function camposValidos(data) {
    if (data.name === "" || data.units === "" || data.image === "" || data.description === "" || data.purchase_price === "" || data.sale_price === "" || data.category_id === "") {
        await Swal.fire({
            toast: true,
            showConfirmButton: false,
            position: "top-end",
            text: "Debes rellenar todos los campos.",
            icon: "error",
            timer: 2000,
            timerProgressBar: true,
        });
        return false;
    }
    return true;
}

const modalEditarProducto = document.getElementById('modalEditarProducto')
if (modalEditarProducto) {
    modalEditarProducto.addEventListener('show.bs.modal', async event => {
        const button = event.relatedTarget

        const productoId = button.getAttribute('data-bs-whatever')

        const request = await axios.get(urlApiArticles + productoId)
        const productoData = await request.data

        const formEditarProducto = document.getElementById('formEditarProducto')
        formEditarProducto.id.value = productoId
        formEditarProducto.name.value = productoData.name
        formEditarProducto.units.value = productoData.units
        formEditarProducto.image.value = productoData.image
        formEditarProducto.description.value = productoData.description
        formEditarProducto.price.value = productoData.purchase_price
        formEditarProducto.category.value = productoData.category.id
    })
}

function createProductRow(product) {
    return `
        <tr>
            <td>${product.name}</td>
            <td>${product.units}</td>
            <td>${product.sale_price}</td>
            <td>${product.category.name}</td>
            <td>${formateaFecha(product.created_at)}</td>
            <td>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalEditarProducto" data-bs-whatever="${product.id}"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn btn-danger" onclick="deleteProduct('${product.id}')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `;
}

function crearRowAlerta(texto) {
    const table = document.getElementById("table-body-products");
    table.innerHTML = `<tr><td colspan="6" class="text-center">${texto}</td></tr>`;
}

const filtrarProductos = document.getElementById("filtrarProductos");
if (filtrarProductos) {
    filtrarProductos.addEventListener("keyup", async event => {
        const input = event.target.value.toLowerCase();
        if (input){
            const products = await PRODUCTOS;
            const productsHtml = document.getElementById("table-body-products");

            const productosFiltrados = products.filter(product => product.name.toLowerCase().includes(input));
            if (productosFiltrados.length === 0) {
                crearRowAlerta("No hay productos para mostrar.");
            } else {
                productsHtml.innerHTML = productosFiltrados.map(createProductRow).join("");
            }
        } else { 
            home();
        }
    });
}

let sortOrder = 'asc';
const priceHeader = document.getElementById("priceHeader");
if (priceHeader) {
    priceHeader.addEventListener("click", async event => {
        const products = await PRODUCTOS;
        const productsHtml = document.getElementById("table-body-products");

        const sortedProducts = products.sort((a, b) => {
            return sortOrder === 'asc' ? a.sale_price - b.sale_price : b.sale_price - a.sale_price;
        });
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';

        productsHtml.innerHTML = sortedProducts.map(createProductRow).join("");
    });
}

async function home() {
    const products = await PRODUCTOS;
    const productsHtml = document.getElementById("table-body-products");
    productsHtml.innerHTML = products.map(createProductRow).join("");
}
home();