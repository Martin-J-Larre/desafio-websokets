const socket = io();
socket.on('message', data => {
  // alert(data);
  console.log(data);
  socket.emit('notification', 'message got it');
})
socket.on('message2', data => {
  alert(data);
  // console.log(data);
})


const btn = document.getElementById('send-btn');
const message = document.getElementById('message');
const messageContainer = document.getElementById('message-container');
const formMessage = document.getElementById('form-message');
const productsContainer = document.getElementById('products-container');


const addMessage = () => {
  const author = document.getElementById('author').value;
  const message = document.getElementById('message').value;
  const obj = {
    author,
    message
  };
  document.getElementById('message').value = '';
  socket.emit('new-message', obj);
}

formMessage.addEventListener('submit', (e) => {
  e.preventDefault();
  addMessage();
})
socket.on('messages', data => {
  messageContainer.innerHTML = data.map(element => `
      <div class="chat-container">
          <b class="author">${element.author}</b>
          <span class="time"> [${element.time}]:</span>
          <i class="message">${element.message}</i>
      </div>
  `).join(' ');
})

/////todo: https://handlebarsjs.com/api-reference/compilation.html look up here pasar kind of hdbs motores de plantillas (index.handlebars)
/////todo: Cambiar function to arrows function y hacer variables con nombres razonables
/////todo: poner estilos desde el css a los templates strings
const template = Handlebars.compile(`
<h2 class="products-h2"> Productos</h2>
<ul>
{{#each products}}
  <li  class="products-li">
  <h6>Title: {{this.title}}</h6>
  <h6>id: {{this.id}}</h6>
  <h6>Price: $ {{this.price}}</h6>
  <img width="100px" src={{this.thumbnail}} alt="Card">
  </li>
{{/each}}
</ul>
`);

socket.on('products', data => {
  const html = template({
    products: data
  });
  productsContainer.innerHTML = html;
})