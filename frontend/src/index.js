import './styles/stylekanban.css'
import routes from './routes.js'
import bootstrap from './bootstrap.js'
import { controlNavigation } from './utils/helpers.js'
import { runMiddleware } from './middleware/runMiddleware.js'

export const router = async () => {
  const app = document.getElementById('app')
  const path = location.pathname || '/'
  const route = routes[path]

  if (!route) {
    app.innerHTML = '<h1>404 Page Not Found</h1>'
    return
  }

  runMiddleware(route, async () => {
    try {
      const res = await fetch(route.path)
      const html = await res.text()
      app.innerHTML = html
      bootstrap(path)
    } catch (error) {
      console.log(error)
      app.innerHTML = '<h1>404 Page Not Found</h1>'
    }
  })
}

controlNavigation()