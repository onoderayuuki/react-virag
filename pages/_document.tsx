import NextDocument, { Html, Head, Main, NextScript } from 'next/document';

export default class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head>
          {/* <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" /> */}
          {/* <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" /> */}
          <link rel="icon" type="image/png" sizes="16x16" href="/icon.png" />
          {/* <link rel="manifest" href="/favicons/site.webmanifest" /> */}
          {/* <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#000000" /> */}
          <link rel="shortcut icon" href="/favicon3.ico" /> 
          
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}