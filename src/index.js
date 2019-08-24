const express = require( 'express' );
const ejs = require( 'ejs' );
const path = require( 'path' );
const multer = require( 'multer' );
const uuid = require( 'uuid' );

//Initializacion
const app = express();

//settings
app.set( 'port', 3000 );
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'ejs' );

//middlewares
const storage = multer.diskStorage( { //configuraciones por defecto de imágenes subidas
    destination: path.join( __dirname, 'public/uploads' ),
    filename: ( req, file, cb ) => { //poner nombre original
        cb( null, uuid() + path.extname( file.originalname ).toLocaleLowerCase() ); //cambia agregando id aleatoria + nombre original
    }
} );

app.use( multer( {
    storage,
    dest: path.join( __dirname, 'public/uploads' ),
    limits: { fileSize: 2000000 }, //límite del archivo en bytes (2Mb)
    fileFilter: ( req, file, cb ) => { //establecer tipo de archivos aceptados
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test( file.mimetype ); //comprueba que el tipo de archivo coicida con los aceptados
        const extname = filetypes.test( path.extname( file.originalname ) ); //comprueba la extension sea válida
        if ( mimetype && extname ){
            return cb( null, true );
        } 
        cb( "Error: archivo debe ser una imagen válida" );
    }
} ).single( 'image' ) );

//Routes
app.use( require( './routes/index.routes' ) );

//Init server
app.listen( app.get( 'port' ), () => {
    console.log(`server on port ${ app.get('port') }`);
} );