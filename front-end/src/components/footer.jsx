import { Link, useNavigate } from "react-router-dom";

import estrela from "../assets/icon estrela.png";
import insta from "../assets/icon instagram.png";
import whats from "../assets/icon whatsapp.png";
import tiktok from "../assets/icon tik-tok.png";

export const Footer = () => {
    return(
        <>
            <div className="h-[20vh] w-full bg-white flex justify-around items-center text-sm">
                <section className="flex flex-col">
                    <Link to='/'>Inicio</Link>
                    <Link to='/products'>Produtos</Link>
                    <Link to='/about'>Sobre</Link>
                    <Link to='/about'>Contato</Link>
                </section>

                <div className="w-px h-[80%] bg-black"></div>
                
                <section className="flex">

                    <img src={estrela} alt="" className="w-[20%]"/>
                    
                    <section>
                        <section className="flex">

                            <section>
                                <h1>Estrela do Oriente</h1>
                                <p>Loja de Artigos religiosos</p>
                            </section>
                        </section>
                        
                        <section className="flex">
                            <img src={insta} alt="" className="w-[15%]"/>
                            <img src={whats} alt="" className="w-[15%]"/>
                            <img src={tiktok} alt="" className="w-[15%]"/>
                        </section>
                    </section>

                </section>

                <div className="w-px h-[80%] bg-black"></div>

                <section>
                    <h1>Atendimento</h1>
                    <h1>whatsapp: (41) 98723-8385</h1>
                    <h1>de terça á sexta das 10h às 18h30</h1>
                    <h1>Sábado das 10h às 15h</h1>
                </section>
            </div>
        </>
    )
}