import { gql } from '@urql/svelte';

// CONCEPT: Authentication
// ACTION: create(u: User) or logIn(u: User) if u exists in database
// Sets up Login mutation for use on frontend that creates or logs in a user 
// based on input username + password
export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            id
            username
            availability {
                id
                timezone
                monday
                tuesday
                wednesday
                thursday
                friday
                saturday
                sunday
            }
        }
    }
`;