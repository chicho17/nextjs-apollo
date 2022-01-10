const { ApolloServer, gql } = require('apollo-server');
const fs = require('fs');

const userFields = [...Array(100)].map((a, i) => `userField${i + 1}: String!`).join('\n');

const typeDefs = gql`
  type Node {
    id: String!
    templateId: String!
    title: String!
    href: String!
  }

  type Layout {
    nodes: [Node]
    id: String!
  }

  type NodeDetail {
    description: String!
    id: String!
    title: String!
  }

  type Widget {
    id: String!
    name: String!
  }

  type Dashboard {
    id: String!
    name: String!
    widgets: [Widget!]!
    favourite: Boolean!
  }

  type LastAccessedUnit {
    id: String!
    type: String!
    timestamp: Float!
  }

  type DashboardList {
    total: Int!
    list: [Dashboard!]!
  }

  type Account {
    id: String!
    name: String!
  }

  type User {
    id: String!
    name: String!
    ${userFields}
  }

  union Entity = Account | User | Dashboard
  
  type Todo {
    id: String!
    name: String!
    status: String!
  }
  
  type TodoList {
    total: Int!
    list: [Todo!]!
  }

  type EntityList {
    total: Int!
    list: [Entity!]!
  }
  
  type PageViews {
    count: Int!
  }

  type Query {
    layout: Layout
    nodeDetail(id: String!): NodeDetail
    dashboardByID(id: String!): Dashboard
    lastAccessedUnit(type: String!): LastAccessedUnit
    dashboards: DashboardList
    entities(type: String!): EntityList
    helloWorldPageViews(startTime: Float!, endTime: Float!): PageViews
    todos: TodoList
  }

  type Mutation {
    setLastAccessedUnit(id: String!, type: String!): LastAccessedUnit
    viewHelloWorldPage: PageViews
    createTodo(name: String!): Todo
    updateTodoStatus(id: String!, status: String!): Todo
  }
`;

const clubsNode = { id: 'clubs', templateId: 'card-list/clubs', title: '🎨 Clubs', href: 'clubs' };
const coursesNode = {
  id: 'courses',
  templateId: 'table/courses',
  title: '📚 Courses',
  href: 'courses',
};

const clubsNodeDetail = {
  id: clubsNode.id,
  title: clubsNode.title,
  description: 'Where all the creativity flows!',
};
const coursesNodeDetail = {
  id: coursesNode.id,
  title: coursesNode.title,
  description: 'Find out in-depth information about programs that you will love',
};

const layout = {
  id: 'horizontal1',
  nodes: [clubsNode, coursesNode],
};

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const lastAccessedUnitMap = new Map();
let pageViews = 0;
const todos = new Map();

async function fetchDashboards() {
  const dbFiles = fs.readdirSync('./dashboards');
  return {
    total: dbFiles.length,
    list: dbFiles.map((fileName) => require(`./dashboards/${fileName}`)),
  };
}

function fetchAccounts(count) {
  return {
    total: count,
    list: [...Array(count)].map((a, i) => ({ id: `account-${i + 1}`, name: `Account ${i + 1}` })),
  };
}

function fetchUsers(count) {
  return {
    total: count,
    list: [...Array(count)].map((a, i) => {
      const userId = `user-${i + 1}`;
      const otherFields = [...Array(100)].reduce((acc, item, index) => {
        acc[`userField${index + 1}`] = `${userId}-value-${index + 1}`;
        return acc;
      }, {});

      return { ...otherFields, id: userId, name: `User ${i + 1}` };
    }),
  };
}

const resolvers = {
  Entity: {
    __resolveType(obj, context, info) {
      if (obj.id.startsWith('user')) {
        return 'User';
      }

      if (obj.id.startsWith('account')) {
        return 'Account';
      }

      if (obj.id.startsWith('db')) {
        return 'Dashboard';
      }
      return null; // GraphQLError is thrown
    },
  },
  Query: {
    layout: async () => {
      await wait(4000);
      return layout;
    },
    nodeDetail: async (_, variables) => {
      await wait(4000 + Math.random() * 4000);
      if (variables.id === 'clubs') {
        return clubsNodeDetail;
      }
      return coursesNodeDetail;
    },
    dashboardByID: async (_, variables) => {
      await wait(2000);
      const db = require(`./dashboards/${variables.id}.js`);
      return db;
    },
    lastAccessedUnit: async (_, variables) => {
      await wait(3000);
      return lastAccessedUnitMap.get(variables.type);
    },
    dashboards: async (_, variables) => {
      await wait(1000);
      return fetchDashboards();
    },
    entities: async (_, variables) => {
      await wait(400);
      if (variables.type === 'ACCOUNT') {
        return fetchAccounts(10);
      }
      if (variables.type === 'USER') {
        return fetchUsers(5);
      }
      if (variables.type === 'DASHBOARD') {
        return fetchDashboards();
      }
    },
    helloWorldPageViews: async (_, variables) => {
      await wait(1000);
      return { count: pageViews };
    },
    todos: async (_, variables) => {
      await wait(2000);
      return {
        total: todos.size,
        list: [...todos.values()],
      };
    },
  },
  Mutation: {
    setLastAccessedUnit: async (_, variables) => {
      await wait(2000);
      const key = variables.type;
      const value = { id: variables.id, type: variables.type, timestamp: Date.now() };
      lastAccessedUnitMap.set(key, value);
      return value;
    },
    viewHelloWorldPage: async (_, variables) => {
      await wait(500);
      pageViews += 1;
      return { count: pageViews };
    },
    createTodo: async (_, variables) => {
      await wait(500);
      const todo = { id: `${todos.size}`, status: 'INCOMPLETE', name: variables.name };
      todos.set(todo.id, todo);
      return todo;
    },
    updateTodoStatus: async (_, variables) => {
      await wait(500);
      const todo = { ...todos.get(variables.id), status: variables.status };
      todos.set(variables.id, todo);
      return todo;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
