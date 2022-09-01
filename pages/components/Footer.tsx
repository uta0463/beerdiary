import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

const Footer = ({ children }: Props) => {
  return (
    <footer className={`l__footer`}>
      <div className={`l__footer__wrap u__inner`}>
        <p className={`l__footer__copyright`}>Beer Diary</p>
      </div>
    </footer>
  );
};

export default Footer;