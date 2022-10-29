const miFormulario = document.querySelector('form');

let url = (window.location.hostname.includes('localhost'))?
'http://localhost:8080/api/auth/':
'https://restserver-node-curso-luis.herokuapp.com/api/auth/';

let urlGoogle = (window.location.hostname.includes('localhost'))?
'http://localhost:8080/api/auth/google':
'https://restserver-node-curso-luis.herokuapp.com/api/auth/google';

miFormulario.addEventListener('submit', ( event )=>{
    event.preventDefault();
    const formData = {};

    for(let i of miFormulario.elements){
        if( i.name.length > 0){
            formData[i.name] = i.value;
        }
    }

    fetch( url + 'login', {
        method : 'POST',
        body : JSON.stringify( formData ),
        headers: { 'Content-Type': 'application/json' }
    })
    .then( resp => resp.json() )
    .then( ({ msg, token }) =>{
        if( msg ){
            return console.error( msg )
        }

        console.log(token)
        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch( err => {
        console.log(err)
    }) 

});

function handleCredentialResponse(response) {
  
    //Google Token : ID_TOKEN
    //console.log( 'id_token', response.credential );
const body = { id_token: response.credential };

fetch( urlGoogle, {
    method : 'POST',
    headers : {
        'Content-Type':'application/json'
    },
    body : JSON.stringify( body)
})
.then( resp => resp.json() )
.then( ( {token, usuario} ) => {
    localStorage.setItem( 'token', token );
    localStorage.setItem('email', usuario.correo);
    window.location = 'chat.html';
})
.catch( console.warn );
}

//Salir de la session
const button = document.querySelector('#google_singout');
button.addEventListener('click', async()=>{
    // console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect()

    google.accounts.id.revoke( localStorage.getItem('email'), done =>{
        console.log('consent revoked');
        localStorage.clear();
        location.reload();
    });

});