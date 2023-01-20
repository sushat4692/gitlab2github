import { useApi } from "../github";
import { gql } from "graphql-request";

const query = gql`
    query OrganizationDetail($login: String!) {
        organization(login: $login) {
            id
            name
        }
    }
`;

export const command = async () => {
    const { client } = useApi();

    const data = await client.request(query, {
        login: process.env.GITHUB_ORG,
    });

    console.log(data);
};
