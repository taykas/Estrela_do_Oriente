import { Link, useNavigate } from "react-router-dom";

export const Footer = () => {
    return(
        <>
            <div className="h-[20vh] w-full bg-white">
                <section className="flex flex-col">
                    <Link to='/'>Inicio</Link>
                    <Link to='/products'>Produtos</Link>
                    <Link to='/about'>Sobre</Link>
                </section>
            </div>
        </>
    )
}