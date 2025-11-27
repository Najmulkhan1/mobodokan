import Link from 'next/link'
import React from 'react'

export default function NavLink({href, active, children}) {
  return (
    <div>
        <Link
        href={href}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative group ${active
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
    >
        {children}
        <span
            className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform transition-transform duration-300 origin-left ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
        ></span>
    </Link>
    </div>
  )
}
