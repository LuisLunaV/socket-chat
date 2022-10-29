let url = (window.location.hostname.includes('localhost'))?
'http://localhost:8080/api/auth/':
'https://restserver-node-curso-luis.herokuapp.com/api/auth/';

let usuario = null;
let socket = null;

//Referencias HTML
const txtUid     = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir   = document.querySelector('#btnSalir');

const validarJWT = async()=>{
    const token = localStorage.getItem('token') || '';

    if( token.length <= 10){
        window.location = 'index.html';
        throw new Error( 'No hay token en el servidor' );
    }

    const resp = await fetch( url,{
        headers: { 'x-token': token }
    });

    const { usuario: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);
    usuario = userDB;
    document.title = usuario.nombre;

    await conectarSocket();
};

const conectarSocket = async()=>{
    socket = io({
        'extraHeaders':{
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', ()=>{
        console.log('Socket online')
    });

    socket.on('disconnect', ()=>{
        console.log('Socket offline')
    });

    socket.on('recibir-mensajes', ( payload )=>{
        //TODO:
        dibujarMensajes( payload )
    });

    socket.on('usuarios-activos', dibujarUsuarios);
    
    socket.on('mensaje-privado', ( payload )=>{
        //TODO:
        console.log('Privado:', payload)
    });
};

const dibujarUsuarios =( usuarios = [])=>{

    let userHtml = '';

    usuarios.forEach(({nombre, uid })=>{
        userHtml += `
        <li>
        <p>
        <h5>${nombre}</h5>
        <span>${uid}</span>
        </p>
        </li>`;
    });

    ulUsuarios.innerHTML = userHtml;
};

const dibujarMensajes =( mensajes = [])=>{

    let userHtml = '';

    mensajes.forEach(({nombre, mensaje })=>{
        userHtml += `
        <li>
        <p>
        <span class='text-primary'>${nombre}</span>
        <span class='fs-6 text-muted'>${mensaje}</span>
        </p>
        </li>`;
    });

    ulMensajes.innerHTML = userHtml;
};

txtMensaje.addEventListener('keyup', ( event )=>{

    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

    if(event.keyCode !== 13) return;
    if( mensaje.length === 0)return;
    
    socket.emit('enviar-mensaje', {uid, mensaje });
    console.log(mensaje)
    txtMensaje.value ='';
});

const main = async()=>{
    await validarJWT();
};

main();