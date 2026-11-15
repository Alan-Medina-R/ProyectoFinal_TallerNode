const express = require("express");
const empleados = express.Router();
const db = require("../config/database");

empleados.post("/", async (req, res, next) =>{
    const {nombre, apellidos, telefono, correo, direccion} = req.body;

    if(nombre && apellidos && telefono && correo && direccion){
        let query = "INSERT INTO empleados(nombre, apellidos, telefono, correo, direccion)";
        query += ` VALUES('${nombre}', '${apellidos}', '${telefono}', '${correo}', '${direccion}')`;

        const rows = await db.query(query);

        if(rows.affectedRows == 1){
            return res.status(201).json({code: 201, message: "Empleado agregado correctamente"});
        }
        return res.status(500).json({code: 500, message: "Error al crear el empleado"});
    }
    return res.status(500).json({code: 500, message: "Campos incompletos"});
});

empleados.delete("/:id", async (req, res, next) => {
    const idParam = req.params.id;

    if (!/^[0-9]{1,3}$/.test(idParam)) {
        next();
        return;
    }
    const query = `DELETE FROM empleados WHERE empleado_id=${req.params.id}`;

    const rows = await db.query(query);

    if(rows.affectedRows == 1){
        return res.status(200).json({code: 200, message: "Empleado eliminado correctamente"});
    }
    return res.status(404).json({code: 404, message: "Empleado no encontrado"}); 
});

empleados.put("/:id", async (req, res, next) => {
    const idParam = req.params.id;

    if (!/^[0-9]{1,3}$/.test(idParam)) {
        next();
        return;
    }

    const {nombre, apellidos, telefono, correo, direccion} = req.body;

    if(nombre && apellidos && telefono && correo && direccion){
        let query = `UPDATE empleados SET nombre='${nombre}', apellidos='${apellidos}',`;
        query += `telefono='${telefono}', correo='${correo}', direccion='${direccion}' WHERE empleado_id=${req.params.id};`;
            
        const rows = await db.query(query);

        if(rows.affectedRows == 1){
            return res.status(200).json({code: 200, message: "Empleado actualizado correctamente"});
        }
        return res.status(500).json({code: 500, message: "Empleado no encontrado"});
    }
    return res.status(500).json({code: 500, message: "Campos incompletos"});
});

empleados.patch("/:id", async (req, res, next) => {
    const idParam = req.params.id;

    if (!/^[0-9]{1,3}$/.test(idParam)) {
        next();
        return;
    }

    const {nombre, apellidos, telefono, correo, direccion} = req.body;

    if(nombre && apellidos && telefono && correo && direccion){
        let query = `UPDATE empleados SET nombre='${nombre}', apellidos='${apellidos}',`;
        query += `telefono='${telefono}', correo='${correo}', direccion='${direccion}' WHERE empleado_id=${req.params.id};`;
        
        const rows = await db.query(query);

        if(rows.affectedRows == 1){
            return res.status(200).json({code: 200, message: "Empleado actualizado correctamente"});
        }
        return res.status(500).json({code: 500, message: "Empleado no encontrado"});
    }
    return res.status(500).json({code: 500, message: "Campos incompletos"});
});

empleados.get("/", async (req, res, next) =>{
    const emp = await db.query("SELECT * FROM empleados");
    return res.status(200).json({code: 200, message: emp});
});

empleados.get ('/:id', async (req, res, next) => {
    const idParam = req.params.id;

    if (!/^[0-9]{1,3}$/.test(idParam)) {
        next();
        return;
    }
    const id = req.params.id;
    if (id >= 0 && id <= 722) {
        const emp = await db.query("SELECT * FROM empleados WHERE empleado_id="+id+";"); 
        return res.status(200).json({code: 200, message: emp})
    } 
    return res.status(404).json({code: 404, message: "Empleado no encontrado"});
});

empleados.get('/:name', async (req, res, next) => {

    //condicion ? valor si verdadero : valor si falso

    const name = req.params.name;
    const emp = await db.query("SELECT * FROM empleados WHERE nombre='"+name+"';");

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(name)) {
        next();
        return;
    }

    if (emp.length > 0){
        return res.status(200).json({code: 200, message: emp});
    }
    return res.status(404).json({code: 404, message: "Empleado no encontrado"});
});

module.exports = empleados; 