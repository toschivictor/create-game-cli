import fs from 'fs-extra'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface CreateProjectOptions {
  projectName: string
  template: string
  targetDir: string
  initGit: boolean
  installDeps: boolean
}

export async function createProject(options: CreateProjectOptions): Promise<string> {
  const { projectName, template, targetDir, initGit, installDeps } = options
  
  // Resolve the absolute path for the target directory
  const projectPath = path.resolve(targetDir)
  
  // Check if directory already exists
  if (await fs.pathExists(projectPath)) {
    const isEmpty = (await fs.readdir(projectPath)).length === 0
    if (!isEmpty) {
      throw new Error(`Directory ${targetDir} already exists and is not empty`)
    }
  }

  // Ensure the target directory exists
  await fs.ensureDir(projectPath)

  // Get template directory path
  const templatesDir = path.resolve(__dirname, '..', 'templates')
  const templateDir = path.join(templatesDir, template)

  // Check if template exists
  if (!(await fs.pathExists(templateDir))) {
    throw new Error(`Template '${template}' not found`)
  }

  // Copy template files
  await fs.copy(templateDir, projectPath)

  // Replace placeholders in package.json
  const packageJsonPath = path.join(projectPath, 'package.json')
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath)
    packageJson.name = projectName
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 })
  }

  // Replace placeholders in README.md
  const readmePath = path.join(projectPath, 'README.md')
  if (await fs.pathExists(readmePath)) {
    let readmeContent = await fs.readFile(readmePath, 'utf-8')
    readmeContent = readmeContent.replace(/{{PROJECT_NAME}}/g, projectName)
    readmeContent = readmeContent.replace(/{{TEMPLATE}}/g, template)
    await fs.writeFile(readmePath, readmeContent)
  }

  // Replace placeholders in index.html
  const indexHtmlPath = path.join(projectPath, 'index.html')
  if (await fs.pathExists(indexHtmlPath)) {
    let htmlContent = await fs.readFile(indexHtmlPath, 'utf-8')
    htmlContent = htmlContent.replace(/{{PROJECT_NAME}}/g, projectName)
    await fs.writeFile(indexHtmlPath, htmlContent)
  }

  // Initialize git repository if requested
  if (initGit) {
    try {
      execSync('git init', { cwd: projectPath, stdio: 'ignore' })
      execSync('git add .', { cwd: projectPath, stdio: 'ignore' })
      execSync('git commit -m "Initial commit"', { cwd: projectPath, stdio: 'ignore' })
    } catch (error) {
      // Git initialization failed, but we can continue
      console.warn('Warning: Failed to initialize git repository')
    }
  }

  // Install dependencies if requested
  if (installDeps) {
    try {
      execSync('npm install', { cwd: projectPath, stdio: 'ignore' })
    } catch (error) {
      throw new Error('Failed to install dependencies. You can install them manually with: npm install')
    }
  }

  return projectPath
}