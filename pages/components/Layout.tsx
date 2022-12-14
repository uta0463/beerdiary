import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      <Head>
        <meta property="og:locale" content="ja_JP" />
        <link rel="shortcut icon" type="image/x-icon" href="/images/favicon.ico"></link>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-CD8T6Y0P1B"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
    
              gtag('config', 'G-CD8T6Y0P1B');
            `,
          }}
        />
      </Head>

      <Header></Header>

      <div className={`l__container`}>

        <main className={`l__main`}>{children}</main>

        <Footer></Footer>

      </div>
    </>
  );
};

export default Layout;