import JSZip from 'jszip';
import { ProjectDocument, PackageMetadata } from './types';

export interface UnpackedPackage {
  project: ProjectDocument;
  metadata: PackageMetadata;
  sketches: Record<string, string>; // filename -> blob URL
}

/**
 * Empaqueta un proyecto completo en un contenedor portable .axon.zip
 */
export async function exportProjectToZip(
  project: ProjectDocument,
  customMetadata?: Partial<PackageMetadata>,
  sketchBlobs?: Record<string, Blob | Uint8Array>
): Promise<Blob> {
  const zip = new JSZip();

  // 1. Guardar project.json estructurado
  const projectJsonStr = JSON.stringify(project, null, 2);
  zip.file('project.json', projectJsonStr);

  // 2. Guardar metadata.json para trazabilidad ALCOA+
  const metadata: PackageMetadata = {
    projectCode: project.projectCode,
    version: 'Rev. 1.0',
    createdAt: new Date().toISOString(),
    createdBy: 'AXON CAD Web Engine / Usuario',
    gampCategory: 4,
    bocetos: [],
    ...customMetadata
  };

  // 3. Empaquetar bocetos de terreno si existen
  if (sketchBlobs && Object.keys(sketchBlobs).length > 0) {
    const bocetosFolder = zip.folder('bocetos');
    if (bocetosFolder) {
      for (const [filename, data] of Object.entries(sketchBlobs)) {
        bocetosFolder.file(filename, data);
        metadata.bocetos.push({ filename: `bocetos/${filename}` });
      }
    }
  }

  zip.file('metadata.json', JSON.stringify(metadata, null, 2));

  // Generar archivo comprimido .zip / .axon.zip
  return await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });
}

/**
 * Desempaqueta y valida un archivo .axon.zip o .zip en memoria
 */
export async function importProjectFromZip(file: File | Blob): Promise<UnpackedPackage> {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(file);

  // 1. Leer y validar project.json obligatorio
  const projectFile = loadedZip.file('project.json');
  if (!projectFile) {
    throw new Error('El archivo ZIP no contiene un "project.json" válido de AXON CAD.');
  }

  const projectText = await projectFile.async('text');
  const project: ProjectDocument = JSON.parse(projectText);

  if (!project.projectCode || !Array.isArray(project.sheets)) {
    throw new Error('Estructura de project.json inválida: faltan campos obligatorios.');
  }

  // 2. Leer metadata.json si existe
  let metadata: PackageMetadata = {
    projectCode: project.projectCode,
    version: 'Rev. 1.0',
    createdAt: new Date().toISOString(),
    createdBy: 'Importado',
    gampCategory: 4,
    bocetos: []
  };

  const metaFile = loadedZip.file('metadata.json');
  if (metaFile) {
    try {
      const metaText = await metaFile.async('text');
      metadata = JSON.parse(metaText);
    } catch (e) {
      console.warn('No se pudo parsear metadata.json, usando valores por defecto.', e);
    }
  }

  // 3. Extraer bocetos si existen
  const sketches: Record<string, string> = {};
  const bocetosFolder = loadedZip.folder('bocetos');
  if (bocetosFolder) {
    const fileNames = Object.keys(loadedZip.files).filter(name => 
      name.startsWith('bocetos/') && !name.endsWith('/')
    );

    for (const name of fileNames) {
      const fileEntry = loadedZip.file(name);
      if (fileEntry) {
        const blob = await fileEntry.async('blob');
        const url = URL.createObjectURL(blob);
        const simpleName = name.replace('bocetos/', '');
        sketches[simpleName] = url;
      }
    }
  }

  return { project, metadata, sketches };
}

/**
 * Dispara la descarga de un Blob en el navegador
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
