import figlet from "figlet";
import { Command } from "commander";

// Dotenv
import * as dotenv from "dotenv";
dotenv.config();

console.log(figlet.textSync("GitLab2GitHub"));

const program = new Command();
program
    .version(process.env.npm_package_version || "0.0.1")
    .description("Bulk transfer GitLab repository to GitHub");

// List
import { command as listCommand } from "./command/list";
program
    .command("list")
    .description("Get repository list of GitLab")
    .action(listCommand);

// Get Organazation detail
import { command as organizationCommand } from "./command/organization";
program
    .command("organization")
    .argument("<login>", "Organization login key")
    .description("Get detail organization information of GitHub")
    .action(organizationCommand);

// Create Repository
import { command as transferCommand } from "./command/transfer";
program
    .command("transfer")
    .description("Start transfer GitLab repository to GitHub")
    .action(transferCommand);

program.parse(process.argv);
