import { GraphQLClient } from "graphql-request";

export const useApi = () => {
    const endpoint = `${process.env.GITLAB_HOST}/api/graphql`;
    const client = new GraphQLClient(endpoint, {
        headers: {
            Authorization: `Bearer ${process.env.GITLAB_TOKEN}`,
        },
    });

    return {
        client,
    };
};
