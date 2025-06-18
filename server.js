const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();
const PORT = 3000;

const uri = 'mongodb+srv://alcantarazuletaabraham46:isai12345R@abraham.lmw2w8u.mongodb.net/?retryWrites=true&w=majority&appName=Abraham';
const client = new MongoClient(uri);

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Visualizar alumnos
app.get('/alumnos', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('Escuela');
        const alumnos = await db.collection('Alumnos').find().toArray();

        let html = `
        <html>
        <head>
            <style>
                table {
                    border-collapse: collapse;
                    width: 95%;
                    margin: 20px auto;
                }
                th, td {
                    border: 1px solid #FFA500;
                    padding: 8px;
                    text-align: center;
                }
                th {
                    background-color: #FFA500;
                    color: white;
                }
                body {
                    font-family: Arial, sans-serif;
                }
                .menu {
                    text-align: center;
                    margin: 20px;
                }
                .menu a {
                    margin: 0 10px;
                    text-decoration: none;
                    color: #FFA500;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <h2 style="text-align:center; color: #FFA500;">Lista de Alumnos</h2>
            <div class="menu">
                <a href="/alta.html">Alta</a>
                <a href="/baja.html">Baja</a>
                <a href="/actualizar.html">Actualizar</a>
                <a href="/visualizar.html">Visualizar</a>
            </div>
            <table>
                <tr>
                    <th>No. Control</th>
                    <th>Nombre</th>
                    <th>Carrera</th>
                    <th>Semestre</th>
                    <th>Correo</th>
                    <th>Edad</th>
                    <th>Generación</th>
                </tr>`;

        alumnos.forEach(alumno => {
            html += `
                <tr>
                    <td>${alumno.no_control}</td>
                    <td>${alumno.nombre}</td>
                    <td>${alumno.carrera}</td>
                    <td>${alumno.semestre}</td>
                    <td>${alumno.correo}</td>
                    <td>${alumno.edad}</td>
                    <td>${alumno.Generacion}</td>
                </tr>`;
        });

        html += `</table></body></html>`;
        res.send(html);
    } catch (err) {
        res.status(500).send('Error al obtener los alumnos: ' + err.message);
    } finally {
        await client.close();
    }
});

// Alta
app.post('/alta', async (req, res) => {
    const nuevoAlumno = req.body;
    try {
        await client.connect();
        const db = client.db('Escuela');
        await db.collection('Alumnos').insertOne(nuevoAlumno);
        res.redirect('/alumnos');
    } catch (err) {
        res.status(500).send('Error al insertar alumno: ' + err.message);
    } finally {
        await client.close();
    }
});

// Baja
app.post('/baja', async (req, res) => {
    const noControl = req.body.no_control;
    try {
        await client.connect();
        const db = client.db('Escuela');
        await db.collection('Alumnos').deleteOne({ no_control: noControl });
        res.redirect('/alumnos');
    } catch (err) {
        res.status(500).send('Error al eliminar alumno: ' + err.message);
    } finally {
        await client.close();
    }
});

// Actualizar
app.post('/actualizar', async (req, res) => {
    const { no_control, nombre, carrera, semestre, correo, edad, Generacion } = req.body;
    const nuevosDatos = {};
    if (nombre) nuevosDatos.nombre = nombre;
    if (carrera) nuevosDatos.carrera = carrera;
    if (semestre) nuevosDatos.semestre = parseInt(semestre);
    if (correo) nuevosDatos.correo = correo;
    if (edad) nuevosDatos.edad = parseInt(edad);
    if (Generacion) nuevosDatos.Generacion = parseInt(Generacion);

    try {
        await client.connect();
        const db = client.db('Escuela');
        await db.collection('Alumnos').updateOne(
            { no_control },
            { $set: nuevosDatos }
        );
        res.redirect('/alumnos');
    } catch (err) {
        res.status(500).send('Error al actualizar alumno: ' + err.message);
    } finally {
        await client.close();
    }
});

// Visualizar con filtro
app.get('/visualizar', async (req, res) => {
    const campo = req.query.campo;
    const valor = req.query.valor;

    try {
        await client.connect();
        const db = client.db('Escuela');
        const coleccion = db.collection('Alumnos');
        let alumnos;

        if (!campo) {
            alumnos = await coleccion.find().toArray();
        } else if (['nombre', 'no_control', 'correo'].includes(campo) && valor) {
            const filtro = {};
            filtro[campo] = valor;
            alumnos = await coleccion.find(filtro).toArray();
        } else {
            const repetidos = await coleccion.aggregate([
                { $group: { _id: `$${campo}`, count: { $sum: 1 } } },
                { $match: { count: { $gt: 1 } } }
            ]).toArray();

            const valores = repetidos.map(r => r._id);
            const filtro = {};
            filtro[campo] = { $in: valores };
            alumnos = await coleccion.find(filtro).toArray();
        }

        let html = `
        <html>
        <head>
            <style>
                table {
                    border-collapse: collapse;
                    width: 95%;
                    margin: 20px auto;
                }
                th, td {
                    border: 1px solid #FFA500;
                    padding: 8px;
                    text-align: center;
                }
                th {
                    background-color: #FFA500;
                    color: white;
                }
                body {
                    font-family: Arial, sans-serif;
                }
                h2 { text-align: center; color: #FFA500; }
                .volver { text-align: center; margin: 20px; }
                .volver a { text-decoration: none; color: #FFA500; font-weight: bold; }
            </style>
        </head>
        <body>
            <h2>Resultado de Visualización</h2>
            <table>
                <tr>
                    <th>No. Control</th>
                    <th>Nombre</th>
                    <th>Carrera</th>
                    <th>Semestre</th>
                    <th>Correo</th>
                    <th>Edad</th>
                    <th>Generación</th>
                </tr>`;

        alumnos.forEach(alumno => {
            html += `
                <tr>
                    <td>${alumno.no_control}</td>
                    <td>${alumno.nombre}</td>
                    <td>${alumno.carrera}</td>
                    <td>${alumno.semestre}</td>
                    <td>${alumno.correo}</td>
                    <td>${alumno.edad}</td>
                    <td>${alumno.Generacion}</td>
                </tr>`;
        });

        html += `</table><div class="volver"><a href="/visualizar.html">Volver</a></div></body></html>`;
        res.send(html);
    } catch (err) {
        res.status(500).send('Error en la visualización: ' + err.message);
    } finally {
        await client.close();
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

