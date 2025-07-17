import { Translations } from '../types'

const translations: Translations = {
  common: {
    nav: {
      home: 'Inicio',
      dashboard: 'Panel',
      manageEvents: 'Gestionar Eventos',
      manageTags: 'Gestionar Etiquetas',
      invoices: 'Facturas',
      studios: 'Studios',
      profile: 'Perfil',
      addCalendar: 'Agregar Calendario',
      signOut: 'Cerrar Sesión'
    },
    actions: {
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      create: 'Crear',
      update: 'Actualizar',
      confirm: 'Confirmar',
      close: 'Cerrar',
      next: 'Siguiente',
      previous: 'Anterior',
      loading: 'Cargando...',
      submit: 'Enviar',
      search: 'Buscar',
      filter: 'Filtrar',
      export: 'Exportar',
      import: 'Importar',
      share: 'Compartir',
      copy: 'Copiar',
      select: 'Seleccionar',
      selectAll: 'Seleccionar Todo',
      deselectAll: 'Deseleccionar Todo'
    },
    labels: {
      name: 'Nombre',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      title: 'Título',
      description: 'Descripción',
      date: 'Fecha',
      time: 'Hora',
      location: 'Ubicación',
      status: 'Estado',
      type: 'Tipo',
      tags: 'Etiquetas',
      notes: 'Notas',
      optional: 'Opcional',
      required: 'Obligatorio',
      created: 'Creado',
      updated: 'Actualizado',
      deleted: 'Eliminado'
    },
    messages: {
      success: 'Éxito',
      error: 'Error',
      warning: 'Advertencia',
      info: 'Información',
      confirmDelete: '¿Está seguro de que quiere eliminar este elemento?',
      saveChanges: '¿Guardar cambios?',
      unsavedChanges: 'Tiene cambios sin guardar',
      noData: 'No hay datos disponibles',
      noResults: 'No se encontraron resultados',
      loading: 'Cargando...',
      comingSoon: 'Próximamente'
    },
    form: {
      validation: {
        required: 'Este campo es obligatorio',
        email: 'Por favor ingrese una dirección de correo válida',
        minLength: 'Debe tener al menos {min} caracteres',
        maxLength: 'Debe tener máximo {max} caracteres',
        passwordMatch: 'Las contraseñas deben coincidir',
        invalidUrl: 'Por favor ingrese una URL válida',
        invalidDate: 'Por favor ingrese una fecha válida'
      },
      placeholders: {
        search: 'Buscar...',
        selectOption: 'Seleccionar opción',
        enterText: 'Ingresar texto',
        chooseFile: 'Elegir archivo',
        enterUrl: 'Ingresar URL',
        enterEmail: 'Ingresar correo',
        enterPassword: 'Ingresar contraseña'
      }
    },
    datetime: {
      today: 'Hoy',
      yesterday: 'Ayer',
      tomorrow: 'Mañana',
      thisWeek: 'Esta Semana',
      nextWeek: 'Próxima Semana',
      thisMonth: 'Este Mes',
      nextMonth: 'Próximo Mes',
      am: 'AM',
      pm: 'PM',
      days: {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo'
      },
      months: {
        january: 'Enero',
        february: 'Febrero',
        march: 'Marzo',
        april: 'Abril',
        may: 'Mayo',
        june: 'Junio',
        july: 'Julio',
        august: 'Agosto',
        september: 'Septiembre',
        october: 'Octubre',
        november: 'Noviembre',
        december: 'Diciembre'
      }
    }
  },
  auth: {
    signIn: {
      title: 'Iniciar Sesión',
      subtitle: 'Bienvenido de vuelta a tu horario de yoga',
      emailLabel: 'Correo Electrónico',
      passwordLabel: 'Contraseña',
      signInButton: 'Iniciar Sesión',
      forgotPassword: '¿Olvidaste tu contraseña?',
      noAccount: '¿No tienes una cuenta?',
      createAccount: 'Crear Cuenta',
      signInWithGoogle: 'Iniciar sesión con Google'
    },
    signUp: {
      title: 'Crear Cuenta',
      subtitle: 'Únete a nuestra comunidad de yoga',
      emailLabel: 'Correo Electrónico',
      passwordLabel: 'Contraseña',
      confirmPasswordLabel: 'Confirmar Contraseña',
      signUpButton: 'Crear Cuenta',
      alreadyHaveAccount: '¿Ya tienes una cuenta?',
      signInInstead: 'Iniciar Sesión',
      termsAgreement: 'Al crear una cuenta, aceptas nuestros términos y condiciones',
      privacyPolicy: 'Política de Privacidad',
      signUpWithGoogle: 'Registrarse con Google'
    },
    profile: {
      title: 'Perfil',
      personalInfo: 'Información Personal',
      accountSettings: 'Configuración de Cuenta',
      updateProfile: 'Actualizar Perfil',
      changePassword: 'Cambiar Contraseña',
      deleteAccount: 'Eliminar Cuenta',
      confirmDelete: '¿Está seguro de que quiere eliminar su cuenta?',
      profileUpdated: 'Perfil actualizado exitosamente',
      passwordChanged: 'Contraseña cambiada exitosamente'
    }
  },
  events: {
    list: {
      title: 'Eventos',
      noEvents: 'No se encontraron eventos',
      createFirst: 'Crea tu primer evento',
      searchPlaceholder: 'Buscar eventos...',
      filterBy: 'Filtrar por',
      sortBy: 'Ordenar por',
      showAll: 'Mostrar Todos',
      showUpcoming: 'Mostrar Próximos',
      showPast: 'Mostrar Pasados'
    },
    create: {
      title: 'Crear Evento',
      subtitle: 'Agregar una nueva clase de yoga o evento',
      eventName: 'Nombre del Evento',
      eventDescription: 'Descripción del Evento',
      startDate: 'Fecha de Inicio',
      endDate: 'Fecha de Fin',
      location: 'Ubicación',
      isOnline: 'Evento en Línea',
      maxParticipants: 'Máx. Participantes',
      price: 'Precio',
      tags: 'Etiquetas',
      createEvent: 'Crear Evento',
      eventCreated: 'Evento creado exitosamente'
    },
    details: {
      title: 'Detalles del Evento',
      participants: 'Participantes',
      duration: 'Duración',
      level: 'Nivel',
      instructor: 'Instructor',
      studio: 'Studio',
      price: 'Precio',
      bookingRequired: 'Reserva Requerida',
      cancelPolicy: 'Política de Cancelación',
      whatToBring: 'Qué Traer',
      accessInfo: 'Información de Acceso'
    },
    status: {
      upcoming: 'Próximo',
      ongoing: 'En Curso',
      completed: 'Completado',
      cancelled: 'Cancelado',
      draft: 'Borrador'
    }
  },
  calendar: {
    setup: {
      title: 'Configuración del Calendario',
      subtitle: 'Conecta tu calendario para sincronizar eventos',
      connectCalendar: 'Conectar Calendario',
      manualEntry: 'Entrada Manual',
      importEvents: 'Importar Eventos',
      syncSettings: 'Configuración de Sync',
      calendarConnected: 'Calendario Conectado',
      syncFrequency: 'Frecuencia de Sincronización',
      autoSync: 'Sincronización Automática',
      manualSync: 'Sincronización Manual',
      lastSync: 'Última Sincronización',
      syncNow: 'Sincronizar Ahora'
    },
    feeds: {
      title: 'Feeds del Calendario',
      addFeed: 'Agregar Feed',
      feedUrl: 'URL del Feed',
      feedName: 'Nombre del Feed',
      feedDescription: 'Descripción del Feed',
      feedAdded: 'Feed agregado exitosamente',
      feedUpdated: 'Feed actualizado exitosamente',
      feedDeleted: 'Feed eliminado exitosamente',
      testConnection: 'Probar Conexión',
      connectionSuccess: 'Conexión exitosa',
      connectionError: 'Error de conexión'
    },
    integration: {
      title: 'Integración del Calendario',
      description: 'Gestiona tus feeds de calendario conectados y configuraciones de sincronización.',
      modalTitle: 'Feeds del Calendario',
      modalDescription: 'Gestiona tus feeds de calendario conectados y configuraciones de sincronización.',
      noFeeds: 'Aún no hay feeds de calendario conectados.',
      addCalendar: 'Agregar Feed del Calendario',
      unnamedCalendar: 'Calendario Sin Nombre',
      active: 'Activo',
      pending: 'Pendiente',
      lastSynced: 'Última sincronización:',
      moreFeeds: '+{count} feeds más',
      manageFeeds: 'Gestionar Feeds',
      addMore: 'Agregar Más'
    },
    addCalendar: {
      title: 'Agregar Feed del Calendario',
      subtitle: 'Conecta otro calendario para sincronizar más eventos con tu horario.',
      successTitle: '¡Calendario Conectado Exitosamente!',
      successDescription: 'Tu Google Calendar ha sido conectado. Tus eventos se sincronizarán automáticamente.',
      errorTitle: 'Error de Conexión',
      errors: {
        oauth_denied: 'Negaste el acceso a tu calendario.',
        invalid_callback: 'Callback OAuth inválido. Por favor, intenta de nuevo.',
        invalid_state: 'La validación de seguridad falló. Por favor, intenta de nuevo.',
        token_exchange_failed: 'Error al intercambiar el código de autorización.',
        user_info_failed: 'Error al obtener información del usuario.',
        calendar_fetch_failed: 'Error al obtener la lista de calendarios.',
        database_error: 'Error al guardar la conexión. Por favor, intenta de nuevo.',
        internal_error: 'Ocurrió un error inesperado. Por favor, intenta de nuevo.',
        generic: 'Ocurrió un error. Por favor, intenta de nuevo.'
      }
    }
  },
  studios: {
    list: {
      title: 'Studios',
      noStudios: 'No se encontraron studios',
      createFirst: 'Crea tu primer studio',
      joinStudio: 'Unirse al Studio',
      requestAccess: 'Solicitar Acceso'
    },
    create: {
      title: 'Crear Studio',
      studioName: 'Nombre del Studio',
      studioDescription: 'Descripción del Studio',
      address: 'Dirección',
      phone: 'Teléfono',
      email: 'Correo Electrónico',
      website: 'Sitio Web',
      socialMedia: 'Redes Sociales',
      amenities: 'Servicios',
      policies: 'Políticas',
      createStudio: 'Crear Studio',
      studioCreated: 'Studio creado exitosamente'
    },
    manage: {
      title: 'Gestionar Studio',
      settings: 'Configuración',
      teachers: 'Instructores',
      schedule: 'Horario',
      rates: 'Tarifas',
      inviteTeacher: 'Invitar Instructor',
      removeTeacher: 'Remover Instructor',
      updateRates: 'Actualizar Tarifas',
      studioSettings: 'Configuración del Studio'
    }
  },
  invoices: {
    list: {
      title: 'Facturas',
      noInvoices: 'No se encontraron facturas',
      createFirst: 'Crea tu primera factura',
      pending: 'Pendiente',
      paid: 'Pagado',
      overdue: 'Vencido',
      draft: 'Borrador'
    },
    create: {
      title: 'Crear Factura',
      selectEvents: 'Seleccionar Eventos',
      billingPeriod: 'Período de Facturación',
      invoiceNumber: 'Número de Factura',
      dueDate: 'Fecha de Vencimiento',
      notes: 'Notas',
      generatePDF: 'Generar PDF',
      invoiceCreated: 'Factura creada exitosamente',
      language: 'Idioma',
      template: 'Plantilla'
    },
    details: {
      invoiceNumber: 'Factura #',
      date: 'Fecha',
      period: 'Período',
      billTo: 'Facturar a',
      event: 'Evento',
      dateCol: 'Fecha',
      studio: 'Studio',
      students: 'Estudiantes',
      rate: 'Tarifa',
      total: 'Total',
      notes: 'Notas',
      vatExempt: 'Exento de IVA según la regulación alemana de pequeñas empresas',
      untitledEvent: 'Evento sin título'
    }
  },
  dashboard: {
    welcome: 'Bienvenido, {name}',
    subtitle: 'Gestiona tu horario de clases de yoga y perfil',
    authRequired: 'Autenticación requerida',
    upcomingClasses: {
      title: 'Tus Próximas Clases',
      viewAll: 'Ver todos los eventos →',
      noCalendar: 'Conecta tu calendario para ver tus próximas clases aquí.'
    },
    calendarActions: 'Acciones del Calendario',
    publicSchedule: {
      title: 'Horario Público',
      description: 'Ve cómo aparece tu horario para tus estudiantes.',
      yourSchedule: 'Tu horario público:',
      yourScheduleCustomize: 'Tu horario público (personalizar en el perfil):',
      share: 'Compartir',
      viewPublic: 'Ver Página Pública'
    },
    manageEvents: {
      title: 'Ver Tus Eventos',
      description: 'Revisa y gestiona todos tus eventos de calendario importados.',
      button: 'Gestionar Eventos'
    },
    tagRules: {
      title: 'Reglas de Etiquetas',
      description: 'Etiqueta automáticamente tus eventos usando palabras clave.',
      button: 'Gestionar Reglas de Etiquetas'
    },
    invoices: {
      title: 'Gestión de Facturas',
      description: 'Crea perfiles de estudio y genera facturas.',
      button: 'Gestionar Facturas'
    },
    profile: {
      title: 'Configurar Perfil',
      description: 'Completa tu perfil para habilitar tu horario público.',
      button: 'Completar Perfil'
    },
    studioRequest: {
      title: 'Conexiones de Studio',
      titleConnected: 'Studios Conectados',
      titleJoin: 'Unirse a Studios',
      descriptionConnected: 'Tus conexiones de studio aprobadas para enseñanza sustituta.',
      descriptionJoin: 'Solicita unirte a studios verificados y expande tus oportunidades de enseñanza.',
      approved: 'Aprobado',
      requestMore: 'Solicitar Más Studios',
      requestAccess: 'Solicitar Acceso al Studio',
      moreStudios: '+{count} studio{plural} más conectado{plural}'
    },
    profilePage: {
      title: 'Configuración del Perfil',
      subtitle: 'Gestiona la configuración de tu cuenta e información del perfil público.',
      accountSettings: {
        title: 'Configuración de la Cuenta',
        description: 'Gestiona las preferencias de tu cuenta y configuración de seguridad.',
        viewDashboard: 'Ver Panel',
        signOut: 'Cerrar Sesión'
      }
    }
  },
  seo: {
    home: {
      title: 'SyncIt - Plataforma Hermosa de Gestión de Horarios de Yoga',
      description: 'Conecta tu calendario y crea hermosos horarios compartibles para tus clases de yoga. Confiado por 500+ instructores de yoga en todo el mundo. Gratis para empezar.',
      keywords: 'horario de yoga, sincronización de calendario, gestión de clases, plataforma de instructores, profesor de yoga, compartir horarios, integración de calendario'
    },
    dashboard: {
      title: 'Panel de Control - Gestiona tu Horario de Yoga | SyncIt',
      description: 'Gestiona tus clases de yoga, feeds de calendario y comparte tu horario con estudiantes. Ve próximas clases, gestiona eventos y rastrea tu horario de enseñanza.',
      keywords: 'panel de yoga, gestión de clases, gestión de horarios, panel de instructores, gestión de calendario'
    },
    profile: {
      title: 'Configuración del Perfil - Personaliza tu Perfil de Yoga | SyncIt',
      description: 'Personaliza tu perfil público de instructor de yoga. Añade tu biografía, especialidades, información de contacto y crea una hermosa página para tus estudiantes.',
      keywords: 'perfil de yoga, perfil de instructor, perfil de profesor de yoga, perfil público, biografía de yoga'
    },
    addCalendar: {
      title: 'Agregar Calendario - Conecta tu Horario de Yoga | SyncIt',
      description: 'Conecta tu Google Calendar, iCloud o cualquier feed de calendario para sincronizar automáticamente tus clases de yoga. Configuración fácil en menos de 2 minutos.',
      keywords: 'sincronización de calendario, Google Calendar, sincronización iCloud, integración de calendario, calendario de yoga'
    },
    manageEvents: {
      title: 'Gestionar Eventos - Tus Clases de Yoga | SyncIt',
      description: 'Ve y gestiona todas tus clases de yoga y eventos. Edita detalles de clases, añade etiquetas y organiza tu horario de enseñanza.',
      keywords: 'eventos de yoga, gestión de clases, gestión de eventos, horario de yoga, organización de clases'
    },
    manageTags: {
      title: 'Gestionar Etiquetas - Organiza tus Clases de Yoga | SyncIt',
      description: 'Crea y gestiona etiquetas para tus clases de yoga. Categoriza clases automáticamente por tipo, nivel y ubicación.',
      keywords: 'etiquetas de yoga, categorías de clases, tipos de clases de yoga, organización de eventos, etiquetado de clases'
    },
    studios: {
      title: 'Studios - Tus Ubicaciones de Enseñanza | SyncIt',
      description: 'Gestiona tus relaciones con estudios de yoga y ubicaciones de enseñanza. Conéctate con estudios y rastrea tus oportunidades de enseñanza.',
      keywords: 'estudios de yoga, ubicaciones de enseñanza, gestión de estudios, red de profesores de yoga'
    },
    invoices: {
      title: 'Facturas - Gestión de Ingresos de Enseñanza de Yoga | SyncIt',
      description: 'Genera facturas profesionales para tu enseñanza de yoga. Rastrea ingresos, crea reportes de facturación y gestiona tus ingresos de enseñanza.',
      keywords: 'facturas de yoga, ingresos de enseñanza, facturación de yoga, pagos de instructores, ingresos de enseñanza'
    },
    teacherSchedule: {
      title: '{teacherName} - Horario de Clases de Yoga',
      description: 'Reserva clases de yoga con {teacherName}. Ve próximas sesiones, tipos de clases, especialidades e información de contacto. {location}',
      keywords: 'clases de yoga, {teacherName}, reservar yoga, horario de yoga, instructor de yoga, {location}'
    },
    auth: {
      signIn: {
        title: 'Iniciar Sesión - Accede a tu Panel de Yoga | SyncIt',
        description: 'Inicia sesión en tu cuenta SyncIt para gestionar tu horario de yoga, feeds de calendario y compartir tus clases con estudiantes.',
        keywords: 'iniciar sesión, login, panel de yoga, login de instructor, acceso a cuenta'
      },
      signUp: {
        title: 'Crear Cuenta - Inicia tu Horario de Yoga | SyncIt',
        description: 'Crea tu cuenta gratuita de SyncIt y comienza a compartir tu horario de yoga con estudiantes. Conecta tu calendario y construye tu presencia online.',
        keywords: 'crear cuenta, registrarse, instructor de yoga, cuenta gratuita, compartir horarios'
      }
    },
    errors: {
      notFound: {
        title: 'Página No Encontrada - SyncIt',
        description: 'La página que buscas no pudo ser encontrada. Regresa a tu panel de horario de yoga o navega nuestra plataforma de instructores de yoga.',
        keywords: 'página no encontrada, 404, horario de yoga, plataforma de instructores'
      },
      serverError: {
        title: 'Error del Servidor - SyncIt',
        description: 'Estamos experimentando dificultades técnicas. Por favor intenta de nuevo más tarde o contacta soporte para asistencia con tu horario de yoga.',
        keywords: 'error del servidor, soporte técnico, soporte de plataforma de yoga'
      }
    }
  }
}

export default translations 