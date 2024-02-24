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
        const metabolismoBasal = calcularMetabolismoBasal();
        const porcentajeGrasa = calcularPorcentajeGrasa();
        const cantidadGrasa = calcularCantidadGrasa(porcentajeGrasa);
        const cantidadMusculo = calcularCantidadMusculo(pesoKg, cantidadGrasa);
        const proteinaNecesaria = calcularProteinaNecesaria(cantidadMusculo);

        setResultados({
            imc: (pesoKg / Math.pow(alturaCm / 100, 2)).toFixed(2),
            metabolismoBasal: metabolismoBasal.toFixed(2),
            porcentajeGrasa: porcentajeGrasa.toFixed(2),
            cantidadGrasa: cantidadGrasa.toFixed(2),
            cantidadMusculo: cantidadMusculo.toFixed(2),
            proteinaNecesaria: proteinaNecesaria.toFixed(2)
        });
    };

    const calcularMetabolismoBasal = () => {
        const { sexo, edad, altura, peso } = datosUsuario;
        if (sexo === "Hombre") {
            return 66.5 + (13.8 * peso) + (5 * altura) - (6.8 * edad);
        } else {
            return 655 + (9.6 * peso) + (1.85 * altura) - (4.7 * edad);
        }
    };

    const calcularPorcentajeGrasa = () => {
        const { sexo, cintura, cuello, altura } = datosUsuario;
        if (sexo === "Hombre") {
            return 495 / (1.0324 - (0.19077 * Math.log(cintura - cuello)) + (0.15456 * Math.log(altura))) - 450;
        } else {
            return 495 / (1.29579 - (0.35004 * Math.log(cintura - cuello + parseFloat(datosUsuario.cadera))) + (0.221 * Math.log(altura))) - 450;
        }
    };

    const calcularCantidadGrasa = (porcentajeGrasa) => {
        return parseFloat(datosUsuario.peso) * (porcentajeGrasa / 100);
    };

    const calcularCantidadMusculo = (peso, cantidadGrasa) => {
        const { sexo } = datosUsuario;
        if (sexo === "Hombre") {
            return peso - cantidadGrasa - 3.1;
        } else {
            return peso - cantidadGrasa - 2.5;
        }
    };

    const calcularProteinaNecesaria = (cantidadMusculo) => {
        const { nivelActividad } = datosUsuario;
        if (nivelActividad === "alta") {
            return cantidadMusculo * 2.2;
        } else if (nivelActividad === "media") {
            return cantidadMusculo * 1.8;
        } else if (nivelActividad === "baja") {
            return cantidadMusculo * 1.2;
        } else {
            return 0;
        }
    };

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
            <div className="resultados">
                <h2>Resultados</h2>
                <p>IMC: {resultados.imc}</p>
                <p>Metabolismo Basal: {resultados.metabolismoBasal}</p>
                <p>% de Grasa: {resultados.porcentajeGrasa}</p>
                <p>Kg de Grasa: {resultados.cantidadGrasa}</p>
                <p>Kg de Músculo: {resultados.cantidadMusculo}</p>
                <p>Proteína Necesaria: {resultados.proteinaNecesaria}</p>
            </div>
        </div>
    );
};

export default Form;
