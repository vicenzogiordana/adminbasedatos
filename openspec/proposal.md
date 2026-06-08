# SDD Proposal — Sistema RAG Qdrant

## Decisión principal
Construir un sistema RAG completo con:
- **Ingesta:** Fragmentación de documentos → embeddings Ollama → storage en Qdrant
- **Consulta:** Pregunta → embedding → búsqueda vectorial → contexto → LLM → respuesta

## Scope aprobado
| Componente | Incluido | Justificación |
|-----------|----------|---------------|
| Next.js app skeleton | ✅ | Base técnica requerida |
| Script de ingestión | ✅ | Core functionality |
| API de búsqueda | ✅ | Endpoint RAG |
| UI de chat | ✅ | Demo visual |
| Informe IEEE/LaTeX | ✅ | Entrega académica |
| Tests automatizados | ❌ | Tiempo insuficiente |
| Auth/multi-user | ❌ | Out of scope |

## Arquitectura de alto nivel
```
[Documento] → [Fragmentador] → [Ollama: nomic-embed-text] → [Qdrant: vector + payload]
                                                                      ↓
[Usuario] → [UI Chat] → [API /api/query] → [Ollama: búsqueda] → [Contexto] → [LLM] → [Respuesta]
```

## Riesgos identificados
1. **Ollama no disponible:** Verificar que el servicio esté corriendo antes de iniciar
2. **Modelo nomic-embed-text no descargado:** Pre-download en setup
3. **Scope creep en informe:** Limitar a 4 secciones técnicas de Qdrant

## Siguiente
→ `spec.md` con especificaciones detalladas