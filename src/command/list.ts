import { useApi } from "../gitlab";
import { createObjectCsvWriter } from "csv-writer";
import { gql } from "graphql-request";

const query = gql`
    query getList($after: String) {
        projects(membership: true, searchNamespaces: false, after: $after) {
            count
            pageInfo {
                endCursor
                hasNextPage
            }
            nodes {
                name
                webUrl
                sshUrlToRepo
                namespace {
                    name
                    path
                }
            }
        }
    }
`;

const checkNameSpace = (namespace: string) => {
    if (!process.env.GITLAB_TARGET_NAMESPACE) {
        return true;
    }

    const targets = process.env.GITLAB_TARGET_NAMESPACE.split(",");
    return targets.some((target) => target === namespace);
};

export const command = async () => {
    const { client } = useApi();

    const csvWriter = createObjectCsvWriter({
        path: process.cwd() + "/project-list.csv",
        header: [
            { id: "name", title: "Name" },
            { id: "sshUrlToRepo", title: "Repo Url" },
            { id: "group", title: "Group Key" },
        ],
    });

    const records: { name: string; sshUrlToRepo: string }[] = [];

    let count = 0;
    let end: string | null = null;
    while (true) {
        console.log(`Start : ${end}`);
        const data = await client.request(query, { after: end });

        data.projects.nodes.map((node) => {
            if (process.env.GITLAB_TARGET_NAMESPACE) {
                const targets = process.env.GITLAB_TARGET_NAMESPACE.split(",");
                if (!targets.some((target) => node.webUrl.includes(target))) {
                    return;
                }
            }

            const name = (() => {
                const base = node.webUrl.split("/").pop();

                if (!checkNameSpace(node.namespace.path)) {
                    return `${node.namespace.path}__${base}`;
                }
                return base;
            })();

            const group = (() => {
                return node.namespace.path;
            })();

            records.push({
                ...{ sshUrlToRepo: node.sshUrlToRepo },
                ...{ name, group },
            });
        });

        console.log(`Loaded ${count}`);
        if (!data.projects.pageInfo.hasNextPage || count > 100) {
            break;
        }
        end = data.projects.pageInfo.endCursor;
        count += 1;
    }

    await csvWriter.writeRecords(records);
};
