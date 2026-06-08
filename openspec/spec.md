# SDD Spec — Sistema RAG Qdrant

## 1. Especificaciones funcionales

### 1.1 Ingesta de documentos
- **Entrada:** Archivos de texto (.txt, .md) o raw text
- **Fragmentación:** Chunking con `tokenizer` (chunk_size: 512 tokens, overlap: 50)
- **Embeddings:** Ollama API → `http://localhost:11434/api/embeddings` con modelo `nomic-embed-text`
- **Colección Qdrant:** `rag_collection` (dimensión: 768, métrica: Cosine)
- **Payload:** Almacenar `{ "text": "...", "source": "...", "chunk_id": N }`

### 1.2 Consulta RAG
- **Entrada:** Pregunta en lenguaje natural
- **Embedding:** Misma pipeline de Ollama
- **Búsqueda:** `POST /collections/rag_collection/points/search`
  - `limit`: 5 fragmentos más similares
  - `score_threshold`: 0.7
- **Contexto:** Concatenar top-k chunks como contexto
- **LLM:** Ollama → `http://localhost:11434/api/generate` con modelo `llama3`
- **Prompt:** Template RAG estándar con system prompt + contexto + pregunta

### 1.3 UI de Chat
- **Framework:** Next.js 14+ (App Router)
- **Estilos:** Tailwind CSS, **Light Mode únicamente**
- **Componentes:**
  - `ChatInput`: Input de texto con botón enviar
  - `ChatMessage`: Rendering de mensajes (user/assistant)
  - `ChatHistory`: Lista de mensajes con scroll
  - `DocumentUploader`: Upload de archivos para ingestión

## 2. Especificaciones de API

### 2.1 Endpoints
| Método | Path | Descripción |
|--------|------|-------------|
| POST | `/api/ingest` | Ingestar documento fragmentado |
| POST | `/api/query` | Consulta RAG |
| GET | `/api/status` | Estado de Ollama y Qdrant |

### 2.2 Tipos TypeScript
```typescript
interface Chunk {
  text: string;
  source: string;
  chunk_id: number;
}

interface QueryRequest {
  question: string;
  top_k?: number;
}

interface QueryResponse {
  answer: string;
  sources: Chunk[];
}

interface IngestRequest {
  text: string;
  source: string;
}
```

## 3. Especificaciones de Qdrant

### 3.1 Estructura de colección
```json
{
  "name": "rag_collection",
  "vector_size": 768,
  "distance": "Cosine",
  "hnsw_config": {
    "m": 16,
    "ef_construct": 100
  },
  "wal_config": {
    "wal_capacity_mb": 32
  }
}
```

### 3.2 Puntos almacenados
```json
{
  "id": "uuid-v4",
  "vector": [0.1, 0.2, ...],
  "payload": {
    "text": "fragmento original",
    "source": "nombre_archivo.txt",
    "chunk_id": 0
  }
}
```

## 4. Criterios de aceptación

- [ ] Documentos fragmentados se ingieren correctamente en Qdrant
- [ ] Búsqueda vectorial devuelve fragmentos relevantes (test con query conocida)
- [ ] LLM responde usando contexto recuperado
- [ ] UI muestra historial de chat funcional
- [ ] Interfaz usa exclusivamente Light Mode
- [ ] Informe IEEE incluye secciones: HNSW, WAL, Segmentos, Concurrencia