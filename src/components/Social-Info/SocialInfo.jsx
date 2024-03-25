import React from 'react'
import logoComunidad from '../../assets/logo-comunidad.png'
// import instagramIcon from '../../assets/instagram-icon.png'
import webIcon from '../../assets/web-icon.png'
// import youtubeIcon from '../../assets/youtube-icon.png'
import './socialinfo.css'

const SocialInfo = () => {
    // const redes = [
    //     {
    //         nombre: "Sitio web",
    //         imagen: webIcon,
    //         link: "https://www.comunidadsisepuede.online/"
    //     }
    // ]
    return (
        <div>
            {/* <nav className="navbar bg-body-emphasis py-3 border">
                <div className="container-fluid">
                    <div className='d-flex gap-2 align-items-center'>
                        <img src={logoComunidad} alt="Logo de la comunidad" className='logo-comunidad' />
                        <h5> Comunidad Si Se Puede </h5>
                    </div>
                    <div className="social-container d-flex">
                        {
                            redes.map((el, index) => (
                                <div key={index} className="d-flex justify-content-center align-items-center px-4">
                                    <a href={el.link} target='_blank'>
                                        <img src={el.imagen} alt={el.nombre} width={30} />
                                        <p> {el.nombre} </p>
                                    </a>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </nav> */}
            <div className='d-flex align-items-center justify-content-center w-100 pt-3' style={{ backgroundColor: '#7c5780' }}>
                <img src={logoComunidad} alt="Logo de la comunidad" className='logo-comunidad' />
            </div>
        </div>
    )
}

export default SocialInfo