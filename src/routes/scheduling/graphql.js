import { gql } from '@urql/svelte';

export const TIME_SPENT = gql`
    mutation addElapsedTime($userId: ID!, $timeSpentSeconds: Float!) {
        addElapsedTime(userId: $userId, timeSpentSeconds: $timeSpentSeconds)
    }
`;