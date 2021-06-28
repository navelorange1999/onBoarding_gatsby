import * as React from "react";
import { Link, graphql, useStaticQuery } from 'gatsby';

import Layout from "../components/layout";

const BlogPage = () => {
    const posts = useStaticQuery(graphql`
        query {
            allMarkdownRemark {
                edges {
                  node {
                    fields {
                      slug
                    }
                  }
                }
            }
        }
    `).allMarkdownRemark.edges;
    return (
        <Layout pageTitle="Blog Page">
           <p>This is My Blogs!</p>
           <ul>
            {posts.map(item => 
                <li key={item.node.fields.slug}>
                    <Link to={item.node.fields.slug}>{item.node.fields.slug}</Link>
                </li>
            )}
           </ul>
        </Layout>
    )
}

export default BlogPage;