import * as net from 'net'

/**
 * Возвращает true, если порт доступен и не занят, иначе false
 * @param port
 */
export function testIfPortIsAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer()

    server.once('error', (err: Error) => {
      resolve(false)
    })

    server.once('listening', () => {
      server.close()
      resolve(true)
    })

    server.listen(port)
  })
}

/**
 * Возвращает случайный свободный порт
 *
 * Перебирает случайные порты от 1024 до 65535 и возвращает первый свободный
 */
export function getRandomAvailablePort() {
  return new Promise<number>((resolve, reject) => {
    const port = Math.floor(Math.random() * 64511) + 1024

    testIfPortIsAvailable(port)
      .then(available => {
        if (available) {
          resolve(port)
        } else {
          resolve(getRandomAvailablePort())
        }
      })
      .catch(reject)
  })
}
