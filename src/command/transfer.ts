import { useApi } from "../github";
import { gql } from "graphql-request";
import CsvReadableStream from "csv-reader";
import { createReadStream } from "fs";
import { execSync } from "child_process";
import chalk from "chalk";

const query = gql`
    mutation CreateRepository($input: CreateRepositoryInput!) {
        createRepository(input: $input) {
            clientMutationId
        }
    }
`;

const commandRun = (command: string) => {
    console.log(chalk.red(`$ ${command}`));
    execSync(command);
};

export const command = async () => {
    const { client } = useApi();
    const dir = process.cwd();

    const inputStream = createReadStream(
        process.cwd() + "/project-list.csv",
        "utf-8"
    );

    inputStream
        .pipe(new CsvReadableStream({ trim: true }))
        .on("data", async (row: string[]) => {
            const [name, clientMutationId, url] = row;

            if (url === "Repo Url") {
                return;
            }

            console.log("------------------------------");
            console.log(name);
            console.log("------------------------------");

            const data = await client.request(query, {
                input: {
                    clientMutationId,
                    name,
                    ownerId: process.env.GITHUB_ORG_ID,
                    visibility: "PRIVATE",
                },
            });
            console.log(
                `Created repository : ${data.createRepository.clientMutationId}`
            );

            commandRun(`cd ${dir}`);
            commandRun(`rm -fr ${dir}/.repo`);
            commandRun(`git clone --bare ${url} .repo`);
            commandRun(
                `cd ${dir}/.repo && git push --mirror ssh://git@github.com/${process.env.GITHUB_ORG}/${clientMutationId}.git`
            );
        });
};
