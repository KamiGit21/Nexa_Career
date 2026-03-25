import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  port: 3307,
  user: 'root',
  password: 'password',
  database: 'nexa_careers',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(connection => {
    console.log('✅ Conexión a la base de datos MySQL establecida con éxito.');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error al conectar con la base de datos:', err.message);
  });

export default pool; // Exportación moderna