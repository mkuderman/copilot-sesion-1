import { useEffect, useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'
const TOKEN_STORAGE_KEY = 'accessToken'

function navigateTo(path, setPathname) {
  window.history.pushState({}, '', path)
  setPathname(path)
}

function App() {
  const [pathname, setPathname] = useState(window.location.pathname)
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [token, setToken] = useState(sessionStorage.getItem(TOKEN_STORAGE_KEY))

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (!token && pathname === '/welcome') {
      navigateTo('/', setPathname)
    }
  }, [pathname, token])

  const handleLogin = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_BASE_URL}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail ?? 'No se pudo iniciar sesión.')
      }

      sessionStorage.setItem(TOKEN_STORAGE_KEY, data.access_token)
      setToken(data.access_token)
      navigateTo('/welcome', setPathname)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY)
    setToken(null)
    navigateTo('/', setPathname)
  }

  if (pathname === '/welcome' && token) {
    return (
      <main className="page">
        <section className="card">
          <h1>Bienvenido</h1>
          <p>Iniciaste sesión correctamente.</p>
          <button type="button" className="primary-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="page">
      <section className="card">
        <h1>Iniciar sesión</h1>
        <p>Ingresa tus credenciales para acceder a la bienvenida.</p>
        <form className="form" onSubmit={handleLogin}>
          <label htmlFor="username">Usuario</label>
          <input
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
          {errorMessage && <p className="error">{errorMessage}</p>}
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default App
