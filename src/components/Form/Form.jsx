import React, { useState } from 'react';
import './form.css'

const Form = () => {

    const [datosUsuario, setDatosUsuario] = useState({
        nombre: '',
        sexo: '',
        edad: '',
        altura: '',
        peso: '',
        cintura: '',
        cuello: '',
        cadera: '',
        nivelActividad: ''
    });

    const [resultados, setResultados] = useState({
        imc: '',
        metabolismoBasal: '',
        porcentajeGrasa: '',
        cantidadGrasa: '',
        cantidadMusculo: '',
        proteinaNecesaria: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatosUsuario({ ...datosUsuario, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Datos usuario: ", datosUsuario)
        const pesoKg = parseFloat(datosUsuario.peso);
        const alturaCm = datosUsuario.altura
        const alturaM = parseFloat(datosUsuario.altura) / 100;
        // const imc = pesoKg / (alturaM * alturaM);
        // const metabolismoBasal = calcularMetabolismoBasal();
        // const porcentajeGrasa = calcularPorcentajeGrasa();
        // const cantidadGrasa = calcularCantidadGrasa();
        // const cantidadMusculo = calcularCantidadMusculo();
        // const proteinaNecesaria = calcularProteinaNecesaria();

        // Actualizar resultados
        setResultados({
            // imc: imc.toFixed(2),
            // metabolismoBasal: metabolismoBasal.toFixed(2),
            // porcentajeGrasa: porcentajeGrasa.toFixed(2),
            // cantidadGrasa: cantidadGrasa.toFixed(2),
            // cantidadMusculo: cantidadMusculo.toFixed(2),
            // proteinaNecesaria: proteinaNecesaria.toFixed(2)
        });
    };

    // const calcularMetabolismoBasal = () => {
    //     // Implementa aquí el cálculo del metabolismo basal
    // };

    // const calcularPorcentajeGrasa = () => {
    //     // Implementa aquí el cálculo del % de grasa
    // };

    // const calcularCantidadGrasa = () => {
    //     // Implementa aquí el cálculo de la cantidad de grasa
    // };

    // const calcularCantidadMusculo = () => {
    //     // Implementa aquí el cálculo de la cantidad de músculo
    // };

    // const calcularProteinaNecesaria = () => {
    //     // Implementa aquí el cálculo de la proteína necesaria por día
    // };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                {/* Nombre */}
                <div className="form-group">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        className="form-control"
                        value={datosUsuario.nombre}
                        onChange={handleChange}
                        autoComplete='off'
                    />
                </div>
                {/* Sexo */}
                <div className="form-group">
                    <label> Sexo </label>
                    <select
                        name="sexo"
                        className="form-control"
                        value={datosUsuario.sexo}
                        onChange={handleChange}
                        autoComplete='off'
                    >
                        <option value="">Seleccione una opcion </option>
                        <option value="H"> Hombre </option>
                        <option value="M">Mujer</option>
                    </select>
                </div>
                {/* EDAD */}
                <div className="form-group">
                    <label> Edad </label>
                    <input
                        type="number"
                        name="edad"
                        className="form-control"
                        value={datosUsuario.edad}
                        onChange={handleChange}
                        autoComplete='off'
                    />
                </div>
                {/* ALTURA */}
                <div className="form-group">
                    <label> Altura (cm) </label>
                    <input
                        type="number"
                        name="altura"
                        className="form-control"
                        value={datosUsuario.altura}
                        onChange={handleChange}
                        autoComplete='off'
                    />
                </div>
                {/* PESO */}
                <div className="form-group">
                    <label> Peso (kg) </label>
                    <input
                        type="number"
                        name="peso"
                        className="form-control"
                        value={datosUsuario.peso}
                        onChange={handleChange}
                        autoComplete='off'
                    />
                </div>
                {/* CINTURA */}
                <div className="form-group">
                    <label> Cintura (cm) </label>
                    <input
                        type="number"
                        name="cintura"
                        className="form-control"
                        value={datosUsuario.cintura}
                        onChange={handleChange}
                        autoComplete='off'
                    />
                </div>
                {/* CUELLO */}
                <div className="form-group">
                    <label> Cuello (cm) </label>
                    <input
                        type="number"
                        name="cuello"
                        className="form-control"
                        value={datosUsuario.cuello}
                        onChange={handleChange}
                        autoComplete='off'
                    />
                </div>
                {/* CADERA */}
                <div className="form-group">
                    <label> Cadera (cm) </label>
                    <input
                        type="number"
                        name="cadera"
                        className="form-control"
                        value={datosUsuario.cadera}
                        onChange={handleChange}
                        autoComplete='off'
                    />
                </div>
                {/* NIVEL DE ACTIVIDAD FISICA */}
                <div className="form-group">
                    <label>Nivel de Actividad Física:</label>
                    <select
                        name="nivelActividad"
                        className="form-control"
                        value={datosUsuario.nivelActividad}
                        onChange={handleChange}
                        autoComplete='off'
                    >
                        <option value="">Seleccione un nivel</option>
                        <option value="alta">Alta</option>
                        <option value="media">Media</option>
                        <option value="baja">Baja</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">
                    Enviar
                </button>
            </form>
        </div>
    );
};

export default Form;
