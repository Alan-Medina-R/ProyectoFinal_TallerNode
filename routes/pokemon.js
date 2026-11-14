const express = require("express");
const pokemon = express.Router();
const db = require("../config/database");

pokemon.post("/", async (req, res, next) =>{
    const {pok_name, pok_height, pok_weight, pok_base_experience} = req.body;

    if(pok_name && pok_height && pok_weight && pok_base_experience){
        let query = "INSERT INTO pokemon(pok_name, pok_height, pok_weight, pok_base_experience)";
        query += ` VALUES('${pok_name}', ${pok_height}, ${pok_weight}, ${pok_base_experience})`;
        
        const rows = await db.query(query);

        if(rows.affectedRows == 1){
            return res.status(201).json({code: 201, message: "Pokemon creado correctamente"});
        }
        return res.status(500).json({code: 500, message: "Error al crear el Pokemon"});
    }
    return res.status(500).json({code: 500, message: "Campos incompletos"});
});

pokemon.delete("/:id", async (req, res, next) => {
    const idParam = req.params.id;

    if (!/^[0-9]{1,3}$/.test(idParam)) {
        next();
        return;
    }
    const query = `DELETE FROM pokemon WHERE pok_id=${req.params.id}`;

    const rows = await db.query(query);

    if(rows.affectedRows == 1){
        return res.status(200).json({code: 200, message: "Pokemon eliminado correctamente"});
    }
    return res.status(404).json({code: 404, message: "Pokemon no encontrado"}); 
});

pokemon.put("/:id", async (req, res, next) => {
    const idParam = req.params.id;

    if (!/^[0-9]{1,3}$/.test(idParam)) {
        next();
        return;
    }

    const {pok_name, pok_height, pok_weight, pok_base_experience} = req.body;

    if(pok_name && pok_height && pok_weight && pok_base_experience){
        let query = `UPDATE pokemon SET pok_name='${pok_name}', pok_height=${pok_height},`;
        query += `pok_weight=${pok_weight}, pok_base_experience=${pok_base_experience} WHERE pok_id=${req.params.id};`;
            
        const rows = await db.query(query);

        if(rows.affectedRows == 1){
            return res.status(200).json({code: 200, message: "Pokemon actualizado correctamente"});
        }
        return res.status(500).json({code: 500, message: "Error al actualizar el Pokemon"});
    }
    return res.status(500).json({code: 500, message: "Campos incompletos"});
});

pokemon.patch("/:id", async (req, res, next) => {
    const idParam = req.params.id;

    if (!/^[0-9]{1,3}$/.test(idParam)) {
        next();
        return;
    }

    if(req.body.pok_name){
        let query = `UPDATE pokemon SET pok_name='${req.body.pok_name}' WHERE pok_id=${req.params.id}`;
        
        const rows = await db.query(query);

        if(rows.affectedRows == 1){
            return res.status(200).json({code: 200, message: "Pokemon actualizado correctamente"});
        }
        return res.status(500).json({code: 500, message: "Error al actualizar el Pokemon"});
    }
    return res.status(500).json({code: 500, message: "Campos incompletos"});
});

pokemon.get("/", async (req, res, next) =>{
    const pkmn = await db.query("SELECT * FROM pokemon");
    return res.status(200).json({code: 200, meessage:pkmn});
});

pokemon.get ('/:id', async (req, res, next) => {
    const idParam = req.params.id;

    if (!/^[0-9]{1,3}$/.test(idParam)) {
        next();
        return;
    }
    const id = req.params.id;
    if (id >= 0 && id <= 722) {
        const pkmn = await db.query("SELECT * FROM pokemon WHERE pok_id="+id+";"); 
        return res.status(200).json({code: 200, message: pkmn})
    } 
    return res.status(404).json({code: 404, message: "Pokemon no encontrado"});
});

pokemon.get('/:name', async (req, res, next) => {

    //condicion ? valor si verdadero : valor si falso

    const name = req.params.name;
    const pkmn = await db.query("SELECT * FROM pokemon WHERE pok_name='"+name+"';");

    if (!/^[A-Za-z]+$/.test(name)) {
        next();
        return;
    }

    if (pkmn.length > 0){
        return res.status(200).json({code: 200, message: pkmn});
    }
    return res.status(404).json({code: 404, message: "Pokemon no encontrado"});
});

module.exports = pokemon;