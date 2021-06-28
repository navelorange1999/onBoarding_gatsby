import * as React from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';

import { container, header, navContainer } from "./layout.module.sass";
import Seo from "../../configs/seo";

const Layout = ({ pageTitle, children }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
  return (
    <main className={container}>
      <Seo title={pageTitle}/>
      <title>{pageTitle}</title>
      <p>{data.site.siteMetadata.title}</p>
      <nav>
        <ul className={navContainer}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/blog">Blog</Link></li>
        </ul>
      </nav>
      <h1 className={header}>{pageTitle}</h1>
      {children}
    </main>
  )
}

export default Layout