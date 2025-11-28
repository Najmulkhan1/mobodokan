"use client";

import React from "react";
import NavLink from "./NavLink";
import MobileNavLink from "./MobileNavLink";
import { usePathname } from "next/navigation";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { Tooltip } from "react-tooltip";

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
          <div className="dropdown dropdown-end z-50">
            {/* The main button that triggers the dropdown */}
            <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
            >
                <div
                    id="user-avatar-clickable"
                    className="w-10 border-2 border-amber-600 rounded-full cursor-pointer" // Increased size and used amber-600 for border
                >
                    <img
                        alt={`${user?.displayName}'s profile`}
                        referrerPolicy="no-referrer"
                        src={
                            user?.photoURL ||
                            "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                        }
                        className="rounded-full"
                    />
                </div>

                {/* Desktop Tooltip (The tooltip functionality is kept, though it might overlap with the dropdown on mobile) */}
                <Tooltip
                    anchorSelect="#user-avatar-clickable"
                    clickable
                    className="hidden md:block"
                    place="bottom" // Adjusted placement for better visual
                >
                    <h3 className="text-lg  font-bold ">{user?.displayName || 'User'}</h3>
                </Tooltip>
            </div>

            {/* Mobile/Default Dropdown Menu (Uses DaisyUI's menu for structure) */}
            <ul
                tabIndex={0} // Important for dropdown focus
                className="menu menu-md dropdown-content bg-base-100 rounded-box z-[1] w-56 p-4 shadow-xl mt-3 space-y-2 border border-gray-100" // Improved styling and spacing
            >
                {/* User Info Section (Now using <li> for menu items) */}
                <div className="pb-3 mb-2 border-b border-gray-200">
                    <li className="menu-title">
                        <span className="text-sm font-bold text-gray-700">{user?.displayName || 'User'}</span>
                    </li>
                    <li className="text-xs text-gray-500">
                        {user?.email || 'N/A'}
                    </li>
                </div>

                {/* Navigation Links */}
                <li>
                    <Link href={'/profile'} className="text-gray-700 hover:bg-amber-100 hover:text-amber-700">
                        My Profile
                    </Link>
                </li>
                
                {/* New: Add Product Link */}
                <li>
                    <Link href={'/add-product'} className="text-gray-700 hover:bg-amber-100 hover:text-amber-700">
                        Add Product
                    </Link>
                </li>
                
                {/* New: Manage Products Link */}
                <li>
                    <Link href={'/manage-products'} className="text-gray-700 hover:bg-amber-100 hover:text-amber-700">
                        Manage Products
                    </Link>
                </li>

                {/* Logout Button */}
                <li className="mt-2 pt-2 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="btn bg-amber-600 text-white hover:bg-amber-700 w-full text-base"
                    >
                        Log Out
                    </button>
                </li>
            </ul>
        </div>
        </> : <Link href={'/login'} className="btn">Login</Link>}
      </div>
    </div>
  );
}
