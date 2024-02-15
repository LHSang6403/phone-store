"use client";

import PrimaryLogo from "@components/PrimaryLogo";
import Dropdown from "@components/Layout/Header/Dropdown";
import NavBar from "@components/Layout/Header/NavBar";
import ThemeButton from "@components/Theme/ThemeButton";
import SearchBar from "@components/Search/SearchBar";
import { usePathname } from "next/navigation";

export default function Header() {
  const path = usePathname();

  return (
    <div className="w-full h-16 px-10 sm:px-4 flex flex-row gap-3 justify-around xl:justify-between">
      <div className="flex items-center mr-auto">
        <PrimaryLogo />
      </div>
      <nav className="w-full flex flex-row gap-6 justify-center items-center xl:hidden">
        <div className={`w-52 ${path === "/product" ? "hidden" : ""}`}></div>
        <NavBar />
        <div className={`w-52 ${path === "/product" ? "hidden" : ""}`}>
          <SearchBar />
        </div>
      </nav>
      <div className="flex items-center gap-2">
        <ThemeButton />
        <Dropdown />
      </div>
    </div>
  );
}
