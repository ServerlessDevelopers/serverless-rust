// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const {themes} = require('prism-react-renderer');
const lightTheme = themes.github;
const darkTheme = themes.dracula;

const { remarkCodeHike } = require('@code-hike/mdx')

var path = require('path');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Serverless Rust',
  tagline: 'Your One Stop Shop For All Things Serverless Rust',
  url: 'https://serverlessrust.dev',
  baseUrl: '/serverless-rust.github.io/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'jeastham1993', // Usually your GitHub org/user name.
  projectName: 'serverless-rust.github.io', // Usually your repo name.
  trailingSlash: false,

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  themes: ['mdx-v2'],

  plugins: [
    () => ({
      name: 'resolve-react',
      configureWebpack() {
        return {
          resolve: {
            alias: {
              // assuming root node_modules is up from "./packages/<your-docusaurus>
              react: path.resolve('node_modules/react'), 
            },
          },
        };
      },
    }),
  ],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          beforeDefaultRemarkPlugins: [[remarkCodeHike, { darkTheme }]],
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: [
            require.resolve("@code-hike/mdx/styles.css"),
            require.resolve("./src/css/custom.css"),
          ],
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          filename: 'sitemap.xml',
        },
        gtag: {
          trackingID: 'G-ELBLZN8LN3',
          anonymizeIP: true,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [{
        name: 'keywords', content: 'rust, serverless, aws, aws lambda, rustlang'
      }],
      navbar: {
        title: 'Serverless Rust',
        items: [
          {
            type: 'doc',
            docId: 'why-rust',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/jeastham1993/serverless-rust.github.io',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Docs',
                to: '/docs/why-rust',
              },
            ],
          },
          {
            title: 'Built by @plantpowerjames and @benjamenpyle',
            items: [
              {
                label: '@plantpowerjames',
                to: 'https://twitter.com/plantpowerjames',
              },
              {
                label: '@benjamenpyle',
                to: 'https://twitter.com/benjamenpyle',
              },
              {
                label: 'Report Issues on GitHub',
                to: 'https://github.com/jeastham1993/serverless-rust.github.io',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Serverless Rust. Built with Docusaurus.`,
      },
      prism: {
        theme: lightTheme,
        darkTheme: darkTheme,
      },
    }),
}


module.exports = config
