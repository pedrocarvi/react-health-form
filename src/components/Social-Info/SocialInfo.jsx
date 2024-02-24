import React from 'react'
import logoComunidad from '../../assets/logo-comunidad.png'
import instagramIcon from '../../assets/instagram-icon.png'
import webIcon from '../../assets/web-icon.png'
import youtubeIcon from '../../assets/youtube-icon.png'
import './socialinfo.css'

const SocialInfo = () => {
    const redes = [
        {
            nombre: "Sitio web",
            imagen: webIcon,
            link: "www.google.com"
        },
        {
            nombre: "Instagram",
            imagen: instagramIcon,
            link: "www.google.com"
        },
        {
            nombre: "Youtube",
            imagen: youtubeIcon,
            link: "www.google.com"
        }
    ]
    return (
        <div className='social-info-container'>
            {/* Logo */}
            <img src={logoComunidad} alt="Logo de la comunidad" className='logo-comunidad' />
            <h2> Comunidad Si Se Puede </h2>
            <div>
                <p> Descubri nuestro escaner virtual donde podas medir tu salud en menos de 1 minuto!</p>
            </div>
            {/* Social */}
            <div className="social-container d-flex">
                {
                    redes.map((el) => (
                        <div className="d-flex flex-column justify-content-center align-items-center px-4">
                            <a href={el.link}>
                                <img src={el.imagen} alt={el.nombre} width={30} />
                                <p> {el.nombre} </p>
                            </a>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default SocialInfo