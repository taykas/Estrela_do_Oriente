import { useEffect, useRef } from "react";

import { Header } from "../components/header"
import { Footer } from "../components/footer"

import { CardDestaque } from "../components/card-destaque";

import lanternas from "../assets/img lanternas.png";
import estrela from "../assets/icon estrela.png";
import linha_estrela from "../assets/linha estrela.png";

import destaque1 from "../assets/teste destaque 1.png";
import destaque2 from "../assets/teste destaque 2.png";
import destaque3 from "../assets/teste destaque 3.png";

import sobre_imagem from "../assets/sobre imagem.png";

export const MainPage = () => {
    const middleRef = useRef(null);

    useEffect(() => {
    middleRef.current?.scrollIntoView({
        behavior: "auto",
        inline: "center"
    });
    }, []);

    return(
        <>
            {/* First Section */}
            <Header/>
            <div className="min-h-[45vh] w-full bg-black flex flex-col relative
                sm:flex-row sm:items-start sm:justify-center">
                

                <img src={estrela} className="w-[30vw] self-center mt-3 z-20
                    sm:w-[35%] sm:self-start" />

                <div 
                    style={{ fontFamily: "Corvel" }} 
                    className="flex flex-col items-center justify-center text-[#f1b519] z-20 mt-3
                    sm:w-[45%]"
                >
                    <h1 className="text-5xl text-center leading-tight
                        sm:text-4xl">
                        ESTRELA <br />
                        <span className="whitespace-nowrap">DO ORIENTE</span>
                    </h1>

                    <h1>LOJA DE ARTIGOS RELIGIOSOS</h1>

                    <img src={linha_estrela} alt="" className="w-[70vw]" />

                    <h1 className="text-center">
                        CONHEÇA NOSSOS <br/>
                        <span className="whitespace-nowrap">PRODUTOS</span>
                    </h1>
                </div>

                <img 
                    src={lanternas} 
                    className="w-full absolute -bottom-28 left-0 z-10"
                />

            </div>

            {/* Second Section */}
            <div 
                style={{ fontFamily: "Corvel" }}  
                className="flex flex-col min-h-[85vh] bg-black text-[#f1b519] pt-32">

                <section className="flex flex-col items-center">
                    <h1 className="text-2xl">ESTRELA DO ORIENTE</h1>
                    <h1>Produtos em Destaque</h1>
                </section>
        
                <section className="  flex gap-4 overflow-x-auto px-4 mt-5 snap-x snap-mandatory scroll-smooth">

                    <div className="min-w-50">
                        <CardDestaque imagem={destaque1} categoria="Imagem" descricao="Pretos Velhos" preco="89,50"/>
                    </div>

                    <div ref={middleRef} className="min-w-50 snap-center">
                    <CardDestaque imagem={destaque2} categoria="Incensos" descricao="Incensos Naturais" preco="12,50"/>
                    </div>

                    <div className="min-w-50">
                        <CardDestaque imagem={destaque3} categoria="Guia" descricao="Guia Miçanga Simples" preco="35,50"/>
                    </div>

                </section>

                <button className="self-center bg-[#f1b519] text-black rounded-2xl w-[70vw] h-[8vh] mt-5 text-center shadow-[0_0_60px_rgba(241,181,25,0.8)]">
                    Ver todos os produtos
                </button>

                <img src={linha_estrela} alt="" className="w-[80vw] mt-4 self-center" />
            </div>

            {/* Third Section */}
            <div style={{ fontFamily: "Corvel" }}  className="flex flex-col bg-black min-h-[55vh]">
                <section className="w-[90%] self-center">
                    <h1 className="text-[#f1b519] text-center text-2xl">Sobre Nós</h1>
                    <h1 className="text-white text-sm text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Consequuntur culpa in praesentium illum aliquid voluptatibus soluta unde rem
                        doloremque voluptate est delectus, eum dolorem reiciendis ea dolor a quod blanditiis.</h1>
                </section>

                <div className="relative w-[90vw] self-center">
                    
                    <img 
                        src={sobre_imagem} 
                        alt="" 
                        className="w-full"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-transparent to-black"></div>


                </div>

                <img src={linha_estrela} alt="" className="w-[80vw] mt-6 self-center" />

            </div>

            <Footer/>

        </>
    )
}