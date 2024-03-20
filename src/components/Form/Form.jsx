import React, { useState } from 'react';
import './form.css'

const Form = () => {

    const [formSent, setFormSent] = useState(false)
    const [litrosDia, setLitrosDia] = useState(0)

    const [datosUsuario, setDatosUsuario] = useState({
        nombre: '',
        sexo: '',
        edad: '',
        altura: '',
        peso: '',
        cintura: '',
        cuello: '',
        cadera: '',
        hidratacion: '',
        nivelActividad: '',
    });

    const [resultados, setResultados] = useState({
        imc: '',
        metabolismoBasal: '',
        porcentajeGrasa: '',
        cantidadGrasa: '',
        cantidadMusculo: '',
        hidratacionNecesaria: '',
        proteinaNecesaria: '',
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
        setLitrosDia((datosUsuario.hidratacion * 250) / 1000) // cuanto toma
        const hidratacionNecesaria = calcularHidratacionDiaria(pesoKg); // cuanto necesita tomar
        setResultados({
            imc: (pesoKg / Math.pow(alturaCm / 100, 2)).toFixed(2),
            metabolismoBasal: metabolismoBasal.toFixed(2),
            porcentajeGrasa: porcentajeGrasa.toFixed(2),
            cantidadGrasa: cantidadGrasa.toFixed(2),
            cantidadMusculo: cantidadMusculo.toFixed(2),
            proteinaNecesaria: proteinaNecesaria.toFixed(2),
            hidratacionNecesaria: hidratacionNecesaria.toFixed(1)
        });
        setFormSent(true)
        console.log("Datos usuario: ", datosUsuario)
        console.log("Resultados", resultados);
        console.log("litros que toma por dia", litrosDia)
        console.log("litros que debe tomar", resultados.hidratacionNecesaria)
    };

    const calcularMetabolismoBasal = () => {
        const { sexo, edad, altura, peso } = datosUsuario;
        if (sexo === "H") {
            return 66 + (13.7 * peso) + (5 * altura) - (6.8 * edad);
        } else {
            return 655 + (9.6 * peso) + (1.8 * altura) - (4.7 * edad);
        }
    };

    const calcularPorcentajeGrasa = () => {
        const { sexo, cintura, cuello, altura, cadera } = datosUsuario;

        const cinturaNum = parseFloat(cintura);
        const cuelloNum = parseFloat(cuello);
        const alturaNum = parseFloat(altura);
        const caderaNum = parseFloat(cadera);

        if (sexo === "H") {
            return (495 / (1.0324 - 0.19077 * Math.log10(cinturaNum - cuelloNum) + 0.15456 * Math.log10(alturaNum))) - 451
        } else {
            return (495 / (1.29579 - 0.35004 * Math.log10(cinturaNum + caderaNum - cuelloNum) + 0.22100 * Math.log10(alturaNum))) - 451
        }
    };

    const calcularCantidadGrasa = (porcentajeGrasa) => {
        return parseFloat(datosUsuario.peso) * (porcentajeGrasa / 100);
    };

    const calcularHidratacionDiaria = (peso) => {
        return peso * 0.04
    }

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
            return cantidadMusculo * 1.5;
        } else if (nivelActividad === "baja") {
            return cantidadMusculo * 1.2;
        } else {
            return 0;
        }
    };

    function getPercentageGrasaColor() {
        const { sexo, edad } = datosUsuario;
        const { porcentajeGrasa } = resultados;

        if (sexo === "H") {
            if (edad > 18 && edad <= 39) {
                if (porcentajeGrasa < 8) return '#F7BF09'; // amarillo
                if (porcentajeGrasa >= 8 && porcentajeGrasa < 20) return '#008640'; // verde
                if (porcentajeGrasa >= 20 && porcentajeGrasa < 26) return '#FF5E00'; // naranja
                if (porcentajeGrasa >= 26) return 'red';
            } else if (edad > 39 && edad <= 59) {
                if (porcentajeGrasa < 11) return '#F7BF09'; // amarillo
                if (porcentajeGrasa >= 11 && porcentajeGrasa < 22) return '#008640'; // verde
                if (porcentajeGrasa >= 22 && porcentajeGrasa < 30) return '#FF5E00'; // naranja
                if (porcentajeGrasa >= 30) return 'red';
            } else if (edad > 59) {
                if (porcentajeGrasa < 13) return '#F7BF09'; // amarillo
                if (porcentajeGrasa >= 13 && porcentajeGrasa < 31) return '#008640'; // verde
                if (porcentajeGrasa >= 31 && porcentajeGrasa < 37) return '#FF5E00'; // naranja
                if (porcentajeGrasa >= 37) return 'red';
            }
        }

        if (sexo === "M") {
            if (edad > 18 && edad <= 39) {
                if (porcentajeGrasa < 21) return '#F7BF09'; // amarillo
                if (porcentajeGrasa >= 21 && porcentajeGrasa < 33) return '#008640'; // verde
                if (porcentajeGrasa >= 33 && porcentajeGrasa < 39) return '#FF5E00'; // naranja
                if (porcentajeGrasa >= 39) return 'red';
            } else if (edad > 39 && edad <= 59) {
                if (porcentajeGrasa < 23) return '#F7BF09'; // amarillo
                if (porcentajeGrasa >= 23 && porcentajeGrasa < 34) return '#008640'; // verde
                if (porcentajeGrasa >= 34 && porcentajeGrasa < 40) return '#FF5E00'; // naranja
                if (porcentajeGrasa >= 40) return 'red';
            } else if (edad > 59) {
                if (porcentajeGrasa < 24) return '#F7BF09'; // amarillo
                if (porcentajeGrasa >= 24 && porcentajeGrasa < 36) return '#008640'; // verde
                if (porcentajeGrasa >= 36 && porcentajeGrasa < 42) return '#FF5E00'; // naranja
                if (porcentajeGrasa >= 42) return 'red';
            }
        }

        return 'black';
    }


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
                    {/* VASOS DE AGUA POR DIA */}
                    <div className="form-group">
                        <label> Cantidad de vasos de agua pura por dia:</label>
                        <input
                            type="number"
                            name="hidratacion"
                            placeholder='Ingrese cuantos vasos de agua bebe al dia aprox.'
                            className="form-control"
                            value={datosUsuario.hidratacion}
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
                            <option value="alta">Alta (5 o más entrenamientos por semana)</option>
                            <option value="media">Media (3 entrenamientos por semana)</option>
                            <option value="baja">Baja (Casi sedentario)</option>
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
                    <div> <b> IMC (Indice de Masa Corporal): <span style={{
                        color:
                            resultados.imc < 18.5 ? '#F7BF09' : // amarillo
                                resultados.imc >= 18.5 && resultados.imc <= 24.9 ? '#008640' : // verde
                                    resultados.imc >= 25 && resultados.imc <= 29.9 ? '#F7BF09' :
                                        resultados.imc >= 30 && resultados.imc <= 39.9 ? '#FF5E00' : // naranja
                                            resultados.imc > 40 && 'red'
                    }}>{resultados.imc}</span> </b></div>
                </div>
                <div className='result-ctn'>
                    <div> <b> Metabolismo basal: </b> <span> {resultados.metabolismoBasal} </span> </div>
                </div>
                <div className='result-ctn'>
                    <div>
                        <b> % De Grasa:{' '}
                            <span style={{ color: getPercentageGrasaColor() }}>
                                {resultados.porcentajeGrasa}
                            </span>
                        </b>
                    </div>
                </div>
                <div className='result-ctn'>
                    <div> <b> Kg De Musculo: </b> {resultados.cantidadMusculo} </div>
                </div>
                <div className='result-ctn'>
                    <div> <b> Proteina diaria necesaria: </b> {resultados.proteinaNecesaria} gramos </div>
                </div>
                <div className='result-ctn'>
                    <div> <b> Hidratación diaria: </b> {resultados.hidratacionNecesaria} litros </div>
                </div>
                {formSent && (
                    <div className='result-ctn'>
                        <h4> Tus resultados: </h4>
                        <div>
                            {/* IMC */}
                            {resultados.imc < 18.5 && (
                                <p>
                                    El <b>Índice de Masa Muscular</b> indica que en este momento estás por debajo del peso ideal.
                                    Es necesario subir el peso a través de aumentar la masa muscular como la masa grasa hasta llegar a los valores de equilibrio saludables.
                                    En el caso que tu masa grasa este normal o en exceso, que puede suceder, será necesario concentrarse en aumentar la masa muscular a través de reforzar el ejercicio de esfuerzo y el consumo de una mayor cantidad de proteína.
                                </p>
                            )}
                            {resultados.imc >= 18.5 && resultados.imc <= 24.9 && (
                                <p>
                                    El <b>Índice de Masa Muscular</b> indica que en este momento estás en valores normales, donde el cuerpo además de conservar una forma estilizada, tendrá buenos niveles de energía y funcionará óptimamente.

                                    Este valor debe verse como algo positivo y también considerar los demás valores ya que aún teniendo el IMC en valores normales puede haber exceso de grasa corporal a corregir.
                                </p>
                            )}
                            {resultados.imc >= 25 && resultados.imc <= 29.9 && (
                                <p>
                                    El <b>Índice de Masa Muscular</b> indica que en este momento estás con sobrepeso, donde estas expuesto al riesgo de desarrolar enfermedades cardiovasculares, diabetes tipo 2, hipertensión y otros problemas de salud.
                                </p>
                            )}
                            {resultados.imc >= 30 && resultados.imc <= 39.9 && (
                                <p>
                                    El <b>Índice de Masa Muscular</b> indica que en este momento estás expuesto a correr riesgo significativamente elevado de enfermedades crónicas, más allá de las enfermedades cardiovasculares, diabetes tipo 2 e hipertensión propias de un estado anterior de sobrepeso.
                                </p>
                            )}
                            {resultados.imc > 40 && (
                                <p>
                                    El <b>Índice de Masa Muscular</b> indica que en este momento estás con altísimo riesgo de enfermedades crónicas además de estar con falta de energía, un mal descanso y poca recuperación física, a complicaciones cardiovasculares, diabetes tipo 2 e hipertensión propias de los estados anteriores de sobrepeso y obesidad.
                                </p>
                            )}
                            <br />
                            {/* HIDRATACION */}
                            {litrosDia < resultados.hidratacionNecesaria ? (
                                <p>
                                    La <b>hidratación</b> es fundamental para el funcionamiento óptimo de nuestro cuerpo. Hoy te hidratas con {litrosDia} litros y tu hidratación ideal es con {resultados.hidratacionNecesaria} litros diarios, por lo que debes tomar {(resultados.hidratacionNecesaria - litrosDia).toFixed(1)} litros al día para llegar al número ideal.
                                </p>
                            ) : (
                                <p>
                                    La <b>hidratación</b> es fundamental para el funcionamiento óptimo de nuestro cuerpo. No es necesario un ajuste en la cantidad y sigue con este hábito. ¡FELICITACIONES!
                                </p>
                            )}

                        </div>
                    </div>
                )}

            </div>
        </div >
    );
};

export default Form;
