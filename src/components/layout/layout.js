import * as React from 'react';
import { Link } from 'gatsby';

import { container, header, navContainer, navItem } from "./layout.module.css"

const Layout = ({ pageTitle, children }) => {
  return (
    <main className={container}>
      <title>{pageTitle}</title>
      <nav>
        <ul className={navContainer}>
          <li className={navItem}><Link to="/">Home</Link></li>
          <li className={navItem}><Link to="/about">About</Link></li>
        </ul>
      </nav>
      <h1 className={header}>{pageTitle}</h1>
      {children}
    </main>
  )
}

export default Layout