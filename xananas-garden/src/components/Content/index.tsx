"use client"
import Head from "next/head";

interface ICategory {
  category: string;
}
import { DADOS } from "../../faker/catalogo-fake";
import { WhatsappLogo } from "phosphor-react";

export default function Content({ category }: ICategory) {
  const content = DADOS;
  return (
    <section data-id="content overflow-auto">
      <Head>
        <title>Produtos xananas&apos; garden</title>
      </Head>

      <div className="m-8">
        <h1 className="font-bold text-xl">{category}</h1>
      </div>

      <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4 m-4 overflow-y">
        {content.map((data) => (
          <div
            title="Atualmente, o nosso sistema suporta apenas solicitações via Whatsapp."
            className="flex flex-col"
          >
            <a
              href="#"
              className="group border border-zinc-200 rounded hover:shadow-lg"
            >
              <div className="flex md:flex-row xs:flex-col md:items-start xs:items-center">
                <img
                  className="group-hover:shadow-xl md:w-40 md:aspect-[3/4] xs:w-52"
                  src={data.image.url}
                  alt={data.image.alt}
                />
                <div className="m-4">
                  <h1 className="font-bold text-xl">{data.nome}</h1>
                  <h2 className="font-thin">{data.descricao}</h2>
                  <div className="p-2 flex justify-between">
                    <div className="flex flex-col">
                      <h2 className="font-semibold text-lg">{data.preço}</h2>
                      <h2 className="text-sm text-green-500">
                        {data.parcelas}
                      </h2>
                    </div>
                    <a
                      href="#"
                      title="Solicitar via whatsapp"
                      className="invisible group-hover:visible rounded-full hover:bg-green-400/50 h-8 w-8 flex items-center justify-center"
                    >
                      <div className="text-green-600">
                        <WhatsappLogo size={30} />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
