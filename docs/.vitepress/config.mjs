import {defineConfig} from "vitepress"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "en-US",
  title: "Seduce の Blog",
  description: "record some learning and practice",
  // base: "/blog/",
  vite: {
    server: {
      port: 80,
    },
  },
  head: [
    ["link", {rel: "icon", href: "/images/favicon.ico"}],
  ],
  themeConfig: {
    // siteTitle: "Seduce の Blog",
    // logo: "/logo.jpg",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {text: "Home", link: "/"},
      {text: "Examples", link: "/markdown-examples"},
      {
        text: "AWS",
        items: [
          {text: "DynamoDB", link: "/aws/dynamodb"},
          {text: "Lambda", link: "/aws/lambda"},
          {text: "Other", link: "/aws/other"},
        ],
        activeMatch: "/aws",
      },
      {text: "other", link: "/other"},
    ],
    
    sidebar: {
      "/": {
        text: "examples",
        items: [
          {text: "Markdown Examples", link: "/markdown-examples"},
          {text: "Runtime API Examples", link: "/api-examples"},
        ],
      },
      "/aws/": {
        text: "AWS",
        items: [
          {text: "DynamoDB", link: "/aws/dynamodb"},
          {text: "Lambda", link: "/aws/lambda"},
          {text: "Other", link: "/aws/other"},
        ],
      },
    },
    
    search: {
      provider: "local",
      options: {
        _render(src, env, md) {
          const html = md.render(src, env)
          if (env.frontmatter?.title)
            return md.render(`# ${env.frontmatter.title}`) + html
          return html
        },
      },
    },
    
    socialLinks: [
      {icon: "github", link: "https://github.com/SeduceQAQ/blog"},
      {
        icon: {
          svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\" width=\"100\" height=\"100\" viewBox=\"0 0 50 50\">\n" +
            "<path d=\"M25,2c12.703,0,23,10.297,23,23S37.703,48,25,48S2,37.703,2,25S12.297,2,25,2z M32.934,34.375\tc0.423-1.298,2.405-14.234,2.65-16.783c0.074-0.772-0.17-1.285-0.648-1.514c-0.578-0.278-1.434-0.139-2.427,0.219\tc-1.362,0.491-18.774,7.884-19.78,8.312c-0.954,0.405-1.856,0.847-1.856,1.487c0,0.45,0.267,0.703,1.003,0.966\tc0.766,0.273,2.695,0.858,3.834,1.172c1.097,0.303,2.346,0.04,3.046-0.395c0.742-0.461,9.305-6.191,9.92-6.693\tc0.614-0.502,1.104,0.141,0.602,0.644c-0.502,0.502-6.38,6.207-7.155,6.997c-0.941,0.959-0.273,1.953,0.358,2.351\tc0.721,0.454,5.906,3.932,6.687,4.49c0.781,0.558,1.573,0.811,2.298,0.811C32.191,36.439,32.573,35.484,32.934,34.375z\"></path>\n" +
            "</svg>",
        },
        link: "https://t.me/SeduceQAQ",
      },
    ],
    
    lastUpdated: {
      text: "update at",
      formatOptions: {
        dateStyle: "full",
        timeStyle:
          "medium",
      },
    },
    
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright©2024 Seduce",
    },
    
    editLink: {
      pattern: "https://github.com/SeduceQAQ/blog/blob/main/docs/:path",
    },
  },
})
