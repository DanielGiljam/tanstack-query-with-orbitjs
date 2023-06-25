import {exec} from "child_process";

import * as devkit from "@nrwl/devkit";
import {defineConfig} from "tsup";

const {readJsonFile, writeJsonFile} = (
    devkit as unknown as {default: typeof devkit}
).default;

const execAsync = async (command: string): Promise<void> =>
    await new Promise((resolve, reject) => {
        const childProcess = exec(command, (error) => {
            if (error == null) {
                resolve();
            } else {
                reject(error);
            }
        });
        childProcess.stdout!.pipe(process.stdout);
        childProcess.stderr!.pipe(process.stderr);
    });

const projectName = "react";
const outDir = `../../dist/libs/${projectName}`;

export default defineConfig(async () => {
    const reactQueryPkg = await readJsonFile(
        "../../node_modules/@tanstack/react-query/package.json",
    );
    const external: Array<string | RegExp> = [
        "@tanstack-query-with-orbitjs/core",
        ...new Set([
            ...Object.keys(reactQueryPkg.dependencies ?? {}),
            ...Object.keys(reactQueryPkg.peerDependencies ?? {}),
        ]),
    ].map((external) => new RegExp(`^${external}($|\\/|\\\\)`));
    return {
        clean: true,
        dts: {
            compilerOptions: {
                rootDir: "../../",
            },
            respectExternal: true,
        },
        entry: ["src/index.ts"],
        external,
        format: "esm",
        onSuccess: async () => {
            console.log("onSuccess:");
            await execAsync(`cp README.md ../../LICENSE ${outDir}`);
            console.log(
                "  - Copied README.md and ../../LICENSE to out directory.",
            );
            const pkg = await readJsonFile("package.json");
            const rootPkg = await readJsonFile("../../package.json");
            pkg.homepage = rootPkg.homepage.replace(
                /#readme$/,
                `/tree/main/libs/${projectName}#readme`,
            );
            pkg.bugs = rootPkg.bugs.concat(`+label%3A${projectName}`);
            pkg.license = rootPkg.license;
            pkg.author = rootPkg.author;
            pkg.repository = {...rootPkg.repository};
            pkg.repository.directory = `libs/${projectName}`;
            pkg.dependencies = {
                ...pkg.dependencies,
                ...reactQueryPkg.dependencies,
            };
            pkg.peerDependencies = {
                ...pkg.peerDependencies,
                ...reactQueryPkg.peerDependencies,
            };
            pkg.peerDependenciesMeta = reactQueryPkg.peerDependenciesMeta;
            await writeJsonFile(`${outDir}/package.json`, pkg);
            console.log(
                "  - Merged package.json and ../../package.json and wrote to out directory.",
            );
            console.log("  - Done.");
        },
        outDir,
        outExtension: () => ({js: ".js"}),
    };
});
