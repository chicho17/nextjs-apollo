import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/Home.module.css';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import Link from 'next/link';
import { useState } from 'react';

const TODOS_QUERY = gql`
  query todos {
    todos {
      total
      list {
        id
        name
        status
      }
    }
  }
`;

const TODO_CREATION_MUTATION = gql`
  mutation createTodo($name: String!) {
    createTodo(name: $name) {
      id
      name
      status
    }
  }
`;

const TODO_UPDATE_STATUS_MUTATION = gql`
  mutation updateTodoStatus($id: String!, $status: String!) {
    updateTodoStatus(id: $id, status: $status) {
      id
      name
      status
    }
  }
`;

const Todos = () => {
  const { data: todoListData } = useQuery(TODOS_QUERY, {
    ssr: false,
  });
  const [completionKey, setCompletetionKey] = useState(0);
  const [createTodo, { loading: isCreating }] = useMutation(TODO_CREATION_MUTATION, {
    // refetchQueries: [TODOS_QUERY],
    // awaitRefetchQueries: true,
    onCompleted() {
      setCompletetionKey((p) => p + 1);
    },
  });
  const [updateTodoStatus] = useMutation(TODO_UPDATE_STATUS_MUTATION);

  return (
    <div className={styles.container}>
      <Head>
        <title>Todos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {todoListData ? (
          <ul>
            {todoListData.todos.list.map((todo) => (
              <li
                style={{
                  width: '160px',
                  textDecoration: todo.status === 'DONE' ? 'line-through' : undefined,
                }}
                onClick={() => {
                  updateTodoStatus({
                    variables: {
                      id: todo.id,
                      status: todo.status === 'DONE' ? 'INCOMPLETE' : 'DONE',
                    },
                  });
                }}
                key={todo.id}
              >
                <h2>{todo.name}</h2>
              </li>
            ))}
          </ul>
        ) : (
          <h2>Loading Todos...</h2>
        )}
        <h3 style={{ margin: 0, marginTop: '20px' }}>Create Todo</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // @ts-ignore
            var formData = new FormData(e.target);
            createTodo({ variables: { name: formData.get('todoInput') } });
          }}
        >
          <input name="todoInput" disabled={isCreating} key={completionKey} />
        </form>
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

export default Todos;
