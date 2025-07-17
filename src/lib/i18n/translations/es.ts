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
      billingProfilesTitle: 'Perfiles de Facturación',
      billingProfilesDesc: 'Configurar información de facturación para estudios y profesores',
      pdfCustomizationTitle: 'Personalización de Plantilla PDF',
      pdfCustomizationDesc: 'Personalice la apariencia de sus PDFs de factura con logos, colores y opciones de diseño',
      currentTheme: 'Tema Actual:',
      customConfiguration: 'Configuración de plantilla personalizada activa',
      defaultConfiguration: 'Usando configuración de plantilla predeterminada'
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
        pendingChangesInfo: '{count} cambio{plural} sin guardar',
        pendingChangesAction: 'Usa los botones de acción flotantes para guardar o descartar',
        createNewTag: 'Crear Nueva Etiqueta',
        refresh: 'Actualizar',
        quickActions: 'Acciones Rápidas (~1-3s)',
        syncing: 'Sincronizando...',
        fullCalendarSync: 'Sincronización Completa del Calendario',
        syncDescription: 'Reparar etiquetas de eventos o descargar datos frescos del calendario (~15-30s para sincronizar)',
        availableTags: 'Etiquetas Disponibles:'
      },
      emptyState: {
        noEvents: 'No se encontraron eventos',
        noEventsFiltered: 'Ningún evento coincide con tus filtros',
        connectCalendar: 'Conecta tus feeds de calendario para comenzar a importar eventos.',
        changeFiltersPublicPrivate: 'Intenta cambiar tus filtros para ver eventos {visibility} o eventos pasados.',
        changeFiltersTime: 'Intenta cambiar el filtro de tiempo para ver todos los eventos incluyendo los pasados.',
        changeFiltersVisibility: 'Intenta cambiar el filtro de visibilidad para ver todos los eventos.',
        addCalendarFeed: 'Agregar Feed de Calendario',
        showAllVisibility: 'Mostrar Toda la Visibilidad',
        showAllTime: 'Mostrar Todo el Tiempo'
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