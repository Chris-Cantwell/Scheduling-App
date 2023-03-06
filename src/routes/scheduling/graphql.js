import { gql } from '@urql/svelte';

export const TIME_SPENT = gql`
    mutation addElapsedTime($userId: ID!, $timeSpentSeconds: Float!) {
        addElapsedTime(userId: $userId, timeSpentSeconds: $timeSpentSeconds)
    }
`;

export const ADD_AVAIL = gql`
    mutation updateAvailability($userId: ID!, $input: AvailabilityInput, $zoomInput: AvailabilityInput) {
        updateAvailability(userId: $userId, input: $input, zoomInput: $zoomInput)
    }
`;