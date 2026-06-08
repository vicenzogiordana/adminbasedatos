# SDD Design — Sistema RAG Qdrant

## 1. Arquitectura del sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js App Router                        │
├─────────────────────────────────────────────────────────────────┤
│  /app/page.tsx          │  /app/api/ingest/route.ts             │
│  (Chat UI)              │  (Ingest endpoint)                    │
│                         │  /app/api/query/route.ts              │
│                         │  (RAG query endpoint)                 │
│                         │  /app/api/status/route.ts            │
├─────────────────────────────────────────────────────────────────┤
│                     /lib/qdrant.ts                              │
│                     (Qdrant client wrapper)                     │
│                     /lib/ollama.ts                              │
│                     (Ollama API wrapper)                        │
│                     /lib/chunker.ts                            │
│                     (Text fragmentation)                       │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
    ┌──────────┐       ┌────────────┐      ┌──────────┐
    │ Qdrant   │       │  Ollama    │      │  Ollama  │
    │ :6333    │       │ :11434     │      │ :11434   │
    │ (vectores)│       │ (embed)    │      │ (llm)    │
    └──────────┘       └────────────┘      └──────────┘
```

## 2. Estructura de archivos del proyecto
```
adminbasedatos/
├── openspec/                    # SDD artifacts
│   ├── config.yaml
│   ├── init.md
│   ├── proposal.md
│   ├── spec.md
│   ├── design.md
│   ├── tasks.md
│   └── verify.md
├── src/
│   ├── app/
│   │   ├── page.tsx            # Chat UI principal
│   │   ├── layout.tsx          # Root layout (Light Mode)
│   │   └── api/
│   │       ├── ingest/
│   │       │   └── route.ts    # POST /api/ingest
│   │       ├── query/
│   │       │   └── route.ts    # POST /api/query
│   │       └── status/
│   │           └── route.ts    # GET /api/status
│   ├── components/
│   │   ├── ChatInput.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── ChatHistory.tsx
│   │   └── DocumentUploader.tsx
│   ├── lib/
│   │   ├── qdrant.ts           # Qdrant client
│   │   ├── ollama.ts           # Ollama API
│   │   └── chunker.ts          # Text chunking
│   └── types/
│       └── index.ts            # Shared types
├── public/
│   └── sample-doc.txt          # Documento de prueba
├── package.json
├── tailwind.config.ts
└── next.config.js
```

## 3. Flujo de datos detallado

### 3.1 Ingesta
```
1. Upload documento → raw text
2. chunker.chunk(text, { size: 512, overlap: 50 })
3. Para cada chunk:
   a. ollama.embed(chunk.text) → vector[768]
   b. qdrant.upsert(collection, { id, vector, payload })
4. Retornar { chunks_created, collection }
```

### 3.2 Consulta RAG
```
1. user question → API
2. ollama.embed(question) → query_vector
3. qdrant.search(collection, query_vector, { k: 5, threshold: 0.7 })
4. Concatenar payloads.text como contexto
5. Prompt = system + contexto + question
6. ollama.generate(prompt) → answer
7. Retornar { answer, sources }
```

## 4. Detalles de implementación

### 4.1 Qdrant Client (`/lib/qdrant.ts`)
```typescript
import { QdrantClient } from '@qdrant/js-client-rest';

const client = new QdrantClient({ host: 'localhost', port: 6333 });

export async function initCollection() {
  const collections = await client.getCollections();
  if (!collections.collections.find(c => c.name === 'rag_collection')) {
    await client.createCollection('rag_collection', {
      vectors: { size: 768, distance: 'Cosine' },
      hnsw_config: { m: 16, ef_construct: 100 }
    });
  }
}
```

### 4.2 Ollama Client (`/lib/ollama.ts`)
```typescript
const OLLAMA_URL = 'http://localhost:11434';

export async function embed(text: string): Promise<number[]> {
  const res = await fetch(`${OLLAMA_URL}/api/embeddings`, {
    method: 'POST',
    body: JSON.stringify({ model: 'nomic-embed-text', prompt: text })
  });
  return (await res.json()).embedding;
}

export async function generate(prompt: string): Promise<string> {
  const res = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    body: JSON.stringify({ model: 'llama3', prompt, stream: false })
  });
  return (await res.json()).response;
}
```

### 4.3 Chunking (`/lib/chunker.ts`)
```typescript
export function chunkText(text: string, chunkSize = 512, overlap = 50): string[] {
  // Token-based chunking approximation (4 chars ≈ 1 token)
  const tokensPerChunk = chunkSize;
  const charsPerToken = 4;
  const step = (tokensPerChunk - overlap) * charsPerToken;
  const chunks: string[] = [];
  
  for (let i = 0; i < text.length; i += step) {
    chunks.push(text.slice(i, i + chunkSize * charsPerToken).trim());
  }
  return chunks;
}
```

## 5. UI Light Mode (Tailwind)

```tsx
// Componente base con paleta Light Mode
<div className="bg-gray-50 text-gray-900 min-h-screen">
  <main className="max-w-3xl mx-auto p-6">
    {/* Chat container */}
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Messages */}
      <div className="p-4 space-y-4">
        <div className="bg-blue-50 text-blue-900 rounded-lg p-3">
          {/* User message */}
        </div>
        <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
          {/* Assistant message */}
        </div>
      </div>
    </div>
  </main>
</div>
```

**Constraint enforced:** Solo clases `bg-gray-*`, `text-gray-*`, `border-gray-*` — ningún `dark:` prefix.