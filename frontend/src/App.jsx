import { useEffect, useState } from 'react'
import './App.css'

const MS_CERTIFICATIONS = [
  {
    id: 'ai-901',
    level: 'Fundamentals',
    levelColor: '#107c41',
    title: 'Microsoft Azure AI Fundamentals',
    exam: 'AI-901',
    description:
      'Valida conocimientos fundacionales sobre soluciones de IA en Azure, incluyendo el uso de Microsoft Foundry y habilidades de codificación con Python.',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/azure-ai-fundamentals/',
    badge: '🤖',
  },
  {
    id: 'az-900',
    level: 'Fundamentals',
    levelColor: '#107c41',
    title: 'Microsoft Azure Fundamentals',
    exam: 'AZ-900',
    description:
      'Demuestra conocimientos básicos sobre servicios en la nube y cómo se proveen mediante Azure. Ideal para quienes inician en la nube.',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/azure-fundamentals/',
    badge: '☁️',
  },
  {
    id: 'ms-900',
    level: 'Fundamentals',
    levelColor: '#107c41',
    title: 'Microsoft 365 Fundamentals',
    exam: 'MS-900',
    description:
      'Acredita conocimientos sobre productividad en la nube, seguridad, cumplimiento y los servicios de Microsoft 365.',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/microsoft-365-fundamentals/',
    badge: '📧',
  },
  {
    id: 'az-104',
    level: 'Associate',
    levelColor: '#0078d4',
    title: 'Microsoft Azure Administrator',
    exam: 'AZ-104',
    description:
      'Certifica habilidades para implementar, administrar y monitorear la infraestructura de Azure en una organización.',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/azure-administrator/',
    badge: '⚙️',
  },
  {
    id: 'ai-102',
    level: 'Associate',
    levelColor: '#0078d4',
    title: 'Azure AI Engineer Associate',
    exam: 'AI-102',
    description:
      'Valida competencias para diseñar e implementar soluciones de IA con Azure OpenAI, Azure AI Services y Azure AI Search.',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/azure-ai-engineer/',
    badge: '🧠',
  },
  {
    id: 'm365-coll',
    level: 'Associate',
    levelColor: '#0078d4',
    title: 'M365 Collaboration Communications Systems Engineer',
    exam: 'MS-721',
    description:
      'Nueva certificación 2026 para ingenieros que planifican e implementan soluciones de colaboración y comunicaciones en Microsoft Teams.',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/m365-collaboration-communications-systems-engineer/',
    badge: '💬',
  },
]

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'
const TOKEN_STORAGE_KEY = 'accessToken'

function navigateTo(path, setPathname) {
  window.history.pushState({}, '', path)
  setPathname(path)
}

function App() {
  const [pathname, setPathname] = useState(window.location.pathname)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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
      <main className="page welcome-page">
        <div className="welcome-container">
          <section className="card welcome-header">
            <h1>Bienvenido</h1>
            <p>Iniciaste sesión correctamente.</p>
            <button type="button" className="primary-button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </section>

          <section className="certifications-section">
            <h2 className="certifications-title">Certificaciones Microsoft 2026</h2>
            <p className="certifications-subtitle">
              Explora las certificaciones más relevantes de Microsoft para impulsar tu carrera
              profesional.
            </p>
            <div className="certifications-grid">
              {MS_CERTIFICATIONS.map((cert) => (
                <a
                  key={cert.id}
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cert-card"
                >
                  <div className="cert-card-header">
                    <span className="cert-badge">{cert.badge}</span>
                    <span
                      className="cert-level"
                      style={{ backgroundColor: cert.levelColor }}
                    >
                      {cert.level}
                    </span>
                  </div>
                  <h3 className="cert-title">{cert.title}</h3>
                  <p className="cert-exam">Examen: {cert.exam}</p>
                  <p className="cert-description">{cert.description}</p>
                  <span className="cert-link">Ver certificación →</span>
                </a>
              ))}
            </div>
          </section>
        </div>
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
