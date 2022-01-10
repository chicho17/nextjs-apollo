import Head from 'next/head';
import Image from 'next/image';
import styles from '../../../styles/Home.module.css';
import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';
import Link from 'next/link';

const PAGE_VIEW_QUERY = gql`
  query helloWorldPageViews($startTime: Float!, $endTime: Float!) {
    helloWorldPageViews(startTime: $startTime, endTime: $endTime) {
      count
    }
  }
`;

const Stats = () => {
  const { startTime, endTime } = useMemo(() => {
    const currentDate = new Date();
    const startTime = +new Date(
      `${currentDate.getMonth() + 1}-${currentDate.getDate() - 1}-${currentDate.getFullYear()}`
    );
    const endTime = +currentDate;

    return { startTime, endTime };
  }, []);

  const { data } = useQuery(PAGE_VIEW_QUERY, {
    variables: {
      startTime,
      endTime,
    },
  });

  const count = data?.helloWorldPageViews?.count;

  return (
    <div className={styles.container}>
      <Head>
        <title>Page Views</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Total Page Views Since Yesterday</h1>
        <pre>{count != null ? count : 'Loading...'}</pre>
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

export default Stats;
