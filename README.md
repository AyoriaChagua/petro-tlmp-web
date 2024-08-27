# PETRO WEB - TLMP

Sistema para Petroamerica, desarrollado con el fin de agilizar y optimizar las actividades entre distintas áreas como tesoreria y mesa de partes.

## Características principales

- Diseño responsive
- Interfaces amigables
- Seguridad con JWT

## Tecnologías utilizadas

- TypeScript
- React.js
- TailwindCSS
- Axios
- Jwt
- ExcelJS
- CSS3

## Estructura del proyecto
```shell
petro-tlmp-web/
│
├── src/
│   ├── api/
│   │   ├── provider-mp/
│   │   │   ├── delete.ts
│   │   │   ├── get.ts
│   │   │   ├── post.ts
│   │   │   └── put.ts
│   │   ├── auth/
│   │   ├── cia/
│   │   ├── user/
│   │   ├── cost-center/
│   │   ├── sunat-document-type/
│   │   ├── correlative-control/
│   │   ├── requesting-area/
│   │   └── config.ts
│   │   
│   ├── hooks/
│   │   ├── intial-states/
│   │   ├── useApprovalPersonnel.tsx
│   │   ├── useCorrelativeControl.tsx
│   │   ├── useProfile.tsx
│   │   ├── useDebounce.tsx
│   │   ├── useRequestingArea.tsx
│   │   ├── useSunatDocument.tsx
│   │   ├── useUser.tsx
│   │   ├── useCostCenter.tsx
│   │   └── useLogin.tsx
│   │ 
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── CorrelativeContext.tsx
│   │ 
│   ├── components/
│   │   ├── common/
│   │   ├── layouts/
│   │   ├── UI/
│   │   └── index.tsx
│   │
│   ├── pages/
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── Maintanance/
│   │   │   ├── ApprovingPersonnel/
│   │   │   ├── CorrelativeControl/
│   │   │   ├── CostCenter/
│   │   │   ├── Provider/
│   │   │   ├── RequestingArea/
│   │   │   ├── SunatDocuments/
│   │   │   └── Users/
│   │   ├── NotFount/
│   │   ├── Order/
│   │   ├── Profile/
│   │   ├── Reports/
│   │   │   ├── OrderDocument/
│   │   │   ├── PettyCash/
│   │   │   └── Purchasing/
│   │   └── index.tsx
│   │
│   ├── utils/
│   │   ├── constants.ts/
│   │   └── functions.js
│   │
│   └── App.tsx
│
├── public/
│   └── img/
│
├── node_modules/
│
├── package.json
├── package-lock.json
└── README.md
```

### Descripción de Directorios y Archivos


- **/src/**: Directorio principal que contiene el código fuente de la aplicación.
  - **/components/**: Componentes reutilizables de la aplicación (aplicable a proyectos de React u otros frameworks).
  - **/hooks/**: Custom hooks para cada modulo funcional.
  - **/context/**: Información que se va necesitar en el resto de los componentes.
  - **/utils/**: Funciones auxiliares y utilidades que son utilizadas en diferentes partes de la aplicación.
  - **App.tsx**: Componente principal que estructura la aplicación.
  - **main.tsx**: Punto de entrada de la aplicación.
- **/public/**: Archivos estáticos que se servirán al cliente, como HTML, imágenes e íconos.
- **package.json**: Archivo que maneja las dependencias del proyecto, scripts y metadatos.
- **README.md**: Archivo de documentación que proporciona una visión general del proyecto, cómo configurarlo y cómo contribuir.
- **.gitignore**: Archivo que especifica qué archivos o directorios deben ser ignorados por Git.

---
