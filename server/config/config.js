// ===========================================================
//             Puerto
// ===========================================================

process.env.PORT = process.env.PORT || 3000;

// ===========================================================
//             Entorno
// ===========================================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===========================================================
//             Vencimiento del Token
// ===========================================================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ===========================================================
//             SEED
// ===========================================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ===========================================================
//             BBDD
// ===========================================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
};

process.env.URLDB = urlDB;


// ===========================================================
//             GOOGLE CLIENT ID
// ===========================================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '810813824468-1kp7jkmv57h30eir33htkdck4hk4suo0.apps.googleusercontent.com'