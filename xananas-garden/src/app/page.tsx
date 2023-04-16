import Catalogo from "./catalogo/page";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/catalogo");
}
