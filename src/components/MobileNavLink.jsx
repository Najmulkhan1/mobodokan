import Link from "next/link";
import React from "react";

export default function MobileNavLink({ href, active, children }) {
  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
        active
          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
          : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
      }`}
    >
      {children}
    </Link>
  );
}
