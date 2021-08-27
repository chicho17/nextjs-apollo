const { ApolloServer, gql } = require('apollo-server');

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

  type Query {
    layout: Layout
    nodeDetail(id: String!): NodeDetail
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

const resolvers = {
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
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
