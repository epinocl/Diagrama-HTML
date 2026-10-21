# Lista de Verificación para Producción (Production Checklist)

**Documento:** CHK-01  
**Proyecto:** Diagrama-HTML (AXON CAD Web)  
**Versión:** 1.0.0  
**Fecha:** 2026-10-21  
**Estándar:** Davichuder / GAMP 5 / ALCOA+

---

Este checklist debe ser completado y firmado antes de promover cualquier entrega, emisión documental o versión de la plataforma a producción.

## 1. Integridad Documental y Calidad Gráfica (ALCOA+)
- [ ] **Contraste de Modo Impresión**: Se verificó que en fondo blanco ningún texto quede en color blanco (`#ffffff`) ni ilegible.
- [ ] **Logo Oficial AXON**: El isotipo bicolor oficial de AXON (`#2828ff` azul y `#f66c1e` naranja) se visualiza nítido y sin distorsión vectorial en portada y cajetines.
- [ ] **Datos de Portada y Cajetín**: Se completaron los casilleros obligatorios: Código de Proyecto, Cliente, Nombre de Máquina/Planta, Fecha ISO (`AAAA-MM-DD`), Dibujado, Revisado, Aprobado y Número de Lámina (`NN de TT`).
- [ ] **Norma de Simbología**: Todos los símbolos incorporados corresponden al estándar IEC 60617 o EPLAN.
- [ ] **Impresión en Lote A3**: Se verificó que al presionar `Ctrl + P` el navegador genere exactamente el número de láminas del proyecto en formato A3 Horizontal sin páginas en blanco intermedias o al final.

## 2. Compatibilidad y Exportación CAD
- [ ] **Escala Métrica 1:1 DXF**: Al abrir el archivo DXF exportado en AutoCAD o AutoCAD Electrical, las dimensiones del marco corresponden exactamente a 420 x 297 mm sin factor de reducción.
- [ ] **Capas y Colores ACI**: Las entidades exportadas al DXF respetan las capas estándar (`CAD_TEXT`, `CAD_LINES`, `CAD_COMP`, `CAD_WIRES`) con colores ACI legibles.

## 3. Seguridad y Control de Código
- [ ] **Cero Secretos**: No existen claves de API, tokens de GitHub, contraseñas o datos confidenciales en el repositorio.
- [ ] **Archivo `.gitignore` Activo**: Se verificó que carpetas de dependencias (`node_modules/`, `venv/`), archivos temporales y cachés de agentes de IA no se sincronicen con Git.
- [ ] **Sanitización de SVG**: No existen scripts maliciosos embebidos en atributos `onload`, `onclick` ni etiquetas `<script>` en los SVGs externos recibidos.

## 4. Rendimiento y Experiencia de Usuario
- [ ] **Tiempo de Respuesta**: El cambio de lámina y el zoom/pan responden de forma instantánea sin retraso perceptible.
- [ ] **Fugas de Memoria (Memory Leaks)**: Al navegar repetidamente entre láminas y activar/desactivar modos de edición, el consumo de memoria RAM del navegador se mantiene estable.
- [ ] **Caché Invalidad**: Todas las hojas de estilo y scripts cuentan con cache-busters actualizados (`?v=X.X`) para evitar problemas de caché en estaciones cliente.

## 5. Servidor Ubuntu y Despliegue (Fases 3 a 5)
- [ ] **Reverse Proxy Nginx**: Configuración validada con `nginx -t` y certificados SSL activos para la intranet.
- [ ] **Supervisor de Procesos**: El servicio de backend se encuentra registrado y activo bajo PM2 o systemd con política de reinicio automático (`restart: always`).
- [ ] **Respaldos de Datos**: Copias de seguridad automáticas programadas para la carpeta de proyectos `/opt/axon/proyectos/`.
