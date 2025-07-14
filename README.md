# 🔐 Extensión de Gestión de Identidad y Firmas Digitales  

Esta extensión actúa como un **gestor seguro de llaves privadas**, permitiendo a los usuarios **firmar, autenticar, cifrar y automatizar procesos** tanto en el mundo Web2 como Web3.  

Está diseñada para ser **compatible con estándares abiertos** como **EIP-6963**, **ERC-4337** y **EIP-7702**, permitiendo integraciones avanzadas con aplicaciones externas y flujos de trabajo automatizados.  

## ✨ Características principales  

✅ **Gestor de llaves privadas**  
- Soporta llaves **RSA** (para firma electrónica oficial eFirma)  
- Soporta llaves **ECDSA** (para Ethereum, EVMs y Bitcoin)  
- Almacenamiento seguro y aislado en la extensión  

✅ **Firmas y cifrado con llaves privadas**  
- Firmas electrónicas de documentos con RSA  
- Firmas de transacciones EVM y Bitcoin con ECDSA  
- Encriptación y desencriptación de datos sensibles  

✅ **Compatibilidad con estándares de conexión**  
- Implementa **EIP-6963** para conectarse con **companion apps** (DApps, servicios web, aplicaciones móviles)  
- Permite a aplicaciones externas solicitar:  
  - KYC  
  - Firmas de documentos  
  - Firma y envío de transacciones  

✅ **Gestión multicuenta**  
- Cuentas **CLABE** para transferencias bancarias tradicionales  
- Cuentas **EVM Blockchain** (Ethereum, Optimism, Base, etc.)  
- Cuentas **Bitcoin Blockchain**  
- Abstracción del gas en EVMs usando **MXNB Token**  

✅ **Smart Accounts EVM con automatización avanzada**  
- Basadas en **EIP-7702** y **ERC-4337**  
- Compatibles con **plugins de automatización de calldata** para:  
  - Pagos de servicios y suscripciones  
  - Pago de nómina  
  - Estrategias de inversión (DCA, reclamo de rendimientos, etc.)  
  - Procesos automatizados personalizados  

✅ **Experiencia de usuario simplificada**  
- Abstracción de complejidades blockchain  
- Seguridad de alto nivel  
- Flujo de aprobación claro y auditable para cualquier solicitud  

---
# weywallet

## 🚀 Steps to Deploy  

1. **Instala las dependencias**  
   Asegúrate de tener Deno correctamente configurado en tu máquina.  

2. **Genera la build de la extensión**  
   Ejecuta la tarea de build definida en el proyecto para generar la carpeta `dist/` optimizada.  

   ```bash
   deno task build
   ```

3. **Carga la extensión en Chrome**  
   - Abre la página de gestión de extensiones en tu navegador (`chrome://extensions/`)  
   - Activa el Modo Desarrollador  
   - Selecciona la opción para cargar extensiones sin empaquetar  
   - Elige la carpeta `dist/` generada en el paso anterior  

4. **Prueba la extensión**  
   - Verifica que el popup y el sidepanel funcionen correctamente  
   - Comprueba que la conexión con DApps y las solicitudes de firma operen de forma segura  

Cuando esté lista para producción, puedes empaquetar la carpeta `dist/` y subirla a la Chrome Web Store.  
