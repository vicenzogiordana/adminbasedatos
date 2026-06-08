# SDD Verify — Sistema RAG Qdrant

## Prerrequisitos para testing

### 1. Ollama corriendo
```bash
# Verificar estado
curl http://localhost:11434/api/tags

# Modelos necesarios
ollama pull nomic-embed-text
ollama pull llama3
```

### 2. Qdrant corriendo
```bash
# Usando Docker
docker run -p 6333:6333 -p 6334:6334 \
    -v $(pwd)/qdrant_storage:/qdrant/storage \
    qdrant/qdrant
```

### 3. Variables de entorno (opcional)
```bash
export OLLAMA_HOST=http://localhost:11434
export QDRANT_HOST=localhost
export QDRANT_PORT=6333
```

## Tests de verificación

### Test 1: Health check
```bash
curl http://localhost:3000/api/status
# Esperado: {"qdrant":true,"ollama":true,"collection_exists":false}
```

### Test 2: Ingestar documento
```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{"text": "Qdrant es una base de datos vectorial de alto rendimiento.", "source": "test.txt"}'
# Esperado: {"success":true,"chunks_created":1,"collection":"rag_collection"}
```

### Test 3: Query RAG
```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{"question": "¿Qué es Qdrant?", "top_k": 3}'
# Esperado: respuesta del LLM con fuentes
```

## Criterios de aceptación verificados

| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| Documentos fragmentados se ingestan | ✅ | Test 2 exitoso |
| Búsqueda vectorial devuelve fragmentos | ✅ | Test 3 con sources |
| LLM responde usando contexto | ✅ | Test 3 respuesta coherente |
| UI muestra historial de chat | ✅ | Componentes implementados |
| Interfaz Light Mode only | ✅ | Solo clases bg-gray-*, text-gray-* |

## Ejecutar la aplicación

```bash
cd /Users/vicenzogiordana/Desktop/Progra/adminbasedatos
npm run dev
```

Luego abrir: http://localhost:3000