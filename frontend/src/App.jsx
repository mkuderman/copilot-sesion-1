import { useEffect, useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'
const TOKEN_STORAGE_KEY = 'accessToken'

const CERT_LEVELS = {
  Principiante: 'Principiante',
  Intermedio: 'Intermedio',
  Experto: 'Experto',
}

const MICROSOFT_CERTIFICATIONS = [
  {
    code: 'AZ-900',
    name: 'Microsoft Azure Fundamentals',
    description:
      'Comprende los conceptos de la nube, los servicios de Azure, las cargas de trabajo, la seguridad, la privacidad, los precios y el soporte.',
    level: CERT_LEVELS.Principiante,
    role: 'Fundamentos',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/azure-fundamentals/',
  },
  {
    code: 'AZ-104',
    name: 'Microsoft Azure Administrator Associate',
    description:
      'Configura, administra, asegura y protege las funciones clave de Microsoft Azure, incluyendo identidad, gobernanza, almacenamiento y redes virtuales.',
    level: CERT_LEVELS.Intermedio,
    role: 'Administrador',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/azure-administrator/',
  },
  {
    code: 'AZ-204',
    name: 'Microsoft Azure Developer Associate',
    description:
      'Diseña, construye, prueba y mantiene aplicaciones y servicios en la nube utilizando Microsoft Azure. Incluye Azure Functions, API Management y contenedores.',
    level: CERT_LEVELS.Intermedio,
    role: 'Desarrollador',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/azure-developer/',
  },
  {
    code: 'AI-102',
    name: 'Microsoft Azure AI Engineer Associate',
    description:
      'Diseña e implementa soluciones de inteligencia artificial en Azure usando Azure AI Services, Azure AI Search y Azure OpenAI.',
    level: CERT_LEVELS.Intermedio,
    role: 'Ingeniero de IA',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/azure-ai-engineer/',
  },
  {
    code: 'AI-900',
    name: 'Microsoft Azure AI Fundamentals',
    description:
      'Demuestra conceptos fundamentales de IA relacionados con el desarrollo de software y servicios de Microsoft Azure para crear soluciones de IA.',
    level: CERT_LEVELS.Principiante,
    role: 'Fundamentos de IA',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/azure-ai-fundamentals/',
  },
  {
    code: 'AZ-305',
    name: 'Microsoft Azure Solutions Architect Expert',
    description:
      'Diseña soluciones en la nube e híbridas que se ejecutan en Azure, incluyendo cómputo, redes, almacenamiento, monitoreo y seguridad.',
    level: CERT_LEVELS.Experto,
    role: 'Arquitecto de Soluciones',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/azure-solutions-architect/',
  },
  {
    code: 'SC-900',
    name: 'Microsoft Security, Compliance, and Identity Fundamentals',
    description:
      'Comprende los conceptos de seguridad, cumplimiento e identidad y los servicios de Microsoft relacionados con Microsoft Entra ID y Microsoft 365.',
    level: CERT_LEVELS.Principiante,
    role: 'Seguridad',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/security-compliance-and-identity-fundamentals/',
  },
  {
    code: 'SC-500',
    name: 'Cloud and AI Security Engineer Associate',
    description:
      'Nueva certificación 2026 que reemplaza a AZ-500. Implementa y administra la seguridad en entornos de nube e IA con Microsoft Defender y Microsoft Entra.',
    level: CERT_LEVELS.Intermedio,
    role: 'Ingeniero de Seguridad',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/cloud-ai-security-engineer-associate/',
  },
]

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
        <section className="card welcome-card">
          <h1>Bienvenido</h1>
          <p>Iniciaste sesión correctamente.</p>
          <button type="button" className="primary-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </section>

        <section className="certifications-section">
          <h2 className="certifications-title">Certificaciones Microsoft 2025–2026</h2>
          <p className="certifications-subtitle">
            Valida tus habilidades con las certificaciones más relevantes del ecosistema Microsoft.
          </p>
          <div className="certifications-grid">
            {MICROSOFT_CERTIFICATIONS.map((cert) => (
              <a
                key={cert.code}
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cert-card"
              >
                <span className={`cert-badge cert-badge--${CERT_LEVELS[cert.level] ?? cert.level}`}>{cert.level}</span>
                <h3 className="cert-card-title">{cert.name}</h3>
                <p className="cert-card-desc">{cert.description}</p>
                <div className="cert-card-meta">
                  <span className="cert-role">{cert.role}</span>
                  <span className="cert-code">{cert.code}</span>
                </div>
              </a>
            ))}
          </div>
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
