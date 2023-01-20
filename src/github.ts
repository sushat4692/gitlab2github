import { GraphQLClient } from "graphql-request";

export const useApi = () => {
    const endpoint = `${process.env.GITHUB_HOST}/graphql`;
    const client = new GraphQLClient(endpoint, {
        headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
    });

    return {
        client,
    };
};
