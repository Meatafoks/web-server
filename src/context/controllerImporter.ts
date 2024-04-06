import * as glob from 'glob'
import * as ts from 'typescript'
import { resolve } from 'path'
import { LoggerFactory } from 'metafoks-application'
import * as process from 'process'

interface DocEntry {
  name?: string
  fileName?: string
  documentation?: string
  type?: string
  constructors?: DocEntry[]
  parameters?: DocEntry[]
  decorators?: DocEntry[]
  returnType?: string
}

export async function controllerImporter(path: string) {
  const logger = LoggerFactory.createWithName('ControllersScanner')
  logger.info(`scanning controllers path <${path}>`)

  const files = glob.sync(path) // это возвращает массив путей всех файлов .ts в директории и поддиректориях
  const filesWithController: Set<string> = new Set()

  files.map(fileName => {
    // Создаем программу для каждого файла
    const program = ts.createProgram([fileName], {
      target: ts.ScriptTarget.ES2016,
      module: ts.ModuleKind.CommonJS,
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
    })
    let checker = program.getTypeChecker()

    // Visit every sourceFile in the program
    for (const sourceFile of program.getSourceFiles()) {
      // Walk the tree to search for classes
      ts.forEachChild(sourceFile, visit)
    }

    /** visit nodes finding exported classes */
    function visit(node: ts.Node) {
      // Only consider exported nodes
      if (!isNodeExported(node)) {
        return
      }

      if (node.kind === ts.SyntaxKind.ClassDeclaration) {
        // @ts-ignore
        const decorators = ts.getDecorators(node) ?? []
        for (const dec of decorators) {
          const text = dec.getText()
          if (text) {
            if (/@RestController\(.+\)/.test(text)) {
              logger.info(`found controller: <${fileName}>`)
              filesWithController.add(fileName)
            }
          }
        }
        // This is a top level class, get its symbol
        // No need to walk any further, class expressions/inner declarations
        // cannot be exported
      } else if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
        // This is a namespace, visit its children
        ts.forEachChild(node, visit)
      }
    }

    function isNodeExported(node: ts.Node): boolean {
      return node.parent && node.parent.kind === ts.SyntaxKind.SourceFile
    }
  })

  for (const file of filesWithController) {
    const currentWorkingDir = process.cwd()
    const fullPath = resolve(currentWorkingDir, file)
    await import(fullPath)
  }

  logger.info('controllers scanner done')
}
