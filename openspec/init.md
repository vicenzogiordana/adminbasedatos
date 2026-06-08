# SDD Init — adminbasedatos

## Proyecto
**Nombre:** Sistema RAG con Qdrant y Ollama  
**Tipo:** Trabajo Práctico Integrador — Administración de Bases de Datos  
**DBMS:** Qdrant (base de datos vectorial)  
**Fecha límite:** 2026-06-11 (4 días)

## Objetivo
Desarrollar un sistema RAG (Retrieval-Augmented Generation) local que:
1. Ingeste documentos fragmentados con embeddings generados por Ollama (nomic-embed-text)
2. Almacene vectores + payload en Qdrant
3. Realice búsquedas semánticas por similitud coseno
4. Responda consultas usando LLM local (Llama 3/Qwen)

## Tech Stack
- **Frontend/Backend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Integración IA:** Ollama (embeddings + LLM locales)
- **DBMS:** Qdrant via `@qdrant/js-client-rest`
- **UI Constraint:** Light Mode exclusivo (sin Dark Mode)

## Entregables
1. **Demo funcional:** Interfaz web de chat con RAG
2. **Informe escrito:** Estilo IEEE/LaTeX (Overleaf-ready)
   - Arquitectura interna de Qdrant
   - Indexación HNSW
   - WAL y durabilidad
   - Control de concurrencia y filtrado de payloads

## Constraints
- Scope: < 400 líneas de diff final
- Modo Auto: fases ejecutadas en secuencia sin pausas
- Artifact store: OpenSpec en repositorio