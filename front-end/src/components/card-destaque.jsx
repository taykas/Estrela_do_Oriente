export const CardDestaque = ({ imagem, categoria, descricao, preco }) => {
    return (
        <div className="flex flex-col w-[30vh] h-[35vh] rounded-xl overflow-hidden text-white items-center border border-[#f1b519] snap-center
            lg:h-[50vh] lg:w-[25vw]">
            
            {/* IMAGEM */}
            <div className="h-[23vh] w-full overflow-hidden
                lg:h-[30vh]">
                <img 
                    src={imagem} 
                    alt="" 
                    className="w-full h-full object-cover"
                />
            </div>

            {/* TEXTO */}
            <div className="flex flex-col items-center mt-2">
                <h1>{categoria}</h1>
                <h1>{descricao}</h1>
                <h1 className="text-[#f1b519]">R$ {preco}</h1>
            </div>

        </div>
    )   
}