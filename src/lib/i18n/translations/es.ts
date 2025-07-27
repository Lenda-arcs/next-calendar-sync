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
      signOut: 'Cerrar Sesión',
      appName: 'avara.'
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
    },
    errors: {
      notFound: {
        title: 'Página no encontrada',
        description: '¡Ups! La página que buscas parece haberse perdido. No te preocupes, incluso las mejores posturas de yoga requieren algunos ajustes.',
        goHome: 'Ir al inicio',
        goBack: 'Volver',
        helpfulLinks: '¿Buscas algo específico? Prueba estas páginas populares:',
        stillTrouble: '¿Sigues teniendo problemas?',
        contactSupport: 'Si crees que esto es un error, por favor',
        supportTeam: 'contacta a nuestro equipo de soporte',
        findHelp: 'y te ayudaremos a encontrar lo que buscas.'
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
      title: 'Calendario de Yoga',
      addFeed: 'Importar Eventos',
      feedUrl: 'URL del Calendario',
      feedName: 'Nombre del Calendario',
      feedDescription: 'Descripción del Calendario',
      feedAdded: 'Calendario conectado exitosamente',
      feedUpdated: 'Calendario actualizado exitosamente',
      feedDeleted: 'Conexión del calendario eliminada exitosamente',
      testConnection: 'Probar Conexión',
      connectionSuccess: 'Conexión exitosa',
      connectionError: 'Conexión fallida'
    },
    integration: {
      title: 'Calendario de Yoga',
      description: 'Administra tu calendario de yoga dedicado y configuraciones de sincronización.',
      modalTitle: 'Tu Calendario de Yoga',
      modalDescription: 'Administra tu calendario de yoga dedicado y configuraciones de sincronización.',
      noFeeds: 'Aún no hay calendario de yoga conectado.',
      addCalendar: 'Configurar Calendario de Yoga',
      unnamedCalendar: 'Calendario Sin Nombre',
      active: 'Activo',
      pending: 'Pendiente',
      lastSynced: 'Última sincronización:',
      moreFeeds: '+{count} calendario{plural} más',
      manageFeeds: 'Administrar Calendario',
      addMore: 'Importar Más Eventos'
    },
    yogaOnboarding: {
      setup: {
        title: 'Configurar tu calendario de yoga',
        subtitle: 'Crearemos un calendario dedicado en tu cuenta de Google para gestionar tus clases de yoga.',
        step1: {
          title: 'Conectar Google Calendar',
          description: 'Conecta tu cuenta de Google para habilitar la sincronización del calendario',
          successDescription: '¡Google Calendar conectado exitosamente!',
          button: 'Conectar Google Calendar',
          connecting: 'Conectando...'
        },
        step2: {
          title: 'Crear tu calendario de yoga',
          description: 'Crearemos un nuevo calendario específicamente para tus clases de yoga',
          successDescription: '¡Tu calendario de yoga dedicado ha sido creado!',
          successMessage: '¡Tu calendario de yoga está listo! Ahora puedes crear y gestionar eventos directamente en Google Calendar, y aparecerán automáticamente en tu perfil público.',
          button: 'Crear calendario de yoga',
          creating: 'Creando calendario...',
          openGoogleCalendar: 'Abrir Google Calendar',
          goToDashboard: 'Ir al panel'
        },
        whatWeCreate: {
          title: 'Lo que crearemos:',
          items: [
            'Un nuevo calendario llamado "Mi horario de yoga (sincronizado con lenna.yoga)"',
            'Sincronización automática bidireccional entre Google Calendar y tu perfil',
            'Los eventos que crees aparecerán en tu horario público'
          ]
        },
        howItWorks: {
          title: 'Cómo funciona',
          step1: {
            title: '1. Crear eventos en Google Calendar',
            description: 'Usa tu teléfono, web o cualquier aplicación de calendario'
          },
          step2: {
            title: '2. Los eventos se sincronizan automáticamente',
            description: 'Los cambios aparecen en tu perfil de lenna.yoga en minutos'
          },
          step3: {
            title: '3. Los estudiantes descubren tus clases',
            description: 'Tu horario es visible en tu perfil público de instructor'
          }
        }
      },
      import: {
        title: 'Importar eventos existentes',
        subtitle: 'Llena rápidamente tu calendario de yoga con eventos de tu calendario existente',
        choose: {
          googleCard: {
            title: 'Importar desde Google Calendar',
            description: 'Importa eventos desde tus otros calendarios de Google (recomendado)',
            button: 'Elegir Google Calendar',
            loading: 'Cargando calendarios...'
          },
          icsCard: {
            title: 'Subir archivo ICS',
            description: 'Importa desde Apple Calendar, Outlook o cualquier aplicación de calendario que exporte archivos .ics',
            fileLabel: 'Seleccionar archivo .ics',
            exportGuide: {
              title: 'Cómo exportar tu calendario',
              apple: 'Archivo → Exportar → Exportar...',
              outlook: 'Archivo → Guardar calendario → Formato iCalendar',
              google: 'Configuración → Importar y exportar → Exportar'
            }
          },
          actions: {
            skip: 'Omitir por ahora',
            manual: 'Añadiré eventos manualmente'
          }
        },
        selectGoogle: {
          title: 'Elegir calendario para importar',
          description: 'Selecciona uno de tus calendarios de Google para importar eventos',
          noCalendars: 'No se encontraron calendarios adicionales para importar',
          primaryBadge: 'Principal',
          backButton: 'Volver a opciones de importación'
        },
        importing: {
          title: 'Importando eventos',
          description: 'Añadiendo eventos seleccionados a tu calendario de yoga...'
        },
        complete: {
          success: {
            title: '¡Importación completa!',
            description: 'Todos los {count} evento{plural} importados exitosamente'
          },
          partial: {
            title: '¡Importación mayormente completa!',
            description: '{imported} evento{importedPlural} importados exitosamente{skipped, select, 0 {} other {, {skipped} fallaron}}'
          },
          errors: {
            title: 'Eventos que no pudieron importarse:',
            moreCount: '...y {count} más',
            commonIssues: 'Problemas comunes: zona horaria faltante, eventos duplicados o permisos de calendario.'
          },
          actions: {
            continue: 'Continuar al panel',
            importMore: 'Importar más eventos'
          }
        }
      },
      completion: {
        success: '¡Calendario importado exitosamente!',
        skipped: 'Omitiendo importación de calendario.'
      }
    },
    addCalendar: {
      title: 'Configurar Calendario de Yoga',
      subtitle: 'Configura tu calendario de yoga dedicado o importa más eventos a tu calendario existente.',
      successTitle: '¡Calendario de Yoga Conectado!',
      successDescription: 'Tu calendario de yoga dedicado ha sido conectado. Tus eventos ahora se sincronizarán automáticamente.',
      errorTitle: 'Conexión Fallida',
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
    },

    management: {
      title: 'Gestión de Estudios',
      subtitle: 'Gestionar estudios, instructores y relaciones de facturación',
      createStudio: 'Crear Estudio',
      accessRestricted: 'Acceso Restringido',
      accessRestrictedDesc: 'Solo los administradores pueden gestionar estudios.',
      overview: {
        totalStudios: 'Estudios Totales',
        activeTeachers: 'Instructores Activos',
        verifiedStudios: 'Estudios Verificados'
      },
      tabs: {
        studios: 'Estudios',
        teacherRequests: 'Solicitudes de Instructores'
      }
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
    },
    
    management: {
      title: 'Gestionar Facturas',
      subtitle: 'Crear y rastrear facturas para sus eventos y servicios.',
      tabs: {
        billing: 'Facturación y Eventos',
        billingShort: 'Facturación',
        invoices: 'Facturas',
        invoicesShort: 'Facturas',
        settings: 'Configuración',
        settingsShort: 'Config'
      },
      billingTab: {
        title: 'Facturación y Eventos',
        description: 'Gestionar eventos no facturados agrupados por estudio, sincronizar datos históricos y solucionar problemas de coincidencia. Crear facturas para clases completadas.',
        loading: 'Cargando eventos no facturados...'
      },
      invoicesTab: {
        title: 'Sus Facturas',
        description: 'Ver y gestionar sus facturas creadas.',
        noInvoicesTitle: 'Aún no hay Facturas',
        noInvoicesDescription: 'Cree su primera factura seleccionando eventos de la pestaña "Eventos No Facturados".',
        viewUninvoiced: 'Ver Eventos No Facturados'
      },
      settingsTab: {
        title: 'Configuración de Facturas y Perfiles de Facturación',
        description: 'Gestionar su información personal de facturación y configuraciones de entidades de facturación.',
        loading: 'Cargando configuración...'
      }
    },
    
    creation: {
      modalTitle: '{mode} Factura - {studioName}',
      editTitle: 'Editar',
      createTitle: 'Crear',
      invoiceDetails: 'Detalles de Factura',
      invoiceNumber: 'Número de Factura',
      notes: 'Notas (Opcional)',
      notesPlaceholder: 'Agregar notas adicionales para esta factura...',
      events: 'Eventos ({count})',
      eventsDescription: 'Haga clic en el ícono de editar para modificar el título y tarifa de cada evento.',
      total: 'Total:',
      noEvents: 'No hay eventos seleccionados.',
      creating: 'Creando...',
      updating: 'Actualizando...',
      create: 'Crear Factura',
      update: 'Actualizar Factura',
      cancel: 'Cancelar',
      close: 'Cerrar',
      successTitle: '¡Factura Creada Exitosamente!',
      successUpdatedTitle: '¡Factura Actualizada Exitosamente!',
      successMessage: 'Factura {invoiceNumber} ha sido {mode} por €{total}',
      pdfOptions: 'Opciones de PDF',
      generatePDF: 'Generar PDF',
      generating: 'Generando PDF...',
      viewPDF: 'Ver PDF',
      pdfGenerated: '¡PDF Generado Exitosamente!',
      pdfGeneratedDesc: 'Su PDF de factura ha sido creado y está listo para ver.',
      pdfFailed: 'Generación de PDF Falló',
      pdfFailedDesc: 'No se pudo generar el PDF. Por favor intente de nuevo.'
    },
    
    card: {
      unknownStudio: 'Estudio Desconocido',
      events: 'eventos',
      period: 'Período:',
      created: 'Creado:',
      pdf: 'PDF',
      edit: 'Editar',
      view: 'Ver',
      draft: 'Borrador',
      sent: 'Enviado',
      paid: 'Pagado',
      overdue: 'Vencido',
      cancelled: 'Cancelado',
      sent_: 'Enviado',
      paid_: 'Pagado',
      overdue_: 'Vencido',
      statusChange: 'Estado:',
      generatePDF: 'Generar PDF',
      viewPDF: 'Ver PDF',
      delete: 'Eliminar',
      confirmDelete: '¿Eliminar Factura?',
      confirmDeleteDesc: 'Esta acción no se puede deshacer. Esto eliminará permanentemente la factura y removerá todos los enlaces de eventos.',
      deleteSuccess: 'Factura Eliminada Exitosamente',
      deleteSuccessDesc: 'Factura, archivo PDF y todos los enlaces de eventos han sido removidos. Los eventos ahora están disponibles para futuras facturas.',
      deleteFailed: 'Error al Eliminar Factura',
      deleteFailedDesc: 'No se pudo eliminar la factura. Por favor intente de nuevo.'
    },
    
    settings: {
      invoiceInfoTitle: 'Su Información de Factura',
      invoiceInfoDesc: 'Configure sus detalles personales de facturación para generar facturas',
      editSettings: 'Editar Configuración',
      noSettingsTitle: 'No hay configuración de facturas configurada',
      noSettingsDesc: 'Configure su información de facturación para generar facturas',
      setupSettings: 'Configurar Ajustes de Factura',
      setupComplete: 'Configuración Completa',
      contactInfo: 'Información de Contacto',
      email: 'Correo Electrónico',
      phone: 'Teléfono',
      address: 'Dirección',
      bankingTax: 'Información Bancaria y Fiscal',
      iban: 'IBAN',
      bic: 'BIC/SWIFT',
      taxId: 'ID Fiscal',
      vatId: 'ID de IVA',
      noBankingTaxInfo: 'No se proporcionó información bancaria o fiscal',
      billingProfilesTitle: 'Perfiles de Facturación',
      billingProfilesDesc: 'Configurar información de facturación para estudios y profesores',
      pdfCustomizationTitle: 'Personalización de Plantilla PDF',
      pdfCustomizationDesc: 'Personalice la apariencia de sus PDFs de factura con logos, colores y opciones de diseño',
      currentTheme: 'Tema Actual:',
      customConfiguration: 'Configuración de plantilla personalizada activa',
      defaultConfiguration: 'Usando configuración de plantilla predeterminada',
      openTemplateEditor: 'Abrir Editor de Plantillas',
      previewCurrentTemplate: 'Vista Previa de Plantilla Actual',
      generating: 'Generando...',
      pdfTemplateSettingsSaved: 'Configuración de plantilla PDF guardada exitosamente',
      pdfTemplateSettingsFailed: 'Error al guardar la configuración de plantilla PDF',
      noCustomTemplateToPreview: 'No hay configuración de plantilla personalizada para previsualizar. Intente seleccionar un tema diferente o agregar configuraciones personalizadas.',
      pdfPreviewGenerated: '¡Vista previa PDF generada exitosamente!',
      pdfPreviewFailed: 'Error al generar vista previa PDF'
    },
    
    settingsForm: {
      basicInfo: 'Información Básica',
      bankingInfo: 'Información Bancaria',
      taxInfo: 'Información Fiscal',
      fullName: 'Nombre Completo',
      fullNameRequired: 'Nombre Completo *',
      email: 'Correo Electrónico',
      phone: 'Teléfono',
      address: 'Dirección',
      iban: 'IBAN',
      ibanPlaceholder: 'DE89 3704 0044 0532 0130 00',
      bic: 'Código BIC/SWIFT',
      bicPlaceholder: 'COBADEFFXXX',
      taxId: 'ID Fiscal',
      vatId: 'ID de IVA',
      vatIdPlaceholder: 'DE123456789',
      kleinunternehmerregelung: 'Kleinunternehmerregelung (§19 UStG)',
      kleinunternehmerregelungDesc: 'Marque esto si está exento del IVA bajo la regulación alemana de pequeñas empresas. Esto agregará el texto legal requerido a sus facturas.',
      saving: 'Guardando...',
      updateSettings: 'Actualizar Configuración',
      saveSettings: 'Guardar Configuración',
      cancel: 'Cancelar',
      editTitle: 'Editar Configuración de Facturas',
      setupTitle: 'Configurar Ajustes de Factura'
    },
    
    uninvoiced: {
      billingTitle: 'Facturación y Eventos',
      billingDesc: 'Gestionar eventos no facturados agrupados por estudio, sincronizar datos históricos y solucionar problemas de coincidencia. Crear facturas para clases completadas.',
      loading: 'Cargando eventos no facturados...',
      noEvents: 'No se encontraron eventos no facturados.',
      noEventsTitle: 'Sin Eventos No Facturados',
      noEventsDescription: 'Todos sus eventos completados han sido facturados, o aún no tiene eventos con estudios asignados.',
      createInvoice: 'Crear Factura',
      selectAll: 'Seleccionar Todo',
      deselectAll: 'Deseleccionar Todo',
      selectedCount: '{count} seleccionado',
      selectedTotal: 'Seleccionado',
      refresh: 'Actualizar',
      refreshing: 'Actualizando...',
      syncingRefreshing: 'Sincronizando y Actualizando...',
      studioActions: 'Acciones del Estudio',
      eventActions: 'Acciones del Evento',
      substituteTeacher: 'Configurar Instructor Sustituto',
      editEvent: 'Editar Detalles del Evento',
      exclude: 'Marcar como Gratuito',
      rematchStudios: 'Reemparejar con Estudios',
      rematching: 'Reemparejando...',
      updating: 'Actualizando...',
      fixStudioMatching: 'Reparar Coincidencia de Estudio',
      fixMatching: 'Reparar Coincidencia',
      payout: 'Pago:',
      total: 'Total',
      selected: 'Seleccionado',
      unknownStudio: 'Estudio Desconocido',
      eventWithoutStudio: 'Eventos sin coincidencia de estudio',
      untitledEvent: 'Evento Sin Título',
      noDate: 'Sin fecha',
      teacher: 'Instructor',
      event: 'evento',
      events: 'eventos',
      studioMatchingIssues: 'Problemas de coincidencia de estudio',
      studioMatchingIssuesDesc: 'Vuelva a aplicar patrones de ubicación de estudio a eventos existentes para solucionar problemas de asignación.',
      studioMatchingIssuesMobileDesc: 'Solucionar problemas de asignación de estudio',
      studioMatchingUpdated: '¡Coincidencia de Estudio Actualizada!',
      studioMatchingUpdatedDesc: '{updated_count} de {total_events_processed} eventos fueron emparejados con estudios.',
      studioMatchingFailed: 'Error al actualizar la coincidencia de estudio',
      rateConfig: {
        noRateConfig: 'Sin configuración de tarifa',
        flatRate: 'Tarifa Fija',
        perStudent: 'Por Estudiante',
        tieredRates: 'Tarifas Escalonadas',
        variable: 'Variable',
        base: 'Base:'
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
    },

    pdfCustomization: {
      title: 'Personalización de Plantilla PDF',
      description: 'Personalice la apariencia de sus PDFs de factura con logos, colores y opciones de diseño',
      tabs: {
        theme: 'Tema',
        branding: 'Marca',
        layout: 'Diseño'
      },
      buttons: {
        cancel: 'Cancelar',
        preview: 'Vista Previa PDF',
        save: 'Guardar Plantilla',
        saving: 'Guardando...',
        generating: 'Generando...',
        generatingPreview: 'Generando...'
      },
      theme: {
        title: 'Tema de Plantilla',
        professional: {
          label: 'Profesional',
          description: 'Encabezados gris oscuro, tablas con bordes, diseño empresarial clásico'
        },
        modern: {
          label: 'Moderno',
          description: 'Acentos verde esmeralda brillante, tablas mínimas, diseño espacioso'
        },
        minimal: {
          label: 'Mínimo',
          description: 'Tonos gris claro, fuentes pequeñas, diseño compacto y estrecho'
        },
        creative: {
          label: 'Creativo',
          description: 'Encabezados y acentos morados, fuentes grandes, estilo moderno'
        },
        custom: {
          label: 'Personalizado',
          description: 'Control completo sobre todos los colores, fuentes y opciones de diseño'
        },
        selected: 'Seleccionado'
      },
      branding: {
        logoUpload: {
          title: 'Logo y Marca',
          description: 'Suba el logo de su empresa para los encabezados de facturas',
          uploadLogo: 'Subir Logo',
          currentLogo: 'Logo actual:',
          logoSize: 'Tamaño del Logo',
          logoPosition: 'Posición del Logo',
          sizes: {
            small: 'Pequeño',
            medium: 'Mediano',
            large: 'Grande'
          },
          positions: {
            topLeft: 'Arriba Izquierda',
            topCenter: 'Arriba Centro',
            topRight: 'Arriba Derecha',
            headerLeft: 'Encabezado Izquierda',
            headerCenter: 'Encabezado Centro',
            headerRight: 'Encabezado Derecha'
          }
        },
        colors: {
          title: 'Colores',
          description: 'Personalice colores para su plantilla',
          customOnly: 'Colores',
          customOnlyDesc: 'La personalización de colores solo está disponible con el tema Personalizado. Seleccione "Personalizado" para modificar colores.',
          headerColor: 'Color del Encabezado',
          accentColor: 'Color de Acento'
        },
        text: {
          letterhead: 'Texto del Membrete',
          letterheadPlaceholder: 'Ingrese texto del membrete (ej. nombre de empresa, eslogan)',
          footer: 'Texto del Pie de Página',
          footerPlaceholder: 'Ingrese texto del pie de página (ej. información de contacto, avisos legales)'
        }
      },
      layout: {
        typography: {
          title: 'Tipografía',
          fontFamily: 'Familia de Fuente',
          fontSize: 'Tamaño de Fuente',
          fonts: {
            helvetica: 'Helvetica',
            times: 'Times',
            courier: 'Courier',
            arial: 'Arial'
          },
          sizes: {
            small: 'Pequeño',
            normal: 'Normal',
            large: 'Grande'
          }
        },
        page: {
          title: 'Configuración de Página',
          orientation: 'Orientación de Página',
          size: 'Tamaño de Página',
          orientations: {
            portrait: 'Vertical',
            landscape: 'Horizontal'
          },
          sizes: {
            a4: 'A4',
            letter: 'Carta',
            legal: 'Legal'
          }
        },
        content: {
          title: 'Opciones de Contenido',
          showCompanyInfo: 'Mostrar Información de la Empresa',
          showCompanyAddress: 'Mostrar Dirección de la Empresa',
          showLogo: 'Mostrar Logo',
          showInvoiceNotes: 'Mostrar Notas de Factura',
          showTaxInfo: 'Mostrar Información Fiscal',
          showPaymentTerms: 'Mostrar Términos de Pago'
        }
      },
      preview: {
        success: '¡Vista previa PDF generada exitosamente!',
        failed: 'Error al generar vista previa PDF',
        failedDesc: 'Por favor intente de nuevo.'
      }
    },

    billingEntities: {
      title: 'Entidades de Facturación',
      noBillingEntities: 'Aún no se han configurado entidades de facturación',
      noBillingEntitiesDesc: 'Crea tu primer perfil de estudio o instructor para comenzar a gestionar facturas',
      createFirstProfile: 'Crear Tu Primer Perfil',
      addNew: 'Agregar Nuevo',
      studios: 'Estudios',
      teachers: 'Instructores',
      deleteTitle: 'Eliminar Entidad de Facturación',
      deleteConfirmation: '¿Estás seguro de que quieres eliminar "{name}"? Esta acción no se puede deshacer y eliminará toda la información de facturación asociada.',
      cancel: 'Cancelar',
      delete: 'Eliminar'
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
  pages: {
    manageEvents: {
      title: 'Gestionar Eventos',
      subtitle: 'Editar etiquetas, gestionar visibilidad y organizar tus clases',
      authRequired: 'Autenticación requerida',
      authRequiredDesc: 'Por favor inicia sesión para gestionar tus eventos.',
      loadError: 'Error al cargar eventos',
      tryAgain: 'Intentar de nuevo',
      noEventsForFilter: 'No se encontraron eventos para los filtros actuales',
      changeFilters: 'Intenta cambiar tus filtros para ver más eventos',
      pendingChanges: '{count} cambios pendientes',
      saveChanges: 'Guardar Cambios',
      discardChanges: 'Descartar Cambios',
      savingChanges: 'Guardando cambios...',
      syncingCalendar: 'Sincronizando calendario...',
      refreshEvents: 'Actualizar Eventos',
      createTag: 'Crear Etiqueta',
      manageTag: 'Gestionar Etiquetas',
      controlPanel: {
        title: 'Gestión de Eventos',
        timeLabel: 'Tiempo:',
        visibilityLabel: 'Visibilidad:',
        futureEvents: 'Eventos Futuros',
        allEvents: 'Todos los Eventos',
        allVisibility: 'Todos ({count})',
        publicVisibility: 'Público ({count})',
        privateVisibility: 'Privado ({count})',
        createNewTag: 'Crear Nueva Etiqueta',
        createNewEvent: 'Crear Nuevo Evento',
        newEvent: 'Nuevo Evento',
        newTag: 'Nueva Etiqueta',
        refresh: 'Actualizar',
        createAndManage: 'Crear y Gestionar',
        systemTools: 'Herramientas del Sistema',
        syncCalendar: 'Sincronizar Calendario',
        syncing: 'Sincronizando...',
        quickActions: 'Acciones Rápidas (~1-3s)',
        fullCalendarSync: 'Sincronización Completa del Calendario',
        syncDescription: 'Reparar etiquetas de eventos o descargar datos frescos del calendario (~15-30s para sincronizar)',
        availableTags: 'Etiquetas Disponibles:'
      },
      emptyState: {
        noEvents: 'No se encontraron eventos',
        noEventsFiltered: 'Ningún evento coincide con tus filtros',
        connectCalendar: 'Configura tu calendario de yoga para comenzar a importar eventos.',
        changeFiltersPublicPrivate: 'Intenta cambiar tus filtros para ver eventos {visibility} o eventos pasados.',
        changeFiltersTime: 'Intenta cambiar el filtro de tiempo para ver todos los eventos incluyendo los pasados.',
        changeFiltersVisibility: 'Intenta cambiar el filtro de visibilidad para ver todos los eventos.',
        addCalendarFeed: 'Configurar Calendario de Yoga',
        showAllVisibility: 'Mostrar Todas las Visibilidades',
        showAllTime: 'Mostrar Todos los Tiempos'
      },
      floatingButtons: {
        discardTooltip: 'Descartar todos los cambios pendientes',
        saving: 'Guardando...',
        saveChanges: 'Guardar {count} Cambio{plural}'
      },
      dateHeaders: {
        today: 'Hoy',
        tomorrow: 'Mañana'
      },
      rematch: {
        updating: 'Actualizando...',
        selectedEvents: 'Eventos Seleccionados',
        feedEvents: 'Eventos del Feed',
        allEvents: 'Todos los Eventos',
        tags: 'Etiquetas',
        studios: 'Studios',
        fixAction: 'Reparar {actions} para {scope}',
        matchingUpdated: '¡Coincidencia Actualizada!',
        eventsUpdated: '{updated} de {total} eventos fueron actualizados.',
        failedToUpdate: 'Error al actualizar coincidencia'
      },
      historicalSync: {
        title: 'Faltan eventos anteriores',
        description: 'Sincroniza eventos históricos de tus feeds de calendario conectados para encontrar clases no facturadas de meses anteriores.',
        mobileDescription: 'Sincronizar eventos históricos de feeds de calendario',
        syncButton: 'Sincronizar Eventos Históricos',
        syncButtonMobile: 'Sincronizar Históricos',
        syncing: 'Sincronizando...',
        noFeeds: 'No se Encontraron Feeds de Calendario',
        noFeedsDesc: 'Por favor conecta tus feeds de calendario primero antes de sincronizar eventos históricos.',
        syncComplete: '¡Sincronización Histórica Completa!',
        syncCompleteDesc: '{count} evento{plural} histórico{plural} sincronizado{plural} de {feeds} feed{feedsPlural} de calendario. {matched} evento{matchedPlural} fueron emparejado{matchedPlural} con etiquetas y studios.',
        syncCompleteNoEvents: 'No se encontraron nuevos eventos históricos. Tus feeds de calendario ({feeds}) fueron verificados exitosamente.',
        syncFailed: 'Sincronización Histórica Fallida',
        syncFailedDesc: 'No se pudieron sincronizar eventos históricos. Por favor intenta de nuevo.'
      },
      unmatchedEvents: {
        title: 'Eventos No Emparejados',
        description: 'Eventos que no pudieron ser emparejados con una ubicación de studio',
        mobileDescription: 'No emparejados con studios',
        excludeButton: 'Marcar como Gratuito',
        excludeTooltip: 'Marcar este evento como excluido del emparejamiento con studios',
        eventExcluded: 'Evento Marcado como Gratuito',
        eventExcludedDesc: 'El evento ha sido excluido del emparejamiento con studios y facturación.',
        excludeFailed: 'Error al Marcar Evento como Gratuito',
        excludeFailedDesc: 'No se pudo excluir el evento. Por favor intenta de nuevo.'
      },
      filterControls: {
        timeFilter: 'Filtro de Tiempo',
        visibilityFilter: 'Filtro de Visibilidad',
        allTime: 'Todo el Tiempo',
        futureOnly: 'Solo Futuros',
        allVisibility: 'Todos',
        publicOnly: 'Solo Públicos',
        privateOnly: 'Solo Privados'
      },
      stats: {
        totalEvents: 'Total de Eventos',
        publicEvents: 'Eventos Públicos',
        privateEvents: 'Eventos Privados'
      }
    },
    manageTags: {
      title: 'Gestión de Etiquetas',
      subtitle: 'Organiza tus eventos de calendario con etiquetado inteligente. Configura reglas automáticas para etiquetar eventos basándose en palabras clave, y gestiona tu biblioteca de etiquetas de manera organizada.',
      manageRules: 'Gestionar Reglas de Etiquetas',
      createTag: 'Crear Nueva Etiqueta',
      tagLibrary: 'Biblioteca de Etiquetas',
      automationRules: 'Reglas de Automatización',
      noTags: 'Aún no se han creado etiquetas',
      createFirstTag: 'Crea tu primera etiqueta para comenzar a organizar tus eventos',
      noRules: 'No se han configurado reglas de automatización',
      createFirstRule: 'Crea tu primera regla para etiquetar eventos automáticamente',
      tagRuleManager: {
        creating: 'Creando Regla',
        updating: 'Actualizando Regla',
        creatingDesc: 'Agregando nueva regla de etiqueta...',
        updatingDesc: 'Actualizando regla de etiqueta...',
        noTagsAvailable: 'No hay etiquetas disponibles. Crea algunas etiquetas primero para configurar reglas de etiquetas.',
        toasts: {
          ruleCreated: '¡Regla de Etiqueta Creada!',
          ruleUpdated: '¡Regla de Etiqueta Actualizada!',
          ruleDeleted: '¡Regla de Etiqueta Eliminada!',
          ruleCreatedDesc: '{count} de {total} eventos fueron re-etiquetados con tu nueva regla.',
          ruleUpdatedDesc: '{count} de {total} eventos fueron re-etiquetados con tu regla actualizada.',
          ruleDeletedDesc: '{count} de {total} eventos fueron re-etiquetados después de eliminar la regla.',
          applyError: 'Error al aplicar nueva regla de etiqueta',
          applyErrorDesc: 'La regla fue creada pero no pudo ser aplicada a eventos existentes.',
          updateError: 'Error al aplicar regla de etiqueta actualizada',
          updateErrorDesc: 'La regla fue actualizada pero no pudo ser aplicada a eventos existentes.',
          deleteError: 'Error al aplicar cambios de etiquetas',
          deleteErrorDesc: 'La regla fue eliminada pero los cambios no pudieron ser aplicados a eventos existentes.'
        }
      },
      tagLibraryComponent: {
        creating: 'Creando etiqueta...',
        updating: 'Actualizando etiqueta...',
        deleting: 'Eliminando etiqueta...',
        noTagsFound: '¡No se encontraron etiquetas. Crea tu primera etiqueta!',
        globalTags: 'Etiquetas Globales',
        customTags: 'Tus Etiquetas Personalizadas',
        noCustomTags: 'Aún no hay etiquetas personalizadas',
        createFirstCustomTag: 'Crea tu primera etiqueta personalizada para comenzar',
        unnamedTag: 'Etiqueta Sin Nombre',
        moreItems: '+{count} más'
      },
      tagRules: {
        title: 'Reglas de Etiquetas',
        createRule: 'Crear Regla',
        activeRules: 'Reglas Activas',
        pending: ' + 1 pendiente',
        inTitleDescription: 'en título/descripción',
        inLocation: 'en ubicación',
        inTitleDescriptionLegacy: 'en título o descripción (legado)',
        applies: 'aplica',
        unknownTag: 'Etiqueta Desconocida',
        noRulesConfigured: 'No hay reglas de etiquetas configuradas',
        createFirstRuleDesc: 'Crea tu primera regla para etiquetar eventos automáticamente basándose en palabras clave'
      },
      tagRuleForm: {
        editTitle: 'Editar Regla de Etiqueta',
        createTitle: 'Crear Regla de Etiqueta',
        editDescription: 'Actualiza esta regla para cambiar cómo se etiquetan automáticamente los eventos.',
        createDescription: 'Crea una nueva regla para etiquetar automáticamente eventos basándose en palabras clave en su título, descripción o ubicación.',
        cancel: 'Cancelar',
        updating: 'Actualizando...',
        creating: 'Creando...',
        updateRule: 'Actualizar Regla',
        createRule: 'Crear Regla',
        keywordsLabel: 'Palabras Clave (Título/Descripción)',
        keywordsPlaceholder: 'ej., Flow, Vinyasa, Meditación',
        keywordsHelp: 'Coincidir estas palabras clave en títulos o descripciones de eventos (máx. 5)',
        locationLabel: 'Palabras Clave de Ubicación',
        locationPlaceholder: 'ej., Estudio A, Sala Flow, Salón Principal',
        locationHelp: 'Coincidir estas palabras clave en ubicaciones de eventos (máx. 5)',
        selectTag: 'Seleccionar Etiqueta',
        selectTagPlaceholder: 'Seleccionar Etiqueta...',
        tagHelp: 'Los eventos que coincidan con las palabras clave serán etiquetados con esta etiqueta',
        howItWorksTitle: 'Cómo Funcionan las Reglas de Etiquetas',
        howItWorksBullets: {
          autoTag: '• Los eventos se etiquetan automáticamente cuando coinciden con cualquiera de las palabras clave especificadas',
          titleSearch: '• Las palabras clave de título/descripción buscan en títulos y descripciones de eventos',
          locationSearch: '• Las palabras clave de ubicación buscan solo en ubicaciones de eventos',
          required: '• Se requiere al menos un tipo de palabra clave',
          immediate: '• Los cambios se aplican a eventos existentes inmediatamente'
        }
      }
    },
    publicSchedule: {
      navbar: {
        home: 'Inicio',
        closeProfile: 'Cerrar perfil'
      },
      hero: {
        yogaTeacher: 'Profesora de Yoga',
        specialties: 'Especialidades',
        email: 'Correo Electrónico',
        instagram: 'Instagram',
        website: 'Sitio Web',
        share: 'Compartir',
        shareSchedule: 'Compartir Horario',
        export: 'Exportar',
        exportEvents: 'Exportar Eventos',
        exporting: 'Exportando...',
        defaultBio: 'Únete a {name} para clases de yoga y movimiento consciente. Echa un vistazo a mis próximas sesiones y reserva tu lugar.',
        defaultBioNoName: 'Bienvenido a mi horario',
        shareTitle: 'Horario de Yoga de {name}',
        shareDescription: '¡Echa un vistazo a las próximas clases de yoga de {name} y únete a una sesión!',
        shareDefaultTitle: 'Horario de Yoga del Profesor',
        shareDefaultDescription: '¡Echa un vistazo a las próximas clases de yoga y únete a una sesión!'
      },
      schedule: {
        header: {
          title: 'Próximas Clases',
          classesCount: '{filtered} de {total} clases en los próximos 3 meses',
          classesCountFiltered: '{filtered} de {total} clases en los próximos 3 meses (filtradas)',
          clearFilters: 'Limpiar Filtros'
        },
        filters: {
          when: {
            label: 'Cuándo',
            placeholder: 'Cualquier momento',
            options: {
              all: 'Cualquier Momento',
              today: 'Hoy',
              tomorrow: 'Mañana',
              weekend: 'Fin de Semana',
              week: 'Esta Semana',
              month: 'Este Mes',
              monday: 'Lunes',
              tuesday: 'Martes',
              wednesday: 'Miércoles',
              thursday: 'Jueves',
              friday: 'Viernes',
              saturday: 'Sábados',
              sunday: 'Domingos'
            }
          },
          studio: {
            label: 'Ubicación del Studio',
            placeholder: 'Cualquier studio'
          },
          yogaStyle: {
            label: 'Estilo de Yoga',
            placeholder: 'Cualquier estilo'
          }
        },
        emptyState: {
          noUpcomingClasses: 'No hay próximas clases',
          noMatchingClasses: 'Ninguna clase coincide con tus filtros',
          noUpcomingDescription: 'Este profesor no tiene clases programadas en los próximos 3 meses.',
          noMatchingDescription: 'Intenta ajustar tus filtros para ver más clases.',
          clearAllFilters: 'Limpiar Todos los Filtros'
        }
      }
    }
  },
  seo: {
    home: {
      title: 'avara. - Plataforma Hermosa de Gestión de Horarios de Yoga',
      description: 'Conecta tu calendario y crea hermosos horarios compartibles para tus clases de yoga. Confiado por 500+ instructores de yoga en todo el mundo. Gratis para empezar.',
      keywords: 'horario de yoga, sincronización de calendario, gestión de clases, plataforma de instructores, profesor de yoga, compartir horarios, integración de calendario'
    },
    dashboard: {
      title: 'Panel de Control - Gestiona tu Horario de Yoga | avara.',
      description: 'Gestiona tus clases de yoga, feeds de calendario y comparte tu horario con estudiantes. Ve próximas clases, gestiona eventos y rastrea tu horario de enseñanza.',
      keywords: 'panel de yoga, gestión de clases, gestión de horarios, panel de instructores, gestión de calendario'
    },
    profile: {
      title: 'Configuración del Perfil - Personaliza tu Perfil de Yoga | avara.',
      description: 'Personaliza tu perfil público de instructor de yoga. Añade tu biografía, especialidades, información de contacto y crea una hermosa página para tus estudiantes.',
      keywords: 'perfil de yoga, perfil de instructor, perfil de profesor de yoga, perfil público, biografía de yoga'
    },
    addCalendar: {
      title: 'Agregar Calendario - Conecta tu Horario de Yoga | avara.',
      description: 'Conecta tu Google Calendar, iCloud o cualquier feed de calendario para sincronizar automáticamente tus clases de yoga. Configuración fácil en menos de 2 minutos.',
      keywords: 'sincronización de calendario, Google Calendar, sincronización iCloud, integración de calendario, calendario de yoga'
    },
    manageEvents: {
      title: 'Gestionar Eventos - Tus Clases de Yoga | avara.',
      description: 'Ve y gestiona todas tus clases de yoga y eventos. Edita detalles de clases, añade etiquetas y organiza tu horario de enseñanza.',
      keywords: 'eventos de yoga, gestión de clases, gestión de eventos, horario de yoga, organización de clases'
    },
    manageTags: {
      title: 'Gestionar Etiquetas - Organiza tus Clases de Yoga | avara.',
      description: 'Crea y gestiona etiquetas para tus clases de yoga. Categoriza clases automáticamente por tipo, nivel y ubicación.',
      keywords: 'etiquetas de yoga, categorías de clases, tipos de clases de yoga, organización de eventos, etiquetado de clases'
    },
    studios: {
      title: 'Studios - Tus Ubicaciones de Enseñanza | avara.',
      description: 'Gestiona tus relaciones con estudios de yoga y ubicaciones de enseñanza. Conéctate con estudios y rastrea tus oportunidades de enseñanza.',
      keywords: 'estudios de yoga, ubicaciones de enseñanza, gestión de estudios, red de profesores de yoga'
    },
    invoices: {
      title: 'Facturas - Gestión de Ingresos de Enseñanza de Yoga | avara.',
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
            title: 'Iniciar Sesión - Accede a tu Panel de Yoga | avara.',
    description: 'Inicia sesión en tu cuenta avara. para gestionar tu horario de yoga, feeds de calendario y compartir tus clases con estudiantes.',
        keywords: 'iniciar sesión, login, panel de yoga, login de instructor, acceso a cuenta'
      },
      signUp: {
            title: 'Crear Cuenta - Inicia tu Horario de Yoga | avara.',
    description: 'Crea tu cuenta gratuita de avara. y comienza a compartir tu horario de yoga con estudiantes. Conecta tu calendario y construye tu presencia online.',
        keywords: 'crear cuenta, registrarse, instructor de yoga, cuenta gratuita, compartir horarios'
      }
    },
    errors: {
      notFound: {
        title: 'Página No Encontrada - avara.',
        description: 'La página que buscas no pudo ser encontrada. Regresa a tu panel de horario de yoga o navega nuestra plataforma de instructores de yoga.',
        keywords: 'página no encontrada, 404, horario de yoga, plataforma de instructores'
      },
      serverError: {
        title: 'Error del Servidor - avara.',
        description: 'Estamos experimentando dificultades técnicas. Por favor intenta de nuevo más tarde o contacta soporte para asistencia con tu horario de yoga.',
        keywords: 'error del servidor, soporte técnico, soporte de plataforma de yoga'
      }
    }
  },
  landing: {
    hero: {
      betaBadge: 'Beta Cerrada',
      title: 'Hermosos horarios de yoga para profesores.',
      subtitle: 'Conecta tu calendario y crea páginas increíbles y compartibles para tus clases de yoga. Confiado por instructores de yoga en todo el mundo.',
      requestAccess: 'Solicitar Acceso Beta',
      seeExample: 'Ver Ejemplo',
      hasAccess: '¿Ya tienes acceso?',
      signInHere: 'Inicia sesión aquí'
    },
    features: {
      title: 'Todo lo que necesitas para compartir tu horario',
      subtitle: 'Optimiza tu flujo de trabajo de enseñanza con herramientas poderosas pero simples.',
      sync: {
        title: 'Sincronización de Calendario',
        description: 'Sincroniza automáticamente con Google Calendar, iCloud y otros servicios de calendario populares. Tu horario se mantiene actualizado sin trabajo manual.'
      },
      pages: {
        title: 'Páginas Hermosas',
        description: 'Crea páginas impresionantes y profesionales que muestren tus clases y faciliten a los estudiantes encontrar y reservar sesiones.'
      },
      sharing: {
        title: 'Compartir Fácil',
        description: 'Comparte tu horario a través de enlaces personalizados, exporta a varios formatos e integra con tu sitio web existente o redes sociales.'
      }
    },
    socialProof: {
      title: 'Confiado por profesores de yoga en todas partes',
      betaTesting: {
        value: 'Beta',
        description: 'Actualmente en pruebas'
      },
      realTime: {
        value: 'Tiempo real',
        description: 'Sincronización automática'
      },
      beautiful: {
        value: 'Hermoso',
        description: 'Diseño profesional'
      }
    },
    cta: {
      title: '¿Listo para transformar tu flujo de trabajo de enseñanza?',
      description: 'Únete a cientos de profesores de yoga que han simplificado la gestión de sus horarios con avara.',
      requestAccess: 'Solicitar Acceso Beta',
      signIn: 'Iniciar Sesión'
    },
    footer: {
      tagline: 'Hermosos horarios de yoga para profesores.',
      privacy: 'Privacidad',
      terms: 'Términos',
      support: 'Soporte',
      copyright: '© 2024 avara. Todos los derechos reservados.'
    }
  },
  privacy: {
    title: 'Política de Privacidad',
    description: 'Su privacidad es importante para nosotros. Esta política explica cómo recopilamos, usamos y protegemos su información personal.',
    lastUpdated: 'Última actualización: 1 de enero de 2024',
    sections: {
      responsible: {
        title: 'Controlador de Datos',
        description: 'La siguiente entidad es responsable del procesamiento de sus datos personales:'
      },
      dataCollection: {
        title: 'Recopilación de Datos',
        accountData: {
          title: 'Datos de Cuenta',
          email: 'Dirección de correo electrónico para inicio de sesión y comunicación',
          name: 'Nombre e información de perfil',
          url: 'URL personalizada para su página de horario público',
          profile: 'Foto de perfil y biografía',
          contact: 'Información de contacto (teléfono, sitio web, redes sociales)'
        },
        calendarData: {
          title: 'Datos de Calendario',
          classes: 'Información de clases de yoga de calendarios conectados',
          events: 'Títulos, descripciones y ubicaciones de eventos',
          times: 'Horarios de clases y zonas horarias',
          participants: 'Número de estudiantes (no datos personales de estudiantes)',
          tokens: 'Tokens de acceso al calendario (encriptados)'
        },
        automaticData: {
          title: 'Datos Automáticos',
          ip: 'Dirección IP e información del navegador',
          sync: 'Registros de sincronización de calendario e informes de errores',
          usage: 'Estadísticas de uso de la plataforma',
          logs: 'Registros de aplicación para depuración'
        },
        billingData: {
          title: 'Datos de Facturación',
          studios: 'Relaciones con estudios e información de pagos',
          classes: 'Registros de asistencia a clases y pagos',
          rates: 'Tarifas de enseñanza y datos de facturas'
        }
      },
      legalBasis: {
        title: 'Base Legal para el Procesamiento',
        contract: {
          title: 'Ejecución del Contrato',
          description: 'El procesamiento es necesario para proporcionar nuestros servicios de sincronización de calendario y gestión de horarios.'
        },
        consent: {
          title: 'Consentimiento',
          description: 'Para características opcionales como páginas de perfil público y comunicaciones de marketing.'
        },
        interest: {
          title: 'Interés Legítimo',
          description: 'Para seguridad de la plataforma, prevención de fraudes y mejoras del servicio.'
        }
      }
    },
    contact: {
      title: '¿Preguntas sobre Privacidad?',
      description: 'Si tiene preguntas sobre cómo manejamos sus datos o desea ejercer sus derechos de privacidad, por favor contáctenos.',
      button: 'Contáctanos'
    }
  },
  support: {
    title: 'Soporte y Ayuda',
    description: 'Estamos aquí para ayudarte a aprovechar al máximo la plataforma avara. Encuentra respuestas a preguntas comunes y ponte en contacto con nuestro equipo de soporte.',
    contact: {
      title: 'Contacto Directo',
      description: '¿Tienes una pregunta específica o necesitas asistencia personal? Típicamente respondemos dentro de 24 horas.',
      button: 'Contactar Soporte'
    },
    faq: {
      title: 'Preguntas Frecuentes',
      howToConnect: {
        question: '¿Cómo conecto mi calendario?',
        answer: 'Puedes conectar tu calendario a través de tres métodos: integración OAuth con Google Calendar, sistema de invitación por correo electrónico, o entrada manual de URL de feed .ics. El método más fácil es la integración OAuth en el panel de control.'
      },
      createPublicPage: {
        question: '¿Cómo creo mi página pública?',
        answer: 'Después de conectar tu calendario, puedes establecer tu URL pública y completar tu perfil en "Perfil". Tus clases aparecerán automáticamente en la página pública.'
      },
      supportedCalendars: {
        question: '¿Qué servicios de calendario son compatibles?',
        answer: 'Soportamos Google Calendar (completo), Outlook/Office 365, Apple iCloud Calendar, y cualquier servicio de calendario que proporcione feeds .ics.'
      },
      invoicing: {
        question: '¿Cómo funciona la generación de facturas?',
        answer: 'Puedes agregar estudios y hacer que tus clases se emparejen automáticamente. El sistema luego crea facturas PDF basadas en tus tarifas por hora y clases completadas.'
      },
      dataSecurity: {
        question: '¿Están seguros mis datos?',
        answer: 'Sí, todos los datos se almacenan de manera compatible con GDPR en la UE. Los tokens de acceso al calendario se almacenan encriptados y tienes control total sobre tus datos en todo momento.'
      }
    },
    categories: {
      calendar: {
        title: 'Integración de Calendario',
        description: 'Ayuda con la conexión y sincronización de tus calendarios'
      },
      profile: {
        title: 'Perfil y Configuración',
        description: 'Soporte con la configuración de tu perfil y página'
      },
      invoicing: {
        title: 'Facturas y Facturación',
        description: 'Ayuda con la creación de facturas y gestión de estudios'
      }
    },
    beta: {
      title: 'Información de Fase Beta',
      description: 'avara está actualmente en fase beta cerrada. Esto significa:',
      features: [
        'El uso es actualmente gratuito',
        'Se agregan nuevas características regularmente',
        'Tu retroalimentación nos ayuda a mejorar',
        'Proporcionamos soporte especialmente rápido para problemas'
      ],
      feedback: 'Como probador beta, tus experiencias y sugerencias son muy importantes para nosotros. ¡Por favor envíanos tu retroalimentación!'
    },
    technical: {
      title: 'Reportar Problemas Técnicos',
      description: 'Si encuentras problemas técnicos o errores, por favor ayúdanos con la siguiente información:',
      requirements: [
        'Descripción del problema',
        'Pasos para reproducir',
        'Navegador y sistema operativo usado',
        'Capturas de pantalla o mensajes de error (si están disponibles)'
      ],
      button: 'Reportar Problema'
    }
  },
  terms: {
    title: 'Términos y Condiciones',
    description: 'Estos términos de servicio rigen su uso de la plataforma avara para instructores de yoga.',
    lastUpdated: 'Última actualización: 1 de enero de 2024',
    sections: {
      provider: {
        title: 'Proveedor de Servicios y Alcance',
        provider: {
          title: 'Proveedor',
          description: 'La siguiente entidad proporciona la plataforma avara:'
        },
        scope: {
          title: 'Alcance',
          description: 'Estos Términos y Condiciones se aplican a todos los servicios de la plataforma avara. Al registrarse y usar nuestros servicios, usted acepta estos términos como vinculantes.'
        }
      },
      services: {
        title: 'Descripción del Servicio',
        platform: {
          title: 'Servicios de la Plataforma',
          description: 'avara proporciona una plataforma basada en web que ofrece a los instructores de yoga las siguientes características:',
          features: [
            'Sincronización de calendario con servicios de calendario externos',
            'Creación y gestión de páginas de clases públicas',
            'Categorización automática y gestión de etiquetas',
            'Creación de facturas y funciones de facturación',
            'Gestión de perfil y contacto',
            'Integración de estudios y gestión de ubicaciones'
          ]
        },
        beta: {
          title: 'Estado Beta',
          description: 'La plataforma está actualmente en fase beta cerrada. Las características pueden cambiar, y el acceso está limitado a usuarios seleccionados.'
        }
      },
      registration: {
        title: 'Registro y Cuenta de Usuario',
        requirements: {
          title: 'Requisitos',
          items: [
            'Edad mínima: 18 años',
            'Dirección de correo electrónico válida',
            'Actividad como instructor de yoga',
            'Consentimiento a estos Términos y Política de Privacidad'
          ]
        },
        security: {
          title: 'Seguridad de la Cuenta',
          description: 'Usted está obligado a mantener confidenciales sus credenciales de acceso y notificarnos inmediatamente de actividades sospechosas o violaciones de seguridad.'
        },
        termination: {
          title: 'Terminación de Cuenta',
          description: 'Puede eliminar su cuenta en cualquier momento. Nos reservamos el derecho de suspender o eliminar cuentas por violaciones de estos Términos.'
        }
      },
      obligations: {
        title: 'Obligaciones del Usuario y Prohibiciones',
        permitted: {
          title: 'Uso Permitido',
          items: [
            'Exclusivamente para sus propias clases y cursos de yoga',
            'Información veraz en perfil y descripciones de clases',
            'Uso respetuoso de la plataforma e interacción con otros usuarios',
            'Cumplimiento de todas las leyes aplicables'
          ]
        },
        prohibited: {
          title: 'Actividades Prohibidas',
          items: [
            'Subir contenido que viole derechos, sea ofensivo o dañino',
            'Violación de derechos de autor u otros derechos de terceros',
            'Spam, solicitudes automatizadas o abuso de servicios',
            'Ingeniería inversa o pruebas de seguridad sin permiso',
            'Uso comercial fuera del propósito previsto'
          ]
        }
      },
      content: {
        title: 'Contenido y Derechos de Autor',
        userContent: {
          title: 'Su Contenido',
          description: 'Usted retiene todos los derechos sobre el contenido que sube (textos, imágenes, datos de calendario). Nos otorga una licencia no exclusiva para mostrar y procesar este contenido para proporcionar nuestros servicios.'
        },
        ourContent: {
          title: 'Nuestro Contenido',
          description: 'Todos los textos, gráficos, software y otro contenido de la plataforma están protegidos por derechos de autor y no pueden ser copiados o usados sin nuestro consentimiento.'
        },
        violations: {
          title: 'Violaciones de Derechos',
          description: 'En caso de violaciones de derechos de autor u otras violaciones legales, eliminaremos el contenido relevante inmediatamente tras la notificación.'
        }
      },
      availability: {
        title: 'Disponibilidad y Requisitos Técnicos',
        uptime: {
          title: 'Disponibilidad',
          description: 'Nos esforzamos por alta disponibilidad de la plataforma pero no podemos garantizar 100% de tiempo de actividad. El trabajo de mantenimiento será anunciado cuando sea posible.'
        },
        requirements: {
          title: 'Requisitos Técnicos',
          items: [
            'Navegador web moderno con soporte JavaScript',
            'Conexión a internet estable',
            'Servicios de calendario compatibles (Google Calendar, Outlook, iCloud)'
          ]
        }
      },
      privacy: {
        title: 'Privacidad y Terceros',
        dataProcessing: {
          title: 'Privacidad',
          description: 'El procesamiento de sus datos personales se lleva a cabo de acuerdo con nuestra Política de Privacidad, que está diseñada para cumplir con GDPR.'
        },
        thirdParty: {
          title: 'Integración de Terceros',
          description: 'Al usar servicios de terceros (Google Calendar, etc.), también se aplican sus términos de servicio y políticas de privacidad.'
        }
      },
      liability: {
        title: 'Responsabilidad y Garantía',
        limitation: {
          title: 'Limitación de Responsabilidad',
          description: 'Nuestra responsabilidad está limitada a intención y negligencia grave. Por negligencia leve, solo somos responsables por el incumplimiento de obligaciones contractuales esenciales y solo hasta el monto del daño previsible y típico del contrato.'
        },
        excluded: {
          title: 'Responsabilidad Excluida',
          description: 'No somos responsables por pérdida de datos debido a factores externos, problemas con servicios de terceros, o daños por uso inadecuado de la plataforma.'
        },
        limitation_period: {
          title: 'Período de Limitación',
          description: 'Las reclamaciones contra nosotros prescriben dentro de un año del conocimiento del daño y nuestra persona.'
        }
      },
      termination: {
        title: 'Duración del Contrato y Terminación',
        duration: {
          title: 'Duración',
          description: 'El contrato de uso corre por tiempo indefinido y puede ser terminado por cualquiera de las partes en cualquier momento sin aviso.'
        },
        extraordinary: {
          title: 'Terminación Extraordinaria',
          description: 'Podemos terminar el contrato sin aviso por violaciones graves de estos Términos, abuso de la plataforma, o actividades ilegales.'
        },
        consequences: {
          title: 'Consecuencias de la Terminación',
          description: 'Después de la terminación del contrato, sus datos serán eliminados de acuerdo con nuestra Política de Privacidad. Las páginas de clases públicas serán desactivadas.'
        }
      },
      pricing: {
        title: 'Precios y Términos de Pago',
        current: {
          title: 'Estructura de Precios Actual',
          description: 'Durante la fase beta, el uso de la plataforma es gratuito. Los cambios de precios futuros serán comunicados con anticipación.'
        },
        changes: {
          title: 'Cambios de Precios',
          description: 'Los cambios de precios serán anunciados al menos 30 días con anticipación. Tiene derecho a terminar extraordinariamente en caso de aumentos significativos de precios.'
        }
      },
      final: {
        title: 'Disposiciones Finales',
        law: {
          title: 'Ley Aplicable',
          description: 'Se aplica la ley de la República Federal de Alemania, excluyendo la Convención de las Naciones Unidas sobre Contratos para la Venta Internacional de Mercaderías.'
        },
        jurisdiction: {
          title: 'Jurisdicción',
          description: 'El lugar de jurisdicción para todas las disputas es nuestra ubicación comercial, siempre que usted sea un comerciante, entidad legal bajo ley pública, o fondo especial bajo ley pública.'
        },
        dispute: {
          title: 'Resolución de Disputas',
          description: 'Para disputas de consumidores, puede contactar a la Junta General de Arbitraje de Consumidores. No estamos obligados a participar en procedimientos de resolución de disputas, pero estamos dispuestos a hacerlo.'
        },
        severability: {
          title: 'Cláusula de Separabilidad',
          description: 'Si las disposiciones individuales de estos Términos son inválidas, la validez de las disposiciones restantes permanece sin afectar.'
        },
        changes: {
          title: 'Cambios a los Términos',
          description: 'Los cambios a estos Términos le serán comunicados al menos 30 días antes de que entren en vigencia por correo electrónico. Si no objeta dentro de 30 días, los cambios se consideran aceptados.'
        }
      }
    },
    contact: {
      title: '¿Preguntas sobre los Términos?',
      description: 'Si tiene preguntas sobre estos términos de servicio o aspectos legales de la plataforma, estaremos encantados de ayudarle.',
      button: 'Contáctanos'
    }
  },
  tags: {
    management: {
      unnamedTag: 'Etiqueta Sin Nombre',
      maxReached: 'Máximo alcanzado',
      showOnPublicPage: 'Mostrar en página pública',
      selectTags: 'Seleccionar Etiquetas (máx {count})',
      selectTagsPlaceholder: 'Seleccionar etiquetas...',
      maxTagsSelected: 'Máximo {count} etiquetas seleccionadas',
      maxTagsAllowed: 'Máximo de {count} etiquetas permitidas. Remover una etiqueta para seleccionar otra.'
    }
  }
}

export default translations 