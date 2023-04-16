import Head from "next/head";

interface ICategory {
  category: string;
}
import { DADOS } from "../../faker/catalogo-fake";

export default function Content({ category }: ICategory) {
  const content = DADOS;
  return (
    <div data-id="content">
      <Head>
        <title>Produtos xananas&apos; garden</title>
      </Head>
      <div className="m-8">
        <h1 className="font-bold text-xl">Rosas do deserto</h1>
      </div>
      {content.map((data) => (
        <div className="flex flex-col gap-6 mx-8">
          <div className="border border-zinc-200 rounded overflow-hidden shadow-sm">
            <div className="flex max-h-56">
              <img
                width={200}
                src={data.imagens.url}
                alt={data.imagens.alt}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
