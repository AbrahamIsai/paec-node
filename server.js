const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

async function main() {
  try {
    await client.connect();
    const db = client.db('Proyecto');
    console.log('Conectado a MongoDB');

    // Listar todos los residuos
    app.get('/residuos', async (req, res) => {
      try {
        const residuos = await db.collection('paec').find().toArray();

        let html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Lista de Residuos</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f0f2f5;
              margin: 0;
              padding: 20px;
            }
            h2 {
              color: #007BFF;
              text-align: center;
            }
            .menu {
              text-align: center;
              margin: 20px 0;
            }
            .menu a {
              margin: 0 15px;
              text-decoration: none;
              color: #007BFF;
              font-weight: 500;
              transition: color 0.3s ease;
            }
            .menu a:hover {
              color: #0056b3;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: auto;
              background-color: white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              border-radius: 8px;
              overflow: hidden;
            }
            th, td {
              padding: 12px 16px;
              text-align: center;
              border-bottom: 1px solid #e0e0e0;
            }
            th {
              background-color: #007BFF;
              color: white;
              text-transform: uppercase;
            }
            tr:hover {
              background-color: #f1f1f1;
            }
          </style>
        </head>
        <body>
          <h2>Lista de Residuos del Proyecto PAEC - Abraham Isai/1A</h2>
          <div class="menu">
            <a href="/alta.html">Alta</a>
            <a href="/baja.html">Baja</a>
            <a href="/actualizar.html">Actualizar</a>
            <a href="/visualizar.html">Visualizar</a>
            <a href="/puntosrecoleccion">Visualizar Puntos de recoleccion</a>
          </div>
          <table>
            <tr>
              <th>ID Proyecto</th>
              <th>Material Reciclable</th>
              <th>Tipo de Residuo</th>
              <th>Descripción</th>
              <th>Estatus</th>
              <th>Fecha</th>
            </tr>`;

        residuos.forEach(item => {
          html += `
            <tr>
              <td>${item.id_proyecto || ''}</td>
              <td>${item.nombre || ''}</td>
              <td>${item.tipo_residuo || ''}</td>
              <td>${item.descripción || ''}</td>
              <td>${item.estatus || ''}</td>
              <td>${item.fecha || ''}</td>
            </tr>`;
        });

        html += `
          </table>
        </body>
        </html>`;

        res.send(html);

      } catch (err) {
        res.status(500).send('Error al obtener los residuos: ' + err.message);
      }
    });
    // Listar todos los puntos de recolección
app.get('/puntosrecoleccion', async (req, res) => {
  try {
    const puntos = await db.collection('puntos_recoleccion').find().toArray();

    let html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Lista de Puntos de Recolección</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f0f2f5;
          margin: 0;
          padding: 20px;
        }
        h2 {
          color: #28a745;
          text-align: center;
        }
        .menu {
          text-align: center;
          margin: 20px 0;
        }
        .menu a {
          margin: 0 15px;
          text-decoration: none;
          color: #28a745;
          font-weight: 500;
          transition: color 0.3s ease;
        }
        .menu a:hover {
          color: #1e7e34;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: auto;
          background-color: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border-radius: 8px;
          overflow: hidden;
        }
        th, td {
          padding: 12px 16px;
          text-align: center;
          border-bottom: 1px solid #e0e0e0;
        }
        th {
          background-color: #28a745;
          color: white;
          text-transform: uppercase;
        }
        tr:hover {
          background-color: #e9ffe9;
        }
        .volver {
          text-align: center;
          margin-top: 20px;
        }
        .volver a {
          color: #28a745;
          font-weight: bold;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          border: 2px solid #28a745;
          display: inline-block;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .volver a:hover {
          background-color: #28a745;
          color: white;
        }
      </style>
    </head>
    <body>
      <h2>Lista de Puntos de Recolección</h2>
      <div class="menu">
        <a href="/altaPunto.html">Alta</a>
        <a href="/bajaPunto.html">Baja</a>
        <a href="/actualizarPunto.html">Actualizar</a>
        <a href="/visualizarPuntos.html">Visualizar</a>
      </div>
      <table>
        <tr>
          <th>Ubicación</th>
          <th>Tipo de Reciclaje</th>
          <th>Horario</th>
          <th>Responsable</th>
        </tr>`;

    puntos.forEach(p => {
      html += `
        <tr>
          <td>${p.ubicacion || ''}</td>
          <td>${p.tipo_reciclaje || ''}</td>
          <td>${p.horario || ''}</td>
          <td>${p.responsable || ''}</td>
        </tr>`;
    });

    html += `
      </table>
      <div class="volver"><a href="/residuos">Volver a Tabla de Residuos</a></div>
    </body>
    </html>`;

    res.send(html);
  } catch (err) {
    res.status(500).send('Error al mostrar puntos de recolección: ' + err.message);
  }
});



    // Alta - Insertar nuevo residuo
    app.post('/alta', async (req, res) => {
      try {
        const nuevoResiduo = {
          id_proyecto: req.body.id_proyecto,
          nombre: req.body.nombre,
          tipo_residuo: req.body.tipo_residuo.toLowerCase(),
          descripción: req.body.descripción,
          estatus: req.body.estatus.toLowerCase(),
          fecha: req.body.fecha
        };
        await db.collection('paec').insertOne(nuevoResiduo);
        res.redirect('/residuos');
      } catch (err) {
        res.status(500).send('Error al insertar residuo: ' + err.message);
      }
    });
     app.post('/altaPunto', async (req, res) => {
  try {
    const { ubicacion, tipo_reciclaje, horario, responsable } = req.body;

    if (!ubicacion || !tipo_reciclaje || !horario || !responsable) {
      return res.status(400).send('Faltan campos obligatorios.');
    }

    const nuevoPunto = {
      ubicacion,
      tipo_reciclaje,
      horario,
      responsable
    };

    await db.collection('puntos_recoleccion').insertOne(nuevoPunto);
    res.redirect('/puntosrecoleccion'); // Redirige a la lista de puntos
  } catch (err) {
    res.status(500).send('Error al registrar punto de recolección: ' + err.message);
  }
});


    

    // Baja - Eliminar residuo por id_proyecto
    app.post('/baja', async (req, res) => {
      try {
        const idProyecto = req.body.id_proyecto;
        await db.collection('paec').deleteOne({ id_proyecto: idProyecto });
        res.redirect('/residuos');
      } catch (err) {
        res.status(500).send('Error al eliminar residuo: ' + err.message);
      }
    });
    
    // Eliminar Punto de Recolección
app.post('/bajaPunto', express.urlencoded({ extended: true }), async (req, res) => {
  try {
    const { ubicacion } = req.body;

    if (!ubicacion) {
      return res.status(400).send('Debe especificar la ubicación para eliminar.');
    }

    const coleccion = db.collection('puntos_recoleccion');
    const result = await coleccion.deleteOne({ ubicacion: ubicacion });

    if (result.deletedCount === 0) {
      return res.status(404).send(`
        <p>No se encontró ningún punto con la ubicación especificada.</p>
        <a href="/bajaPunto">Volver a intentar</a>
      `);
    }

    res.redirect('/puntosrecoleccion');

  } catch (err) {
    res.status(500).send('Error al eliminar punto: ' + err.message);
  }
});


//Actualizar residuos
// Función para capitalizar la primera letra y poner el resto en minúsculas
function capitalizarPrimeraLetra(texto) {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

app.post('/actualizar', async (req, res) => {
  try {
    let { id_proyecto, nombre, tipo_residuo, descripción, estatus, fecha, field } = req.body;

    // Log inicial
    console.log("Datos recibidos:", req.body);

    // Tratar de buscar el documento con id_proyecto como número o string
    const idProyectoNumero = Number(id_proyecto);
    const query = {
      $or: [
        { id_proyecto: idProyectoNumero },
        { id_proyecto: id_proyecto }
      ]
    };

    const nuevosDatos = {};

    // Si se actualizan todos los campos
    if (field === 'todos') {
      if (nombre) nuevosDatos.nombre = nombre;
      if (tipo_residuo) nuevosDatos.tipo_residuo = capitalizarPrimeraLetra(tipo_residuo);
      if (descripción) nuevosDatos.descripción = descripción;
      if (estatus) nuevosDatos.estatus = estatus.toLowerCase();
      if (fecha) nuevosDatos.fecha = fecha;
    } else if (field) {
      if (req.body[field]) {
        if (field === 'tipo_residuo') {
          nuevosDatos.tipo_residuo = capitalizarPrimeraLetra(tipo_residuo);
        } else if (field === 'estatus') {
          nuevosDatos.estatus = estatus.toLowerCase();
        } else {
          nuevosDatos[field] = req.body[field];
        }
      }
    }

    console.log("Filtro aplicado para buscar:", query);
    console.log("Datos a actualizar:", nuevosDatos);

    // Ejecutar la actualización
    const resultado = await db.collection('paec').updateOne(
      query,
      { $set: nuevosDatos }
    );

    console.log("Resultado de actualización:", resultado);

    if (resultado.matchedCount === 0) {
      console.log("❌ No se encontró el documento con ese ID.");
    }

    res.redirect('/residuos');

  } catch (err) {
    console.error("❌ Error al actualizar:", err);
    res.status(500).send("Error al actualizar residuo: " + err.message);
  }
});
 // Actualizar Punto de Recolección
app.post('/actualizarPunto', express.urlencoded({ extended: true }), async (req, res) => {
  try {
    const { ubicacion, field, tipo_reciclaje, horario, responsable } = req.body;

    if (!ubicacion || !field) {
      return res.status(400).send('Faltan datos obligatorios: ubicación o campo a actualizar');
    }

    const coleccion = db.collection('puntos_recoleccion');

    let updateFields = {};

    if (field === 'todos') {
      // Actualiza todos los campos disponibles si vienen en el formulario
      if (tipo_reciclaje) updateFields.tipo_reciclaje = tipo_reciclaje;
      if (horario) updateFields.horario = horario;
      if (responsable) updateFields.responsable = responsable;
    } else {
      // Actualiza solo el campo seleccionado
      if (field === 'tipo_reciclaje' && tipo_reciclaje) updateFields.tipo_reciclaje = tipo_reciclaje;
      else if (field === 'horario' && horario) updateFields.horario = horario;
      else if (field === 'responsable' && responsable) updateFields.responsable = responsable;
      else {
        return res.status(400).send('El campo a actualizar no es válido o faltan datos');
      }
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).send('No se proporcionaron campos para actualizar');
    }

    const result = await coleccion.updateOne(
      { ubicacion: ubicacion },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send('No se encontró ningún punto con esa ubicación');
    }

     res.redirect('/puntosrecoleccion');

  } catch (err) {
    res.status(500).send('Error al actualizar el punto: ' + err.message);
  }
});


// Visualizar con filtro
app.get('/visualizar', async (req, res) => {
  try {
    const campo = req.query.campo;
    let valor = Array.isArray(req.query.valor) ? req.query.valor[0] : req.query.valor;

    console.log('Campo recibido:', campo, 'Tipo:', typeof campo);
    console.log('Valor recibido:', valor, 'Tipo:', typeof valor);

    const coleccion = db.collection('paec');
    let filtro = {};
    let residuos;

    if (!campo || !valor) {
      residuos = await coleccion.find().toArray();
    } else {
      if (campo === 'id_proyecto') {
        const valorNumerico = Number(valor);
        console.log('Valor numérico para id_proyecto:', valorNumerico, 'Tipo:', typeof valorNumerico);
        filtro[campo] = valorNumerico;
      } else if (campo === 'estatus') {
        // Coincidencia exacta pero insensible a mayúsculas
        filtro[campo] = new RegExp(`^${valor}$`, 'i');
      } else if (campo === 'tipo_residuo') {
        // Normaliza para eliminar tildes en la comparación
        const valorNormalizado = valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        filtro[campo] = new RegExp(`^${valorNormalizado}$`, 'i');
      } else if (['nombre', 'descripción'].includes(campo)) {
        filtro[campo] = valor;
      }

      console.log('Filtro aplicado:', filtro);
      residuos = await coleccion.find(filtro).toArray();
    }

    console.log('Número de resultados:', residuos.length);

    let html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Lista de Residuos</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f0f2f5;
              margin: 0;
              padding: 20px;
            }
            h2 {
              color: #007BFF;
              text-align: center;
            }
            .menu {
              text-align: center;
              margin: 20px 0;
            }
            .menu a {
              margin: 0 15px;
              text-decoration: none;
              color: #007BFF;
              font-weight: 500;
              transition: color 0.3s ease;
            }
            .menu a:hover {
              color: #0056b3;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: auto;
              background-color: white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              border-radius: 8px;
              overflow: hidden;
            }
            th, td {
              padding: 12px 16px;
              text-align: center;
              border-bottom: 1px solid #e0e0e0;
            }
            th {
              background-color: #007BFF;
              color: white;
              text-transform: uppercase;
            }
            tr:hover {
              background-color: #f1f1f1;
            }
          </style>
        </head>
        <body>
          <h2>Lista de Residuos del Proyecto PAEC</h2>
          <div class="menu">
            <a href="/alta.html">Alta</a>
            <a href="/baja.html">Baja</a>
            <a href="/actualizar.html">Actualizar</a>
            <a href="/visualizar.html">Visualizar</a>
            <a href="/visualizarPuntos.html">Puntos de Recolección</a>
          </div>
          <table>
            <tr>
              <th>ID Proyecto</th>
              <th>Material Reciclable</th>
              <th>Tipo de Residuo</th>
              <th>Descripción</th>
              <th>Estatus</th>
              <th>Fecha</th>
            </tr>`;

        residuos.forEach(item => {
          html += `
            <tr>
              <td>${item.id_proyecto || ''}</td>
              <td>${item.nombre || ''}</td>
              <td>${item.tipo_residuo || ''}</td>
              <td>${item.descripción || ''}</td>
              <td>${item.estatus || ''}</td>
              <td>${item.fecha || ''}</td>
            </tr>`;
        });

        html += `
          </table>
        </body>
        </html>`;

        res.send(html);

      } catch (err) {
        res.status(500).send('Error en la visualizacion: ' + err.message);
      }
    });
    //visualizar puntos de recoleccion
    app.get('/visualizarPuntos', async (req, res) => {
  try {
    const campo = req.query.campo;
    let valor = Array.isArray(req.query.valor) ? req.query.valor[0] : req.query.valor;

    console.log('Campo recibido:', campo, 'Tipo:', typeof campo);
    console.log('Valor recibido:', valor, 'Tipo:', typeof valor);

    const coleccion = db.collection('puntos_recoleccion');
    let filtro = {};
    let puntos;

    if (!campo || !valor) {
      puntos = await coleccion.find().toArray();
    } else {
      if (campo === 'tipo_reciclaje' && valor === 'Otro') {
        filtro[campo] = {
          $nin: ['Plástico', 'Papel', 'Vidrio', 'Metal', 'Orgánico']
        };
      } else if (['ubicacion', 'tipo_reciclaje', 'responsable', 'horario'].includes(campo)) {
        filtro[campo] = new RegExp(`^${valor}$`, 'i');
      } else {
        filtro[campo] = valor;
      }
      console.log('Filtro aplicado:', filtro);
      puntos = await coleccion.find(filtro).toArray();
    }

    console.log('Número de resultados:', puntos.length);

    let html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Puntos de Recolección</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f0f2f5;
          margin: 0;
          padding: 20px;
        }
        h2 {
          color: #28a745;
          text-align: center;
        }
        .menu {
          text-align: center;
          margin: 20px 0;
        }
        .menu a {
          margin: 0 15px;
          text-decoration: none;
          color: #28a745;
          font-weight: 500;
          transition: color 0.3s ease;
        }
        .menu a:hover {
          color: #1e7e34;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: auto;
          background-color: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border-radius: 8px;
          overflow: hidden;
        }
        th, td {
          padding: 12px 16px;
          text-align: center;
          border-bottom: 1px solid #e0e0e0;
        }
        th {
          background-color: #28a745;
          color: white;
          text-transform: uppercase;
        }
        tr:hover {
          background-color: #f1f1f1;
        }
          .volver {
          text-align: center;
          margin-top: 20px;
        }
          .volver a {
          color: #28a745;
          font-weight: bold;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          border: 2px solid #28a745;
          display: inline-block;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .volver a:hover {
          background-color: #28a745;
          color: white;
        }
      </style>
    </head>
    <body>
      <h2>Lista de Puntos de Recolección</h2>
      <div class="menu">
        <a href="/visualizarPuntos.html">Filtrar</a>
        <a href="/residuos">Volver a Residuos</a>
      </div>
      <table>
        <tr>
          <th>Ubicación</th>
          <th>Tipo de Reciclaje</th>
          <th>Horario</th>
          <th>Responsable</th>
        </tr>`;

    puntos.forEach(p => {
      html += `
        <tr>
          <td>${p.ubicacion || ''}</td>
          <td>${p.tipo_reciclaje || ''}</td>
          <td>${p.horario || ''}</td>
          <td>${p.responsable || ''}</td>
        </tr>`;
    });

    html += `
      </table>
      <div class="volver">
  <a href="/puntosrecoleccion">Volver a Puntos de Recolección</a>
</div>

    </body>
    </html>`;

    res.send(html);

  } catch (err) {
    res.status(500).send('Error al mostrar puntos de recolección: ' + err.message);
  }
});


        app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}/residuos`);
    });

  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
  }
}

main();