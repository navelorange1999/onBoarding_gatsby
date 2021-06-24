import * as React from "react";
import { Link, graphql, useStaticQuery } from 'gatsby';

import Layout from "../components/layout/layout";

const BlogPage = () => {
    const posts = useStaticQuery(graphql`
        query {
            allFile {
                nodes {
                    name
                }
            }
        }
    `).allFile.nodes;

    return (
        <Layout pageTitle="Blog Page">
           <p>This is My Blogs!</p>
           <ul>
            {posts.map(node => 
                <li key={node.name}>
                    <Link>{node.name}</Link>
                </li>
            )}
           </ul>
        </Layout>
    )
}

export default BlogPage;