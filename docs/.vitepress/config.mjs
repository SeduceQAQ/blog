import {defineConfig} from "vitepress"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "en-US",
  title: "Seduce の Blog",
  description: "record some learning and practice",
  base: "/blog/",
  vite: {
    server: {
      port: 80
    }
  },
  themeConfig: {
    // siteTitle: "Seduce の Blog",
    logo: "/logo.jpg",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {text: "Home", link: "/"},
      {text: "Examples", link: "/markdown-examples"}
    ],
    
    sidebar: [
      {
        text: "Examples",
        items: [
          {text: "Markdown Examples", link: "/markdown-examples"},
          {text: "Runtime API Examples", link: "/api-examples"}
        ]
      }
    ],
    
    socialLinks: [
      {icon: "github", link: "https://github.com/vuejs/vitepress"}
    ],
    
    lastUpdated: {
      text: "update at",
      formatOptions: {
        dateStyle: "full",
        timeStyle: "medium"
      }
    }
  },
})
