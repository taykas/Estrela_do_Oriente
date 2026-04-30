import { useEffect, useRef } from "react";

import { Header } from "../components/header"
import { CardDestaque } from "../components/card-destaque";

import lanternas from "../assets/img lanternas.png";
import estrela from "../assets/icon estrela.png";
import linha_estrela from "../assets/linha estrela.png";

import destaque1 from "../assets/teste destaque 1.png";
import destaque2 from "../assets/teste destaque 2.png";
import destaque3 from "../assets/teste destaque 3.png";

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
            <div className="min-h-[50vh] w-full bg-black flex flex-col relative">
                
                <Header/>

                <img src={estrela} className="w-[35vw] self-center mt-3" />

                <div 
                    style={{ fontFamily: "Corvel" }} 
                    className="flex flex-col items-center justify-center text-[#f1b519] z-20 mt-3"
                >
                    <h1 className="text-5xl text-center leading-tight">
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
                className="flex flex-col min-h-[80vh] bg-black text-[#f1b519] pt-32">

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
            </div>
        </>
    )
}