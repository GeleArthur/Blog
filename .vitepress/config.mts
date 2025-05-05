import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "en-US",
  title: "GeleArthur",
  description: "GeleArthur's website about game development",
  cleanUrls: true,
  srcDir: "./src",
  outDir: "./build",
  appearance: true,
  lastUpdated: true,

  markdown: {
    math: true,
  },

  themeConfig: {
    // aside: false,
    outline:{
      level:"deep"
    },


    nav: [
      {
        text: "Projects",
        items: [
          { text: "Floppy bird", link: "/projects/floppy-bird.md" },
          { text: "Cpu rasterizer", link: "/projects/cpu-rasterizer.md" },
          { text: "Spelunky remake", link: "/projects/spelunky-remake.md" },
          { text: "Website 2020", link: "/wordpress/index.html", target: '_self', },
        ],
      },
      { text: "Blog", link: "blog" },
      { text: "About", link: "about"}
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/GeleArthur/" },
      { icon: "mastodon", link: "https://mastodon.gamedev.place/@GeleArthur" },
      { icon: "youtube", link: "https://www.youtube.com/@gelearthur" },
      { icon: {svg:"<span class=\"vpi-social-mastodon\" style=\"--icon: url(\'/itchio.svg\');\"/>"}, link: "https://gelearthur.itch.io/" },
    ],
    
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    }

  },
});
