import { Link, useNavigate } from "react-router-dom";
import estrela from "../assets/icon estrela.png";
import carrinho from "../assets/icon carrinho.png";

export const Header = () => {
    return(
        <div style={{ fontFamily: "Corvel" }} >
            <div className='flex items-center justify-between h-[10vh] w-full bg-black'>
                <img src={estrela} alt="logo" className="w-[15vw] m-2"/>

                <section className="flex gap-2 text-sm">
                    <h1 className="text-white">INICIO</h1>
                    <h1 className="text-white">PRODUTOS</h1>
                    <h1 className="text-white">SOBRE</h1>
                </section>

                <img src={carrinho} alt="" className="w-[10vw] m-2"/>
            </div>

            <div>
                <div className="border-t-2 border-[#f1b519]"></div>
            </div>
        </div>
    )
}