import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import React, { ReactPropTypes } from "react";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function CatalogoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div >
      <Header />
      <div className="flex h-full">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
