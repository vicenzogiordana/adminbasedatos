# Informe IEEE - Sistema RAG con Qdrant y Ollama

Este directorio contiene el informe en formato LaTeX listo para compilar en [Overleaf](https://overleaf.com).

## Estructura de Archivos

```
informe/
├── main.tex         # Documento principal
├── references.bib   # Bibliografía
└── README.md        # Este archivo
```

## Cómo usar en Overleaf

1. Crear nuevo proyecto en Overleaf
2. Subir `main.tex` como archivo principal
3. Subir `references.bib` en la misma carpeta
4. Compilar (Ctrl+Shift+L o botón de Compile)

## Secciones del Informe

1. **Introducción** - Contexto y motivación
2. **Marco Teórico** - Conceptos de bases de datos vectoriales y RAG
3. **Arquitectura de Qdrant** - Estructura general del sistema
4. **Algoritmo HNSW** - Indexación vectorial detallada
5. **Write-Ahead Log (WAL)** - Durabilidad de transacciones
6. **Segmentos y mmap** - Almacenamiento y memory mapping
7. **Concurrencia y Filtrado** - Operaciones paralelas y payload filtering
8. **Implementación del Sistema RAG** - Stack tecnológico y código
9. **Resultados** - Métricas y análisis
10. **Conclusiones** - Resumen y trabajo futuro

## Requisitos para compilar

- LaTeX (TeX Live, MiKTeX, etc.) o Overleaf
- Paquetes: IEEEtran, babel (spanish), graphicx, hyperref, amsmath, listings

## Preview Local

Para compilar localmente:

```bash
pdflatex main.tex
bibtex main
pdflatex main.tex
pdflatex main.tex
```

## Autor

- **Vicenzo Giordano**
- Universidad - Administración de Bases de Datos

## Fecha

Junio 2026