import Head from 'next/head';
import Link from 'next/link';
// import Image from 'next/image'
import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

const Header = ({ children }: Props) => {
  return (
    <header className={`l__header`}>
      <div className={`l__header__wrap u__inner`}>
        <h1 className={`l__header__logo`}>
          <Link href="/">
            <a>
              <img src="/images/logo.png" width={24} height={35} alt="Beer Diary" />
              <span>Beer Diary</span>
            </a>
          </Link>
        </h1>
      </div>
    </header>
  );
};

export default Header;