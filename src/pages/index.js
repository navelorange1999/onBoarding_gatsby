import * as React from "react";
import { StaticImage } from "gatsby-plugin-image";

import Layout from "../components/layout/layout";

const IndexPage = () => {
  return (
    <Layout pageTitle="Home Page">
      <p>This is Home</p>
      <StaticImage alt="gatsby" src="../images/icon.png"/>
    </Layout>
  )
}

export default IndexPage;