import { gql, useQuery } from '@apollo/client';
import { USER_FRAGMENT } from './userFragment';

const ENTITIES_QUERY = gql`
  query entities($type: String!) {
    entities(type: $type) {
      total
      list {
        ... on Account {
          id
          name
        }
        ...UserFields
      }
    }
  }

  ${USER_FRAGMENT}
`;

const useEntitiesQuery = ({ type }) => {
  return useQuery(ENTITIES_QUERY, { variables: { type }, ssr: false });
};

export { useEntitiesQuery };
