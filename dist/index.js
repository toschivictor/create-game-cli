#!/usr/bin/env node
#!/usr/bin/env node

// src/index.ts
import { intro, outro, text, select, confirm, spinner, isCancel, cancel } from "@clack/prompts";
import { fileURLToPath as fileURLToPath2 } from "url";
import path2 from "path";

// src/create-project.ts
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
async function createProject(options) {
  const { projectName, template, targetDir, initGit, installDeps } = options;
  const projectPath = path.resolve(targetDir);
  if (await fs.pathExists(projectPath)) {
    const isEmpty = (await fs.readdir(projectPath)).length === 0;
    if (!isEmpty) {
      throw new Error(`Directory ${targetDir} already exists and is not empty`);
    }
  }
  await fs.ensureDir(projectPath);
  const templatesDir = path.resolve(__dirname, "..", "templates");
  const templateDir = path.join(templatesDir, template);
  if (!await fs.pathExists(templateDir)) {
    throw new Error(`Template '${template}' not found`);
  }
  await fs.copy(templateDir, projectPath);
  const packageJsonPath = path.join(projectPath, "package.json");
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath);
    packageJson.name = projectName;
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  }
  const readmePath = path.join(projectPath, "README.md");
  if (await fs.pathExists(readmePath)) {
    let readmeContent = await fs.readFile(readmePath, "utf-8");
    readmeContent = readmeContent.replace(/{{PROJECT_NAME}}/g, projectName);
    readmeContent = readmeContent.replace(/{{TEMPLATE}}/g, template);
    await fs.writeFile(readmePath, readmeContent);
  }
  const indexHtmlPath = path.join(projectPath, "index.html");
  if (await fs.pathExists(indexHtmlPath)) {
    let htmlContent = await fs.readFile(indexHtmlPath, "utf-8");
    htmlContent = htmlContent.replace(/{{PROJECT_NAME}}/g, projectName);
    await fs.writeFile(indexHtmlPath, htmlContent);
  }
  if (initGit) {
    try {
      execSync("git init", { cwd: projectPath, stdio: "ignore" });
      execSync("git add .", { cwd: projectPath, stdio: "ignore" });
      execSync('git commit -m "Initial commit"', { cwd: projectPath, stdio: "ignore" });
    } catch (error) {
      console.warn("Warning: Failed to initialize git repository");
    }
  }
  if (installDeps) {
    try {
      execSync("npm install", { cwd: projectPath, stdio: "ignore" });
    } catch (error) {
      throw new Error("Failed to install dependencies. You can install them manually with: npm install");
    }
  }
  return projectPath;
}

// src/index.ts
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path2.dirname(__filename2);
async function main() {
  console.clear();
  intro("\u{1F3AE} Create Game CLI");
  const projectName = await text({
    message: "What is your project name?",
    placeholder: "my-awesome-game",
    validate(value) {
      if (!value) return "Project name is required!";
      if (!/^[a-z0-9-_]+$/i.test(value)) {
        return "Project name can only contain letters, numbers, hyphens, and underscores";
      }
    }
  });
  if (isCancel(projectName)) {
    cancel("Operation cancelled");
    return process.exit(0);
  }
  const template = await select({
    message: "Choose a project template:",
    options: [
      {
        value: "basic",
        label: "Basic Game",
        hint: "Simple Pixi.js setup with basic game loop"
      },
      {
        value: "platformer",
        label: "Platformer",
        hint: "Basic platformer with physics and player controller"
      },
      {
        value: "top-down",
        label: "Top-down",
        hint: "Top-down game with movement and basic interactions"
      }
    ]
  });
  if (isCancel(template)) {
    cancel("Operation cancelled");
    return process.exit(0);
  }
  const targetDir = await text({
    message: "Where should we create your project?",
    placeholder: `./${projectName}`,
    initialValue: `./${projectName}`,
    validate(value) {
      if (!value) return "Target directory is required!";
    }
  });
  if (isCancel(targetDir)) {
    cancel("Operation cancelled");
    return process.exit(0);
  }
  const initGit = await confirm({
    message: "Initialize git repository?",
    initialValue: true
  });
  if (isCancel(initGit)) {
    cancel("Operation cancelled");
    return process.exit(0);
  }
  const installDeps = await confirm({
    message: "Install dependencies?",
    initialValue: true
  });
  if (isCancel(installDeps)) {
    cancel("Operation cancelled");
    return process.exit(0);
  }
  const s = spinner();
  s.start("Creating your game project...");
  try {
    const projectPath = await createProject({
      projectName,
      template,
      targetDir,
      initGit,
      installDeps
    });
    s.stop("Project created successfully!");
    outro(`
\u{1F389} Your game project is ready!

Next steps:
  cd ${path2.relative(process.cwd(), projectPath)}
  ${installDeps ? "" : "npm install"}
  npm run dev

Happy coding! \u{1F680}
    `);
  } catch (error) {
    s.stop("Failed to create project");
    console.error("Error:", error instanceof Error ? error.message : "Unknown error");
    process.exit(1);
  }
}
main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
