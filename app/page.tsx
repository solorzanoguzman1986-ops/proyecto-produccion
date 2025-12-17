import Link from 'next/link'
import { ArrowRight, Check, Zap, Shield, Users } from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: Zap,
      title: 'Rápido y Eficiente',
      description: 'Plataforma optimizada para máximo rendimiento',
    },
    {
      icon: Shield,
      title: 'Seguro',
      description: 'Protección de datos de nivel empresarial',
    },
    {
      icon: Users,
      title: 'Escalable',
      description: 'Crece con tu negocio sin límites',
    },
  ]

  const plans = [
    {
      name: 'Gratis',
      price: '$0',
      period: 'por siempre',
      features: [
        'Acceso básico',
        'Hasta 10 proyectos',
        'Soporte por email',
        '1GB de almacenamiento',
      ],
      cta: 'Empezar gratis',
      popular: false,
    },
    {
      name: 'Básico',
      price: '$9',
      period: 'por mes',
      features: [
        'Todo lo del plan Gratis',
        'Proyectos ilimitados',
        'Soporte prioritario',
        '10GB de almacenamiento',
        'Análisis avanzados',
      ],
      cta: 'Comenzar ahora',
      popular: true,
    },
    {
      name: 'Premium',
      price: '$29',
      period: 'por mes',
      features: [
        'Todo lo del plan Básico',
        'Almacenamiento ilimitado',
        'Soporte 24/7',
        'API avanzada',
        'Integraciones premium',
        'Análisis personalizados',
      ],
      cta: 'Comenzar ahora',
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">MonetApp</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900">
                Características
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
                Precios
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Iniciar Sesión
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link
                href="/register"
                className="px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Monetiza tu Negocio
            <br />
            <span className="text-primary-600">de Forma Inteligente</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Plataforma completa para gestionar suscripciones, pagos y clientes.
            Todo lo que necesitas para hacer crecer tu negocio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              Comenzar Gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#pricing"
              className="px-8 py-4 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Ver Planes
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Todo lo que Necesitas
          </h2>
          <p className="text-xl text-gray-600">
            Características diseñadas para hacer crecer tu negocio
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gray-50">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Planes que se Adaptan a Ti
          </h2>
          <p className="text-xl text-gray-600">
            Elige el plan perfecto para tu negocio
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`p-8 bg-white rounded-xl shadow-sm border-2 ${
                plan.popular
                  ? 'border-primary-600 relative'
                  : 'border-gray-200'
              } hover:shadow-lg transition-shadow`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Más Popular
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-gray-600 ml-2">{plan.period}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-xl font-bold mb-4">MonetApp</h3>
              <p className="text-sm">
                Plataforma de monetización para hacer crecer tu negocio.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="hover:text-white">
                    Características
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white">
                    Precios
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white">
                    Documentación
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white">
                    Términos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 MonetApp. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

