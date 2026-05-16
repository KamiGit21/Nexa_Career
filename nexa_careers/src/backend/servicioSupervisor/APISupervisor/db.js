import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3307,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(connection => {
    console.log('✅ Conexión a MySQL establecida con éxito en servicio Supervisor.');
    connection.release();
  }) 
  .catch(err => {
    console.error('❌ Error al conectar con la base de datos:', err.message);
  });

export default pool; 