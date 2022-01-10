import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/Home.module.css';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import Link from 'next/link';

const DASHBOARD_LIST_QUERY = gql`
  query dashboards {
    dashboards {
      total
      list {
        id
        name
        widgets {
          id
          name
        }
      }
    }
  }
`;

const DashboardList = () => {
  const { data: dbListData, loading: dbListLoading } = useQuery(DASHBOARD_LIST_QUERY, {
    ssr: false,
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Last DB</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div style={{ flex: '0 0 auto', display: 'flex' }}>
          <Link href={`/settings/accounts`}>
            <a className={styles.card}>
              <div style={{ width: '160px' }}>
                <h2>Accounts</h2>
              </div>
            </a>
          </Link>
          <Link href={`/settings/users`}>
            <a className={styles.card}>
              <div style={{ width: '160px' }}>
                <h2>Users</h2>
              </div>
            </a>
          </Link>
        </div>
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

export default DashboardList;
