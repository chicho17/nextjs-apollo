const fields = [...Array(100)].map((a, i) => `userField${i + 1}`);

const USER_FRAGMENT = `
    fragment UserFields on User {
        id
        name
        ${fields.join('\n')}
    }
`;

export { USER_FRAGMENT };
