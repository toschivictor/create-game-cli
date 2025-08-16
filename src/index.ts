import { intro, outro, text, select, confirm, spinner, isCancel, cancel } from '@clack/prompts'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createProject } from './create-project.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
  console.clear()

  intro('Create Game CLI')

  // Get project name
  const projectName = await text({
    message: 'What is your project name?',
    placeholder: 'my-awesome-game',
    validate(value) {
      if (!value) {
        return 'Project name is required!'
      }

      if (!/^[a-z0-9-_]+$/i.test(value)) {
        return 'Project name can only contain letters, numbers, hyphens, and underscores.'
      }
    },
  })

  if (isCancel(projectName)) {
    cancel('Operation cancelled')
    return process.exit(0)
  }

  // Get project template
  const template = await select({
    message: 'Choose a project template:',
    options: [
      {
        value: 'basic',
        label: 'Basic Game',
        hint: 'Simple Pixi.js setup with basic game loop',
      },
      {
        value: 'platformer',
        label: 'Platformer',
        hint: 'Basic platformer with physics and player controller',
      },
      {
        value: 'top-down',
        label: 'Top-down',
        hint: 'Top-down game with movement and basic interactions',
      },
    ],
  })

  if (isCancel(template)) {
    cancel('Operation cancelled')
    return process.exit(0)
  }

  // Get target directory
  const targetDir = await text({
    message: 'Where should we create your project?',
    placeholder: `./${projectName}`,
    initialValue: `./${projectName}`,
    validate(value) {
      if (!value) {
        return 'Target directory is required!'
      }
    },
  })

  if (isCancel(targetDir)) {
    cancel('Operation cancelled')
    return process.exit(0)
  }

  // Ask about git initialization
  const initGit = await confirm({
    message: 'Initialize git repository?',
    initialValue: true,
  })

  if (isCancel(initGit)) {
    cancel('Operation cancelled')
    return process.exit(0)
  }

  // Ask about installing dependencies
  const installDeps = await confirm({
    message: 'Install dependencies?',
    initialValue: true,
  })

  if (isCancel(installDeps)) {
    cancel('Operation cancelled')
    return process.exit(0)
  }

  // Create the project
  const s = spinner()
  s.start('Creating your game project...')

  try {
    const projectPath = await createProject({
      projectName: projectName as string,
      template: template as string,
      targetDir: targetDir as string,
      initGit: initGit as boolean,
      installDeps: installDeps as boolean,
    })

    s.stop('Project created successfully!')

    outro(`
🎉 Your game project is ready!

Next steps:
  cd ${path.relative(process.cwd(), projectPath)}
  ${installDeps ? '' : 'npm install'}
  npm run dev

Happy coding! 🚀
    `)
  } catch (error) {
    s.stop('Failed to create project')
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error')
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})