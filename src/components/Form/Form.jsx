import React, { useState } from 'react';
import './form.css'

const Form = () => {

    const [formSent, setFormSent] = useState(false)

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
        setFormSent(true)
    };

    const calcularMetabolismoBasal = () => {
        const { sexo, edad, altura, peso } = datosUsuario;
        if (sexo === "H") {
            return 66.5 + (13.8 * peso) + (5 * altura) - (6.8 * edad);
        } else {
            return 655 + (9.6 * peso) + (1.85 * altura) - (4.7 * edad);
        }
    };

    const calcularPorcentajeGrasa = () => {
        const { sexo, cintura, cuello, altura, cadera } = datosUsuario;

        const cinturaNum = parseFloat(cintura);
        const cuelloNum = parseFloat(cuello);
        const alturaNum = parseFloat(altura);
        const caderaNum = parseFloat(cadera);

        if (sexo === "H") {
            return (495 / (1.0324 - 0.19077 * Math.log10(cinturaNum - cuelloNum) + 0.15456 * Math.log10(alturaNum))) - 450
        } else {
            return (495 / (1.29579 - 0.35004 * Math.log10(cinturaNum + caderaNum - cuelloNum) + 0.22100 * Math.log10(alturaNum))) - 450
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
            return cantidadMusculo * 2.5;
        } else if (nivelActividad === "media") {
            return cantidadMusculo * 1.3;
        } else if (nivelActividad === "baja") {
            return cantidadMusculo * 1;
        } else {
            return 0;
        }
    };

    return (
        <div className="form-container">
            <div className="formulario">
                <form onSubmit={handleSubmit}>
                    <h4 className='pb-2'> Ingresa tus datos aqui </h4>
                    {/* Nombre */}
                    <div className="form-group">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            name="nombre"
                            placeholder='Ingrese su nombre'
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
                            placeholder='Ingrese su edad'
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
                            placeholder='Ingrese su altura (cm)'
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
                            placeholder='Ingrese su peso (kg)'
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
                            placeholder='Ingrese las medidas de su cintura (cm)'
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
                            placeholder='Ingrese las medidas de su cuello (cm)'
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
                            placeholder='Ingrese las medidas de su cadera (cm)'
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
                    <button type="submit" className="btn enviar-btn">
                        Enviar
                    </button>
                </form>
            </div>
            <div className="resultados">
                <h4 className='pb-4'>Resultados</h4>
                <div className='result-ctn'>
                    <div> <b> IMC (Indice de Masa Corporal): </b> {resultados.imc} </div>
                    {formSent && resultados.imc && (
                        <p>
                            {resultados.imc < 15 ? 'Está muy bajo (demasiado bajo)' :
                                resultados.imc >= 15 && resultados.imc <= 25 ? 'Está en un rango saludable' :
                                    resultados.imc > 25 && 'Está muy alto (demasiado alto)'}
                        </p>
                    )}
                </div>
                <div className='result-ctn'>
                    <div> <b> Metabolismo basal: </b> {resultados.metabolismoBasal} </div>
                    {/* <b> Metabolismo Basal: </b>
                    <p> {resultados.metabolismoBasal}</p> */}
                </div>
                <div className='result-ctn'>
                    <div> <b> % De Grasa: </b> {resultados.porcentajeGrasa} </div>
                    {formSent && resultados.porcentajeGrasa && (
                        <p>
                            {resultados.porcentajeGrasa < 15 ? 'Está muy bajo (demasiado bajo)' :
                                resultados.porcentajeGrasa >= 15 && resultados.porcentajeGrasa <= 25 ? 'Está en un rango saludable' :
                                    resultados.porcentajeGrasa > 25 && 'Está muy alto (demasiado alto)'}
                        </p>
                    )}
                    {/* <b> % De Grasa: </b>
                    <p> {resultados.porcentajeGrasa}</p> */}
                </div>
                <div className='result-ctn'>
                    <div> <b> Kg De Grasa: </b> {resultados.cantidadGrasa} </div>
                    {/* <b> KG De Grasa: </b>
                    <p> {resultados.cantidadGrasa}</p> */}
                </div>
                <div className='result-ctn'>
                    <div> <b> Kg De Musculo: </b> {resultados.cantidadMusculo} </div>
                    {/* <b> KG De Musculo: </b>
                    <p> {resultados.cantidadMusculo}</p> */}
                </div>
                <div className='result-ctn'>
                    <div> <b> Proteina diaria necesaria: </b> {resultados.proteinaNecesaria} gramos </div>
                    {/* <b> Proteina Diaria Necesaria: </b>
                    <p> {resultados.proteinaNecesaria}</p> */}
                </div>
            </div>
        </div>
    );
};

export default Form;
