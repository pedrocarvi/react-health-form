import React, { useEffect, useState } from 'react';
import './form.css'
import menLowImcImage from '../../assets/men-lowimc.png'
import menHealthyImcImage from '../../assets/men-healthy.png'
import menOverweightImcImage from '../../assets/men_overweight.png'
import menObeseImcImage from '../../assets/men_obese.png'
import menOverObeseImcImage from '../../assets/men_overobese.png'
import womenLowImcImage from '../../assets/women-lowimc.png'
import womenHealthyImcImage from '../../assets/women-healthy.png'
import womenOverweightImcImage from '../../assets/women_overweight.png'
import womenObeseImcImage from '../../assets/women_obese.png'
import womenOverObeseImcImage from '../../assets/women_overobese.png'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Form = () => {

    const [formSent, setFormSent] = useState(false);
    const [litrosDia, setLitrosDia] = useState(0);

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
        rangoIdealGrasa: '',
        imcImage: '',
        estadoGrasa: '',
        estadoPersona: '',
        nivelMusculatura: '',
        complexionFisica: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatosUsuario({ ...datosUsuario, [name]: value });
    };

    useEffect(() => {
        console.log('resultados: ', resultados);
    }, [resultados]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Reviso de captar bien la informacion
        console.log("Datos usuario: ", datosUsuario)
        // Seteo los resultados        
        const pesoKg = parseFloat(datosUsuario.peso);
        const alturaCm = datosUsuario.altura
        const imc = (pesoKg / Math.pow(alturaCm / 100, 2)).toFixed(2)
        // Reviso orden de las funciones
        const metabolismoBasal = calcularMetabolismoBasal();
        console.log("1 - metabolismo basal", metabolismoBasal)
        //
        const porcentajeGrasa = calcularPorcentajeGrasa();
        console.log("2 - porcentaje grasa", porcentajeGrasa)
        //
        const cantidadGrasa = calcularCantidadGrasa(porcentajeGrasa);
        console.log("3 - kg grasa", cantidadGrasa)
        //
        const cantidadMusculo = calcularCantidadMusculo(pesoKg, cantidadGrasa);
        console.log("4 - kg musculo", cantidadMusculo)
        //
        const proteinaNecesaria = calcularProteinaNecesaria(cantidadMusculo);
        console.log("5 - proteina necesaria", proteinaNecesaria)
        //
        setLitrosDia((datosUsuario.hidratacion * 250) / 1000) // cuanto toma
        const hidratacionNecesaria = calcularHidratacionDiaria(pesoKg); // cuanto necesita tomar
        //
        const rangoIdealGrasa = calculateIdealFatRange(datosUsuario)
        console.log('6 - rango ideal de grasa', rangoIdealGrasa)
        //
        const imcImage = getIMCImage(imc);
        console.log('7 - imcImage', imcImage)
        // 
        const estadoPersona = getPercentageGrasaEstado(porcentajeGrasa);
        console.log('8 - estado persona grasa', estadoPersona)
        //
        const nivelMusculatura = calcularNivelMusculatura(cantidadMusculo);
        console.log('9 - nivel musculatura', nivelMusculatura)
        //
        const complexionFisica = getComplexionFisica(nivelMusculatura, estadoPersona)
        console.log('10 - complexion fisica', complexionFisica)

        setResultados({
            imc: imc,
            metabolismoBasal: metabolismoBasal.toFixed(2),
            porcentajeGrasa: porcentajeGrasa.toFixed(2),
            cantidadGrasa: cantidadGrasa.toFixed(2),
            cantidadMusculo: cantidadMusculo.toFixed(2),
            proteinaNecesaria: proteinaNecesaria.toFixed(2),
            hidratacionNecesaria: hidratacionNecesaria.toFixed(1),
            rangoIdealGrasa: rangoIdealGrasa,
            imcImage: imcImage,
            estadoPersona: estadoPersona,
            nivelMusculatura: nivelMusculatura,
            complexionFisica: complexionFisica
        });
        console.log('resultados: ', resultados)
        setFormSent(true)
    };

    const {
        nombre,
        sexo,
        edad,
        altura,
        peso,
        cintura,
        cuello,
        cadera,
        hidratacion,
        nivelActividad
    } = datosUsuario;

    const todosCamposLlenos =
        nombre !== '' &&
        sexo !== '' &&
        edad !== '' &&
        altura !== '' &&
        peso !== '' &&
        cintura !== '' &&
        cuello !== '' &&
        cadera !== '' &&
        hidratacion !== '' &&
        nivelActividad !== '';

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

    function getPercentageGrasaEstado(porcentajeGrasa) {
        const { sexo, edad } = datosUsuario;

        if (sexo === "H") {
            if (edad > 18 && edad <= 39) {
                if (porcentajeGrasa < 8) return 'Flaca';
                else if (porcentajeGrasa >= 8 && porcentajeGrasa < 20) return 'Normal';
                else if (porcentajeGrasa >= 20 && porcentajeGrasa < 26) return 'Sobrepeso';
                else return 'Obeso';
            } else if (edad > 39 && edad <= 59) {
                if (porcentajeGrasa < 11) return 'Flaca';
                else if (porcentajeGrasa >= 11 && porcentajeGrasa < 22) return 'Normal';
                else if (porcentajeGrasa >= 22 && porcentajeGrasa < 30) return 'Sobrepeso';
                else return 'Obeso';
            } else if (edad > 59) {
                if (porcentajeGrasa < 13) return 'Flaca';
                else if (porcentajeGrasa >= 13 && porcentajeGrasa < 31) return 'Normal';
                else if (porcentajeGrasa >= 31 && porcentajeGrasa < 37) return 'Sobrepeso';
                else return 'Obeso';
            }
        }

        if (sexo === "M") {
            if (edad > 18 && edad <= 39) {
                if (porcentajeGrasa < 21) return 'Flaca';
                else if (porcentajeGrasa >= 21 && porcentajeGrasa < 33) return 'Normal';
                else if (porcentajeGrasa >= 33 && porcentajeGrasa < 39) return 'Sobrepeso';
                else return 'Obeso';
            } else if (edad > 39 && edad <= 59) {
                if (porcentajeGrasa < 23) return 'Flaca';
                else if (porcentajeGrasa >= 23 && porcentajeGrasa < 34) return 'Normal';
                else if (porcentajeGrasa >= 34 && porcentajeGrasa < 40) return 'Sobrepeso';
                else return 'Obeso';
            } else if (edad > 59) {
                if (porcentajeGrasa < 24) return 'Flaca';
                else if (porcentajeGrasa >= 24 && porcentajeGrasa < 36) return 'Normal';
                else if (porcentajeGrasa >= 36 && porcentajeGrasa < 42) return 'Sobrepeso';
                else return 'Obeso';
            }
        }
    }

    function getIMCImage(imc) {
        const { sexo } = datosUsuario;
        let imagenImc = ''

        if (sexo === 'H') {
            if (imc <= 18.5) imagenImc = menLowImcImage;
            if (imc > 18.5 && imc <= 25) imagenImc = menHealthyImcImage;
            if (imc > 25 && imc <= 30) imagenImc = menOverweightImcImage;
            if (imc > 30 && imc <= 40) imagenImc = menObeseImcImage;
            if (imc > 40) imagenImc = menOverObeseImcImage
        } else {
            if (imc <= 18.5) imagenImc = womenLowImcImage;
            if (imc > 18.5 && imc <= 25) imagenImc = womenHealthyImcImage;
            if (imc > 25 && imc <= 30) imagenImc = womenOverweightImcImage;
            if (imc > 30 && imc <= 40) imagenImc = womenObeseImcImage;
            if (imc > 40) imagenImc = womenOverObeseImcImage;
        }

        return imagenImc;
    }

    const calculateIdealFatRange = (datosUsuario) => {
        const { sexo, edad } = datosUsuario;
        let minRange, maxRange;

        if (sexo === 'H') {
            if (edad >= 18 && edad <= 39) {
                minRange = 8;
                maxRange = 20;
            } else if (edad > 39 && edad <= 59) {
                minRange = 11;
                maxRange = 22;
            } else {
                minRange = 13;
                maxRange = 31
            }
        } else if (sexo === 'M') {
            if (edad >= 18 && edad <= 39) {
                minRange = 21;
                maxRange = 33;
            } else if (edad > 39 && edad <= 59) {
                minRange = 23;
                maxRange = 34;
            } else {
                minRange = 24;
                maxRange = 36;
            }
        }

        return `${minRange}%-${maxRange}%`
    };

    const calcularNivelMusculatura = (cantidadMusculo) => {
        const { peso } = datosUsuario;
        const porcentajeMusculatura = ((cantidadMusculo.toFixed(2) * 100) / peso).toFixed(2)
        // si la cantidad de musculo es mas de un 75% del total del peso es alto
        // si es entre 50 y 75 es normal
        // si es menos de 50 es bajo
        if (porcentajeMusculatura < 50) {
            return 'Baja'
        } else if (porcentajeMusculatura >= 50 && porcentajeMusculatura < 75) {
            return 'Media'
        } else {
            return 'Alta'
        }
    }

    const getComplexionFisica = (nivelMusculatura, estadoPersona) => {

        console.log('get complex fisica data', nivelMusculatura, ' ', estadoPersona)

        if (estadoPersona === "Obeso" && nivelMusculatura === "Baja") {
            return "Muy excesiva"
        } else if (estadoPersona === "Sobrepeso" && nivelMusculatura === "Baja") {
            return "Sobrepeso"
        } else if (estadoPersona === "Normal" && nivelMusculatura === "Media") {
            return "Normal"
        } else if (estadoPersona === "Normal" && nivelMusculatura === "Alta") {
            return "Entrenada"
        } else if (estadoPersona === "Flaca" && nivelMusculatura === "Alta") {
            return "Delgada"
        }

    }

    function generatePDF() {
        const container = document.getElementById('containerId'); // Replace 'containerId' with your container's ID
        // Adjusted dimensions for A4 paper size with 40px padding
        const pdfWidth = 210; // A4 width in mm
        const pdfHeight = 297; // A4 height in mm
        const padding = 40; // 40px padding
        const imgWidth = pdfWidth - (padding * 2); // Adjusted width for content
        const imgHeight = pdfHeight - (padding * 2); // Adjusted height for content

        html2canvas(container).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            let position = padding; // Starting position with padding

            pdf.addImage(imgData, 'PNG', padding, position, imgWidth, imgHeight);

            pdf.save('generated.pdf');
        });
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
                    <button type="submit" className="btn enviar-btn" disabled={!todosCamposLlenos}>
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
                            <span style={{
                                color:
                                    resultados.estadoPersona === "Flaca" ? '#F7BF09' :
                                        resultados.estadoPersona === "Normal" ? '#008640' :
                                            resultados.estadoPersona === "Sobrepeso" ? '#FF5E00' :
                                                resultados.estadoPersona === "Obeso" ? 'red' :
                                                    'black'
                            }}>
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
                    <div className='result-ctn' id="containerId">
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
                            {/* IMC IMAGE */}
                            <div className='imcImage-container d-flex align-items-center w-100'>
                                {<img src={resultados.imcImage} alt="IMC" className='imcImage' />}
                            </div>
                            <br />
                            {/* RESULTADOS GRASA */}
                            {
                                resultados.estadoPersona === "Flaca" && (
                                    <p>
                                        Tu <b> Porcentaje de grasa </b> es de {resultados.porcentajeGrasa}%. Este porcentaje de grasa es bajo para {datosUsuario.sexo === "H" ? 'un hombre' : 'una mujer'} de tu estatura y peso. El impacto de un porcentaje de grasa bajo es desarrollar problemas de índole hormonal, inmunológicos, insatisfacciones estéticas por nombrar algunos.
                                    </p>
                                )
                            }
                            {
                                resultados.estadoPersona === "Normal" && (
                                    <p>
                                        Tu <b> Porcentaje de grasa </b> es de {resultados.porcentajeGrasa}%. Este porcentaje de grasa está dentro de valores normales para {datosUsuario.sexo === "H" ? 'un hombre' : 'una mujer'} de tu estatura y peso. Lo ideal siempre es estar en un rango de {resultados.rangoIdealGrasa} siempre y cuando tu masa muscular esté bien equilibrada.
                                        <br />
                                        En este estado deberías tener buen nivel de energía, descanso reparador y óptimo funcionamiento de tu organismo.
                                    </p>
                                )
                            }
                            {
                                resultados.estadoPersona === "Sobrepeso" && (
                                    <p>
                                        Tu <b> Porcentaje de grasa </b> es de {resultados.porcentajeGrasa}%. Este porcentaje de grasa está alto para {datosUsuario.sexo === "H" ? 'un hombre' : 'una mujer'} de tu estatura y peso. Lo ideal siempre es estar en un rango de {resultados.rangoIdealGrasa} acompañado con una masa muscular equilibrada.
                                        <br /><br />
                                        ¿Qué le pasa al cuerpo cuando la masa grasa se encuentra en este valor? Comienza a predisponer al organismo a un funcionamiento forzado para el que no está preparado y con ello comienzan a llegar síntomas que muchas veces no atendemos como por ej. irritabilidad, mal descanso, falta de energía, dolores de cabeza. Todo eso deriva en el desarrollo de enfermedades hoy muy comunes como hipertensión, diabetes, etc.
                                        <br /><br />
                                        En la mayoría de los casos la masa grasa aumenta por lo que comemos y por lo que dejamos de comer. Muchas veces no comprendemos bien este concepto que es tan simple y que si fuéramos a su raíz, lo solucionaríamos y viviríamos en alto grado de bienestar
                                    </p>
                                )
                            }
                            {
                                resultados.estadoPersona === "Obeso" && (
                                    <p>
                                        Tu <b> Porcentaje de grasa </b> es de {resultados.porcentajeGrasa}%. Este porcentaje de grasa está muy alto para {datosUsuario.sexo === "H" ? 'un hombre' : 'una mujer'} de tu estatura y peso. Lo ideal siempre es estar en un rango de {resultados.rangoIdealGrasa} acompañado con una masa muscular equilibrada.
                                        <br /><br />
                                        ¿Qué le pasa al cuerpo cuando la masa grasa se encuentra en este valor? El cuerpo en su funcionamiento se ve forzado por el exceso de esta masa grasa y falta la energía, el rendimiento disminuye, le cuesta oxigenarse, afecta la buena digestión y comienzan las enfermedades crónicas como hipertensión, diabetes, enfermedades cardiovasculares, accidentes cerebrovasculares y algunos tipos de cáncer.
                                        <br /><br />
                                        En la mayoría de los casos el aumento de la masa grasa comenzó por lo que comemos y por lo que dejamos de comer. Muchas veces no comprendemos bien este concepto que es tan simple y que si fuéramos a su raíz, lo solucionaríamos y viviríamos en alto grado de bienestar.
                                    </p>
                                )
                            }
                            <br />
                            {/* COMPLEXION FISICA */}
                            {
                                resultados.complexionFisica === "Delgada" && (
                                    <p>
                                        Tu <b> Complexión Física </b> es {resultados.complexionFisica}, tienes niveles de grasa y músculo bajos.En esta combinación predomina la insatisfacción por cómo te ves y como estas rindiendo en tus actividades. Por lo general hay falta de energía y concentración, bajo rendimiento físico y mental; el descanso siempre suele ser insuficiente sin importar las horas dormidas. Claramente es necesario elevar la masa grasa como la masa muscular y la solución nunca está en comer más, sino en cambiar la calidad de la alimentación, bajar el estrés y permitir que el cuerpo absorba mejor. Subir estos valores de manera saludable lleva más dedicación y tiempo si lo comparamos con las personas que buscan bajar de peso.
                                    </p>
                                )
                            }
                            {
                                resultados.complexionFisica === "Entrenada" && (
                                    <p>
                                        Tu <b> Complexión Física </b> es {resultados.complexionFisica}, tienes niveles de grasa bajos y músculo altos.Esta combinación es la ideal para transitar la vida con bienestar y de manera saludable, donde mirarnos al espejo es un deleite y usar la ropa que nos gusta un placer total. Se destaca la tonicidad muscular y la forma estilizada del cuerpo, los niveles de energía, concentración, resistencia y descanso como recuperación, deberían ser óptimos y si no lo son en tu caso, será necesario reforzar los aportes nutricionales ya que en el entrenamiento se produce mayor oxidación y el requerimiento proteico se eleva. Asegúrate de tener cubiertas todos los días todas estas demandas.
                                    </p>
                                )
                            }
                            {
                                resultados.complexionFisica === "Normal" && (
                                    <p>
                                        Tu <b> Complexión Física </b>  es {resultados.complexionFisica}, tienes niveles de grasa y músculo normales.Esta combinación es la ideal para transitar la vida con bienestar y de manera saludable, donde mirarnos al espejo es un deleite y usar la ropa que nos gusta un placer total. En este estado, los niveles de energía, concentración, resistencia y descanso como recuperación, deberían ser óptimos y si no lo son en tu caso, será necesario reforzar los aportes nutricionales para que esto ocurra, ya que aún con estos valores pueden ocurrir desajustes a nivel celular que obstaculicen el funcionamiento óptimo de nuestro organismo.
                                    </p>
                                )
                            }
                            {
                                resultados.complexionFisica === "Sobrepeso" && (
                                    <p>
                                        Tu <b> Complexión Física </b>  es {resultados.complexionFisica}, tienes niveles de grasa altos y músculo bajos.En esta combinación el cuerpo comienza a cambiar la forma, los niveles de energía y rendimiento físico disminuyen, comienza la propensión al desarrollo de enfermedades que pueden transformarse en crónicas, el apetito se descontrola y la predilección por más harinas y dulces toman protagonismo.
                                    </p>
                                )
                            }
                            {
                                resultados.complexionFisica === "Muy excesiva" && (
                                    <p>
                                        Tu <b> Complexión Física </b>  es {resultados.complexionFisica}, tienes niveles de grasa muy altos y músculo muy bajos.Es la combinación en donde el cuerpo sufre más y está altamente expuesto a desarrollar enfermedades crónicas. Con la degradación de masa muscular disminuye la fuerza, los niveles de energía y resistencia para el funcionamiento cotidiano. El cuerpo pierde mucha tonicidad y cambia de manera aguda la forma.
                                    </p>
                                )
                            }
                            {/* HIDRATACION */}
                            {litrosDia < resultados.hidratacionNecesaria ? (
                                <p>
                                    La <b>hidratación</b> es fundamental para el funcionamiento óptimo de nuestro cuerpo. Hoy te hidratas con {litrosDia} litros y tu hidratación ideal es con {resultados.hidratacionNecesaria} litros diarios, por lo que debes tomar {(resultados.hidratacionNecesaria - litrosDia).toFixed(1)} litros al día para llegar al número ideal.
                                </p>
                            ) : (
                                <p>
                                    La <b>Hidratación</b> es fundamental para el funcionamiento óptimo de nuestro cuerpo. No es necesario un ajuste en la cantidad y sigue con este hábito. ¡FELICITACIONES!
                                </p>
                            )}

                        </div>
                    </div>
                )}
                <button onClick={generatePDF} className='btn enviar-btn'>Generar PDF</button>
            </div>
        </div >
    );
};

export default Form;
