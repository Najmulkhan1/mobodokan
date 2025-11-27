"use client";

import React from "react";
import NavLink from "./NavLink";
import MobileNavLink from "./MobileNavLink";
import { usePathname } from "next/navigation";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth()

  const navLink = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/products", label: "Products" },
    { href: "/contact", label: "Contact" },
  ];

  const handleLogout = () => {
    logout()
      .then(() => {
        console.log("User logged out successfully");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {navLink.map((link) => (
              <MobileNavLink
                key={link.href}
                href={link.href}
                active={pathname === link.href}
              >
                {link.label}
              </MobileNavLink>
            ))}
          </ul>
        </div>
        <Link href={'/'} className="btn btn-ghost text-xl">Mobodokan</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navLink.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              active={pathname === link.href}
            >
              {link.label}
            </NavLink>
          ))}
        </ul>
      </div>
      <div className="navbar-end">

        {user ? <>
          <button className="btn text-white">{user?.displayName}</button>
          <button onClick={handleLogout} className="btn btn-error">Logout</button>
        </> : <Link href={'/login'} className="btn">Login</Link>}
      </div>
    </div>
  );
}
