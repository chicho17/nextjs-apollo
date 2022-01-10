import Head from 'next/head';
import Image from 'next/image';
import styles from '../../../styles/Home.module.css';
import Link from 'next/link';
import { gql, useMutation } from '@apollo/client';
import { useEffect } from 'react';

const PAGE_VIEW_MUTATION = gql`
  mutation viewHelloWorldPage {
    viewHelloWorldPage {
      count
    }
  }
`;

const HelloWorld = () => {
  const [pageView] = useMutation(PAGE_VIEW_MUTATION);

  useEffect(() => {
    pageView();
  }, [pageView]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Hello World</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Hello World!</h1>
        <Link href="/blog">
          <a>
            <h2 className={styles.back}>&larr; Blog</h2>
          </a>
        </Link>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default HelloWorld;
