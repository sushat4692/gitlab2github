import { useApi } from "../github";
import { gql } from "graphql-request";
import CsvReadableStream from "csv-reader";
import { createReadStream } from "fs";
import { execSync } from "child_process";
import chalk from "chalk";
import { useLogger } from "../logger";

const createQuery = gql`
    mutation CreateRepository($input: CreateRepositoryInput!) {
        createRepository(input: $input) {
            repository {
                id
            }
        }
    }
`;

export const command = async () => {
    const { client } = useApi();
    const logger = useLogger();
    const dir = process.cwd();

    const commandRun = (command: string) => {
        logger.info(chalk.red(`$ ${command}`));
        execSync(command);
    };

    const inputStream = createReadStream(
        process.cwd() + "/project-list.csv",
        "utf-8"
    );

    const relations = process.env.GROUP_RELATION?.split(" ").map((data) => {
        const [group, slug, org_id] = data.split(":");
        return { group, slug, org_id };
    });
    if (!relations) {
        return;
    }

    for await (const row of inputStream.pipe(
        new CsvReadableStream({ trim: true, skipEmptyLines: true })
    )) {
        const [name, url, group] = row;

        if (url === "Repo Url") {
            continue;
        }

        const relation = (() => {
            const relation = relations.find(
                (relation) => relation.group === group
            );

            if (relation) {
                return relation;
            }

            return relations.find((relation) => relation.group === "*");
        })();
        if (!relation) {
            continue;
        }

        logger.info(name);
        logger.info(`Target : ${relation.slug}`);

        const createData = await client
            .request(createQuery, {
                input: {
                    name,
                    ownerId: relation.org_id,
                    visibility: "PRIVATE",
                },
            })
            .catch((e) => {
                logger.error(e);
            });
        if (!createData) {
            continue;
        }

        logger.info(
            `Created repository : ${createData.createRepository.repository.id}`
        );

        commandRun(`cd ${dir}`);
        commandRun(`rm -fr ${dir}/.repo`);
        commandRun(`git clone --bare ${url} .repo`);
        commandRun(
            `cd ${dir}/.repo && git push --mirror ssh://git@github.com/${relation.slug}/${name}.git`
        );
    }
};
