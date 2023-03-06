import { gql } from '@urql/svelte';

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
            zoomAvailability {
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