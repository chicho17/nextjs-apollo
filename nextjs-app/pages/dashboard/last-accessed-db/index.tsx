import Head from 'next/head';
import Image from 'next/image';
import styles from '../../../styles/Home.module.css';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import Link from 'next/link';

const DASHBOARD_BY_ID_QUERY = gql`
  query dashboardByID($id: String!) {
    dashboardByID(id: $id) {
      id
      name
      widgets {
        id
        name
      }
    }
  }
`;

const LAST_ACCESSED_UNIT_QUERY = gql`
  query lastAccessedUnit($type: String!) {
    lastAccessedUnit(type: $type) {
      id
      timestamp
    }
  }
`;

const LastAccessedDB = () => {
  const { data: lastAccessedUnitData, loading: dbIDLoading } = useQuery(LAST_ACCESSED_UNIT_QUERY, {
    variables: {
      type: 'DASHBOARD',
    },
    ssr: false,
  });

  const dbId = lastAccessedUnitData?.lastAccessedUnit?.id;

  const { data: dashboardData, loading: dbLoading } = useQuery(DASHBOARD_BY_ID_QUERY, {
    variables: {
      id: dbId,
    },
    ssr: false,
    skip: !dbId,
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Last DB</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{dbIDLoading || dbLoading ? 'loading...' : dashboardData?.dashboardByID?.name}</h1>
        <Link href="/dashboard/list">
          <a>
            <h2 className={styles.back}>&larr; Back</h2>
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

export default LastAccessedDB;
