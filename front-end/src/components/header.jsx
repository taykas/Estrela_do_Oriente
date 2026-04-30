import { Link, useNavigate } from "react-router-dom";
import estrela from "../assets/icon estrela.png";
import carrinho from "../assets/icon carrinho.png";

export const Header = () => {
    return(
        <div>
            <div className='flex items-center justify-between h-[10vh] bg-black'>
                <img src={estrela} alt="logo" className="w-[5vw] m-5"/>

                <section className="flex gap-5 text-2xl">
                    <h1 className="text-white">INICIO</h1>
                    <h1 className="text-white">PRODUTOS</h1>
                    <h1 className="text-white">SOBRE</h1>
                </section>

                <img src={carrinho} alt="" className="w-[3vw] m-5"/>
            </div>

            <div>
                <div className="border-t-4 border-[#f6d771]"></div>
            </div>
        </div>
    )
}