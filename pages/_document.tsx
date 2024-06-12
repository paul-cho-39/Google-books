import Document, { Html, Head, Main, NextScript } from 'next/document';

// creating a portal to place SideBar component @headless/ui force insert 'inert' at the parent
class MyDocument extends Document {
   render() {
      return (
         <Html>
            <Head>
               {(process.env.NODE_ENV === 'development' ||
                  process.env.VERCEL_ENV === 'preview') && (
                  // eslint-disable-next-line @next/next/no-sync-scripts
                  <script
                     data-project-id='NKxqjBjZeWA3MscoBUeq8cY5THhPTzn1la6Tl8sM'
                     data-is-production-environment='false'
                     src='https://snippet.meticulous.ai/v1/meticulous.js'
                  />
               )}

               <link rel='shortcut icon' href='/favicon.ico' />
            </Head>
            <body>
               <Main />
               <NextScript />
               <div id='sidebar-root'></div>
            </body>
         </Html>
      );
   }
}

export default MyDocument;
