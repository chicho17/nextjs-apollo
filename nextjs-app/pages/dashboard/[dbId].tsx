import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/Home.module.css';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
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

const LAST_ACCESSED_UNIT_MUTATION = gql`
  mutation setLastAccessedUnit($id: String!, $type: String!) {
    setLastAccessedUnit(id: $id, type: $type) {
      id
      timestamp
      type
    }
  }
`;

const DASHBOARD_FAVOURITE_QUERY = gql`
  query dashboardByID($id: String!) {
    dashboardByID(id: $id) {
      favourite
    }
  }
`;

const DASHBOARD_NAME_QUERY = gql`
  query dashboardByID($id: String!) {
    dashboardByID(id: $id) {
      name
    }
  }
`;

const DashboardFavouriteStatus = ({ dbId }) => {
  const { data } = useQuery(DASHBOARD_FAVOURITE_QUERY, { variables: { id: dbId }, ssr: false });
  const favLabel = data?.dashboardByID?.favourite ? 'Favourite ✅' : 'NOT Favourite ❌';
  return <h4>{data ? favLabel : 'loading...'}</h4>;
};

const DashboardLatestName = ({ dbId }) => {
  const { data } = useQuery(DASHBOARD_NAME_QUERY, { variables: { id: dbId }, ssr: false });
  const name = data?.dashboardByID?.name;
  return <h4>{name ?? 'loading...'}</h4>;
};

const Dashboard = () => {
  const { query } = useRouter();
  const { dbId } = query;

  const { data: dashboardData, loading: dbLoading } = useQuery(DASHBOARD_BY_ID_QUERY, {
    variables: {
      id: dbId,
    },
    ssr: false,
    skip: !dbId,
  });

  const [setLastAccessedDashboard] = useMutation(LAST_ACCESSED_UNIT_MUTATION);

  const [showFav, setShowFav] = useState(false);
  const [showLatestDBName, setShowLatestDBName] = useState(false);

  useEffect(() => {
    if (dbId) {
      setLastAccessedDashboard({
        variables: {
          id: dbId,
          type: 'DASHBOARD',
        },
      });
    }
  }, [dbId, setLastAccessedDashboard]);

  let name = dashboardData?.dashboardByID?.name;
  return (
    <div className={styles.container}>
      <Head>
        <title>{name ?? 'Dashboard'}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{name ?? 'dashboard loading...'}</h1>
        <Link href="/dashboard/list">
          <a>
            <h2 className={styles.back}>&larr; Back</h2>
          </a>
        </Link>
        <button onClick={() => setShowFav((p) => !p)}>
          {showFav ? 'Hide Favourite Status' : 'Show Favourite Status'}
        </button>
        {showFav ? <DashboardFavouriteStatus dbId={dbId} /> : null}
        <button onClick={() => setShowLatestDBName((p) => !p)}>
          {showLatestDBName ? 'Hide DB latest name' : 'Show DB latest name'}
        </button>
        {showLatestDBName ? <DashboardLatestName dbId={dbId} /> : null}
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

export default Dashboard;
