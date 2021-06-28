module.exports = {
  siteMetadata: {
    title: "My OnBoarding_Gatsby Site !",
    referrer: "no-referrer"
  },
  plugins: [
    "gatsby-plugin-gatsby-cloud", 
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    `gatsby-plugin-react-helmet`,
    "gatsby-transformer-remark",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "blog",
        path: `${__dirname}/blog`,
      },
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        cssLoaderOptions: {
          camelCase: false,
        },
      },
    },
  ],
};
