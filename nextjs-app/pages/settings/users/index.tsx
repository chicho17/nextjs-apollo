import Head from 'next/head';
import Image from 'next/image';
import styles from '../../../styles/Home.module.css';
import { useEntitiesQuery } from '../../../hooks/useEntitiesQuery';
import Link from 'next/link';

const Accounts = () => {
  const { data: accountsData } = useEntitiesQuery({ type: 'USER' });

  return (
    <div className={styles.container}>
      <Head>
        <title>Accounts</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Link href="/settings">
          <a>
            <h2 className={styles.back}>&larr; Back</h2>
          </a>
        </Link>
        {accountsData ? (
          accountsData.entities.list.map((user) => <h3 key={user.id}>{user.name}</h3>)
        ) : (
          <h2>Loading Users...</h2>
        )}
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

export default Accounts;
