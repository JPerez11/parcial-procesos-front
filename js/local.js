//funciones propias de la app
const urlApi = "http://localhost:8081";//colocar la url con el puerto

async function login() {
    var myForm = document.getElementById("formLogin");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    var settings={
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    }
    const request = await fetch(`${urlApi}/auth/login`,settings);
    //console.log(await request.text());
    if(request.ok){
        const respuesta = await request.json();
        localStorage.token = respuesta.token;

        //localStorage.token = respuesta;
        localStorage.email = jsonData.email;      
        location.href= "dashboard.html";
    }
}

function listUsers(){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.token}`
        },
    }
    fetch(`${urlApi}/api/users/`,settings)
    .then(response => response.json())
    .then(function(data){
        
            var usuarios = '';
            let count = 0;
            for(const usuario of data){
                count++;
                console.log(usuario.email)
                usuarios += `
                <tr>
                    <th scope="row">${count}</th>
                    <td>${usuario.name}</td>
                    <td>${usuario.lastName}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.address}</td>
                    <td>${usuario.birthday}</td>
                    <td>
                    <a href="#" onclick="verModificarUsuario('${usuario.id}')" class="btn btn-outline-warning">
                        <i class="fa-solid fa-user-pen"></i>
                    </a>
                    <a href="#" onclick="verUsuario('${usuario.id}')" class="btn btn-outline-info">
                        <i class="fa-solid fa-eye"></i>
                    </a>
                    </td>
                </tr>`;
                
            }
            document.getElementById("listar").innerHTML = usuarios;
    })
}

function showListUsers() {
    let showList = 
    `<div id="datos"></div>

    <div class="p-3 mb-2 bg-light text-dark">
      <h1 class="display-5"><i class="fa-solid fa-list"></i> Listado de usuarios</h1>
    </div>
    
    <a href="#" onclick="registerForm()" class="btn btn-outline-success"><i class="fa-solid fa-user-plus"></i></a>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">First Name</th>
          <th scope="col">Last Name</th>
          <th scope="col">Email</th>
          <th scope="col">Address</th>
          <th scope="col">Birthday</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody id="listar">

      </tbody>
    </table>`;
    document.getElementById("page_title").innerHTML = "GESTIÓN DE USUARIOS";
    document.getElementById("card_body").innerHTML = showList;
    listUsers();
}

function verModificarUsuario(id){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.token}`
        },
    }
    fetch(`${urlApi}/api/users/getById/${id}`,settings)
    .then(response => response.json())
    .then(function(usuario){
            var cadena='';
            if(usuario){                
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Modificar Usuario</h1>
                </div>
              
                <form action="" method="post" id="myForm">
                    <label for="name" class="form-label">First Name</label>
                    <input type="text" class="form-control" name="name" id="name" required value="${usuario.name}"> <br>
                    <label for="lastName"  class="form-label">Last Name</label>
                    <input type="text" class="form-control" name="lastName" id="lastName" required value="${usuario.lastName}"> <br>
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" name="email" id="email" required value="${usuario.email}"> <br>
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" name="password" id="password" required> <br>
                    <label for="address" class="form-label">Address</label>
                    <input type="text" class="form-control" id="address" name="address" required value="${usuario.address}"> <br>
                    <label for="birthday" class="form-label">Birthday</label>
                    <input type="date" class="form-control" id="birthday" name="birthday" required value="${usuario.birthday}"> <br>
                    <button type="button" class="btn btn-outline-warning" 
                        onclick="modificarUsuario('${id}')">Modificar
                    </button>
                </form>`;
            }
            document.getElementById("myModalTitle").innerHTML = "UPDATE USER";
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'));
            myModal.toggle();
    })
}

async function modificarUsuario(id){
    validaToken();
    var myForm = document.getElementById("myForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(`${urlApi}/api/users/${id}`, {
        method: 'PUT',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.token}`
        },
        body: JSON.stringify(jsonData)
    });
    listar();
    alertas("Se ha modificado el usuario exitosamente!",1);
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario');
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function verUsuario(id){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.token}`
        },
    }
    fetch(`${urlApi}/api/users/getById/${id}`,settings)
    .then(response => response.json())
    .then(function(usuario){
            var cadena='';
            if(usuario){                
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Visualizar Usuario</h1>
                </div>
                <ul class="list-group">
                    <li class="list-group-item">First name: ${usuario.name}</li>
                    <li class="list-group-item">Last name: ${usuario.lastName}</li>
                    <li class="list-group-item">Email: ${usuario.email}</li>
                    <li class="list-group-item">Address: ${usuario.address}</li>
                    <li class="list-group-item">Birthday: ${usuario.birthday}</li>
                </ul>`;
              
            }
            document.getElementById("myModalTitle").innerHTML = "SHOW USER"
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
    })
}

function alertas(mensaje,tipo){
    var color ="";
    if(tipo == 1){//success verde
        color="success"
    }
    else{//danger rojo
        color = "danger"
    }
    var alerta =`<div class="alert alert-'+color+' alert-dismissible fade show" role="alert">
                    <strong><i class="fa-solid fa-triangle-exclamation"></i></strong>
                        ${mensaje}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                 </div>`;
    document.getElementById("datos").innerHTML = alerta;
}

function registerForm(){
    cadena = `
            <div class="p-3 mb-2 bg-light text-dark">
                <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Registrar Usuario</h1>
            </div>
              
            <form action="" method="post" id="myForm">
                <input type="hidden" name="id" id="id">
                <label for="name" class="form-label">First Name</label>
                <input type="text" class="form-control" name="name" id="name" required> <br>
                <label for="lastName"  class="form-label">Last Name</label>
                <input type="text" class="form-control" name="lastName" id="lastName" required> <br>
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" name="email" id="email" required> <br>
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" name="password" required> <br>
                <label for="address" class="form-label">Address</label>
                <input type="text" class="form-control" id="address" name="address" required> <br>
                <label for="birthday" class="form-label">Birthday</label>
                <input type="date" class="form-control" id="birthday" name="birthday" required> <br>
                <button type="button" class="btn btn-outline-info" onclick="registrarUsuario()">Registrar</button>
            </form>`;
            document.getElementById("myModalTitle").innerHTML = "REGISTER USER"
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
}

async function registrarUsuario(){
    var myForm = document.getElementById("myForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(`${urlApi}/api/users/`, {
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.token}`
        },
        body: JSON.stringify(jsonData)
    });
    listar();
    alertas("Se ha registrado el usuario exitosamente!",1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function showListProducts() {
    let showList = 
    `<div id="datos"></div>

    <div class="p-3 mb-2 bg-light text-dark">
      <h1 class="display-5"><i class="fa-solid fa-list"></i> Listado de productos</h1>
    </div>
    
    <a href="#" onclick="registerFormProduct()" class="btn btn-outline-success"><i class="fa-solid fa-user-plus"></i></a>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Title</th>
          <th scope="col">Price</th>
          <th scope="col">Description</th>
          <th scope="col">Category</th>
          <th scope="col">Image</th>
          <th scope="col">Owner</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody id="listar">

      </tbody>
    </table>`;
    document.getElementById("page_title").innerHTML = "GESTIÓN DE PRODUCTOS";
    document.getElementById("card_body").innerHTML = showList;
    listProducts();
}

function listProducts() {
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.token}`
        },
    }
    fetch(`${urlApi}/api/product/`,settings)
    .then(response => response.json())
    .then(function(data){
        
            var products = '';
            let count = 0;
            for(const prod of data.data){
                count++;
                products += `
                <tr>
                    <th scope="row">${count}</th>
                    <td>${prod.title}</td>
                    <td>${prod.price}</td>
                    <td>${prod.description}</td>
                    <td>${prod.category}</td>
                    <td>${prod.image}</td>
                    <td>${prod.user.name}</td>
                    <td>
                    <a href="#" onclick="showUpdateProduct('${prod.id}')" class="btn btn-outline-warning">
                        <i class="fa-solid fa-user-pen"></i>
                    </a>
                    <a href="#" onclick="showProduct('${prod.id}')" class="btn btn-outline-info">
                        <i class="fa-solid fa-eye"></i>
                    </a>
                    </td>
                </tr>`;
                
            }
            document.getElementById("listar").innerHTML = products;
    })
}

function showUpdateProduct(id){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.token}`
        },
    }
    fetch(`${urlApi}/api/product/${id}`,settings)
    .then(response => response.json())
    .then(function(product){
            var cadena='';
            if(product){                
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i>Update Product</h1>
                </div>
              
                <form action="" method="post" id="myForm">
                    <label for="title" class="form-label">Title</label>
                    <input type="text" class="form-control" name="title" id="title" required value="${product.data.title}"> <br>
                    <label for="price"  class="form-label">Price</label>
                    <input type="number" class="form-control" name="price" id="price" required value="${product.data.price}"> <br>
                    <label for="description" class="form-label">Description</label>
                    <textarea class="form-control" id="description" name="description" rows="3" required">${product.data.description}</textarea>
                    <label for="category" class="form-label">Category</label>
                    <input type="text" class="form-control" name="category" id="category" required value="${product.data.category}"> <br>
                    <label for="image" class="form-label">Image</label>
                    <input type="text" class="form-control" id="image" name="image" required value="${product.data.image}"> <br>
                    <label for="user" class="form-label">User</label>
                    <input type="text" class="form-control" id="user" name="user" required value="${product.data.user.id}"> <br>
                    <button type="button" class="btn btn-outline-warning" 
                        onclick="updateProduct('${id}')">Update
                    </button>
                </form>`;
            }
            document.getElementById("myModalTitle").innerHTML = "UPDATE PRODUCT"
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'));
            myModal.toggle();
    })
}

async function updateProduct(id){
    validaToken();
    var myForm = document.getElementById("myForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(`${urlApi}/api/product/${id}`, {
        method: 'PUT',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.token}`
        },
        body: JSON.stringify(jsonData)
    });
    listar();
    alertas("Se ha modificado el producto exitosamente!",1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}


function registerFormProduct(){
    cadena = `
            <div class="p-3 mb-2 bg-light text-dark">
                <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Registrar Usuario</h1>
            </div>
              
            <form action="" method="post" id="myForm">
                <label for="title" class="form-label">Title</label>
                <input type="text" class="form-control" name="title" id="title" required> <br>
                <label for="price"  class="form-label">Price</label>
                <input type="number" class="form-control" name="price" id="price" required> <br>
                <label for="description" class="form-label">Description</label>
                    <textarea class="form-control" id="description" name="description" rows="3" required"></textarea>
                    <label for="category" class="form-label">Category</label>
                    <input type="text" class="form-control" name="category" id="category" required> <br>
                    <label for="image" class="form-label">Image</label>
                    <input type="text" class="form-control" id="image" name="image" required> <br>
                    <label for="userId" class="form-label">User</label>
                    <input type="text" class="form-control" id="userId" name="userId" required> <br>
                <button type="button" class="btn btn-outline-info" onclick="registerProduct()">Registrar</button>
            </form>`;
            document.getElementById("myModalTitle").innerHTML = "REGISTER USER"
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
}

async function registerProduct(){
    var myForm = document.getElementById("myForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(`${urlApi}/api/product/`, {
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.token}`
        },
        body: JSON.stringify(jsonData)
    });
    listProducts();
    alertas("Se ha registrado el producto exitosamente!",1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function modalConfirmacion(texto,funcion){
    document.getElementById("contenidoConfirmacion").innerHTML = texto;
    var myModal = new bootstrap.Modal(document.getElementById('modalConfirmacion'))
    myModal.toggle();
    var confirmar = document.getElementById("confirmar");
    confirmar.onclick = funcion;
}

function salir(){
    localStorage.clear();
    location.href = "index.html";
}

function validaToken(){
    if(localStorage.token == undefined){
        salir();
    }
}