import { Link, useNavigate } from "react-router-dom";

import estrela from "../assets/icon estrela.png";
import insta from "../assets/icon instagram.png";
import whats from "../assets/icon whatsapp.png";
import tiktok from "../assets/icon tik-tok.png";

export const Footer = () => {
    return(
        <>
            <div
                style={{ fontFamily: "Corvel" }} 
                className="w-full bg-black text-white flex flex-col justify-around items-center text-sm
                md:justify-between md:h-[20vh]">
                

                <section className="order-1 flex gap-6 p-5 bg-black
                    md:order-0 md:text-lg ">
                    <Link to='/' onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Inicio</Link>
                    <Link to='/products'>Produtos</Link>
                    <Link to='/about'>Sobre</Link>
                    <Link to='/about'>Contato</Link>
                </section>

                <div className="md:flex md:justify-center md:items-center md:mb-15 md:gap-5">

                    <section className="order-0 flex items-center justify-center gap-4 bg-black
                    md:order-1">

                        <img
                            src={estrela}
                            alt=""
                            className="w-20 h-20 object-contain
                                md:w-25 md:h-25"
                        />

                        <section className="flex flex-col items-center bg-black">
                            <section className="text-left text-[#f1b519] bg-black
                                md:text-lg">
                                <h1>Estrela do Oriente</h1>
                                <p>Loja de Artigos Religiosos</p>
                            </section>

                            <section className="flex justify-center items-center gap-13 mt-2 bg-black">
                                <img src={insta} alt="" className="w-8 h-8 md:w-10 md:h-10" onClick={() => window.open("https://www.instagram.com/estrela_do_oriente_ofc/", "_blank")}/>
                                <img src={whats} alt="" className="w-8 h-8 md:w-10 md:h-10" />
                                <img src={tiktok} alt="" className="w-8 h-8 md:w-10 md:h-10" onClick={() => window.open("https://www.tiktok.com/@manu_roncoski", "_blank")}/>
                            </section>
                        </section>

                    </section>

                    <section className="order-3 bg-black w-full flex flex-col items-center p-2
                    md:order-2 md:w-fit md:text-lg">
                        <h1 className="text-[#f1b519]">Atendimento</h1>
                        <h1>whatsapp: (41) 98723-8385</h1>
                        <h1>de terça á sexta das 10h às 18h30</h1>
                        <h1>Sábado das 10h às 15h</h1>
                    </section>
                </div>


            </div>
        </>
    )
}