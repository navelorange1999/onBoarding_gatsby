import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

function SEO({title}) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            referrer
          }
        }
      }
    `
  )

  return (
    <Helmet title={title || site.siteMetadata.title}>
      <meta name="referrer" content={site.siteMetadata.referrer} />
    </Helmet>
  )
}

SEO.defaultProps = {
  referrer: "no-referrer",
  title: "",
}

SEO.propTypes = {
  title: PropTypes.string.isRequired,
  referrer: PropTypes.string,
}

export default SEO