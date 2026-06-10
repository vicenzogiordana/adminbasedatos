#!/usr/bin/env python3
"""Generar diagramas para el informe IEEE de Qdrant"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Rectangle
import numpy as np

# Estilo general
plt.style.use('seaborn-v0_8-whitegrid')
plt.rcParams['font.family'] = 'DejaVu Sans'
plt.rcParams['font.size'] = 10
plt.rcParams['axes.titlesize'] = 12
plt.rcParams['axes.labelsize'] = 10

def crear_arquitectura():
    """Diagrama de arquitectura de Qdrant"""
    fig, ax = plt.subplots(1, 1, figsize=(10, 7))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 7)
    ax.axis('off')
    
    # Título
    ax.text(5, 6.5, 'Arquitectura de Qdrant: Componentes Principales', 
            ha='center', fontsize=14, fontweight='bold')
    
    # Capa API
    api_box = FancyBboxPatch((0.5, 4.5), 3, 1.5, boxstyle="round,pad=0.1",
                               facecolor='#3498db', edgecolor='#2980b9', linewidth=2)
    ax.add_patch(api_box)
    ax.text(2, 5.25, 'API Layer', ha='center', va='center', fontsize=11, 
            fontweight='bold', color='white')
    ax.text(2, 4.85, 'REST (6333) | gRPC (6334)', ha='center', va='center', 
            fontsize=9, color='white')
    
    # Flecha API -> Motor
    ax.annotate('', xy=(4.5, 4.5), xytext=(3.5, 4.5),
                arrowprops=dict(arrowstyle='->', color='#2c3e50', lw=2))
    
    # Motor HNSW
    hnsw_box = FancyBboxPatch((4.5, 4.5), 3, 1.5, boxstyle="round,pad=0.1",
                               facecolor='#e74c3c', edgecolor='#c0392b', linewidth=2)
    ax.add_patch(hnsw_box)
    ax.text(6, 5.25, 'HNSW Engine', ha='center', va='center', fontsize=11,
            fontweight='bold', color='white')
    ax.text(6, 4.85, 'Búsqueda aproximada', ha='center', va='center',
            fontsize=9, color='white')
    
    # Flecha HNSW -> Gestor
    ax.annotate('', xy=(8.5, 4.5), xytext=(7.5, 4.5),
                arrowprops=dict(arrowstyle='->', color='#2c3e50', lw=2))
    
    # Gestor de segmentos
    gestor_box = FancyBboxPatch((8.5, 4.5), 1.2, 1.5, boxstyle="round,pad=0.1",
                                 facecolor='#27ae60', edgecolor='#1e8449', linewidth=2)
    ax.add_patch(gestor_box)
    ax.text(9.1, 5.25, 'Segment\nManager', ha='center', va='center', fontsize=9,
            fontweight='bold', color='white')
    
    # Flecha Gestor -> Almacenamiento
    ax.annotate('', xy=(9.1, 2.5), xytext=(9.1, 4.5),
                arrowprops=dict(arrowstyle='->', color='#2c3e50', lw=2))
    
    # Almacenamiento
    storage_box = FancyBboxPatch((8, 1), 2.2, 1.3, boxstyle="round,pad=0.1",
                                  facecolor='#9b59b6', edgecolor='#8e44ad', linewidth=2)
    ax.add_patch(storage_box)
    ax.text(9.1, 1.65, 'Storage Layer', ha='center', va='center', fontsize=10,
            fontweight='bold', color='white')
    ax.text(9.1, 1.3, 'WAL + Segments', ha='center', va='center', fontsize=9, color='white')
    
    # Segmentos (abajo)
    seg1 = FancyBboxPatch((1, 1), 2, 0.8, boxstyle="round,pad=0.05",
                           facecolor='#3498db', edgecolor='#2980b9', alpha=0.7)
    ax.add_patch(seg1)
    ax.text(2, 1.4, 'Segment 1', ha='center', va='center', fontsize=9, color='white')
    
    seg2 = FancyBboxPatch((3.5, 1), 2, 0.8, boxstyle="round,pad=0.05",
                           facecolor='#3498db', edgecolor='#2980b9', alpha=0.7)
    ax.add_patch(seg2)
    ax.text(4.5, 1.4, 'Segment 2', ha='center', va='center', fontsize=9, color='white')
    
    seg3 = FancyBboxPatch((6, 1), 2, 0.8, boxstyle="round,pad=0.05",
                           facecolor='#3498db', edgecolor='#2980b9', alpha=0.7)
    ax.add_patch(seg3)
    ax.text(7, 1.4, 'Segment N', ha='center', va='center', fontsize=9, color='white')
    
    # Conexiones a segmentos
    ax.annotate('', xy=(2, 1.8), xytext=(9.1, 2.5),
                arrowprops=dict(arrowstyle='->', color='#2c3e50', lw=1.5, 
                                connectionstyle='arc3,rad=0.2'))
    
    # Leyenda
    patches = [
        mpatches.Patch(color='#3498db', label='API / Segments'),
        mpatches.Patch(color='#e74c3c', label='HNSW Engine'),
        mpatches.Patch(color='#27ae60', label='Gestor'),
        mpatches.Patch(color='#9b59b6', label='Almacenamiento')
    ]
    ax.legend(handles=patches, loc='lower left', fontsize=9)
    
    # Labels de flujo
    ax.text(4, 5.6, 'Búsquedas', ha='center', fontsize=9, color='#2c3e50')
    ax.text(6.8, 5.6, 'Coordinación', ha='center', fontsize=9, color='#2c3e50')
    
    plt.tight_layout()
    plt.savefig('informe/images/fig1_arquitectura.png', dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close()
    print("✓ Figura 1: Arquitectura de Qdrant")

def crear_wal_flow():
    """Diagrama del flujo WAL"""
    fig, ax = plt.subplots(1, 1, figsize=(10, 5))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 5)
    ax.axis('off')
    
    ax.text(5, 4.5, 'Flujo de Datos: WAL y Segmentos', ha='center', 
            fontsize=14, fontweight='bold')
    
    # Cliente
    client = FancyBboxPatch((0.3, 2), 1.4, 1, boxstyle="round,pad=0.1",
                             facecolor='#3498db', edgecolor='#2980b9', linewidth=2)
    ax.add_patch(client)
    ax.text(1, 2.5, 'Cliente', ha='center', va='center', fontsize=10,
            fontweight='bold', color='white')
    
    # WAL
    wal = FancyBboxPatch((2.5, 2), 2, 1, boxstyle="round,pad=0.1",
                          facecolor='#e74c3c', edgecolor='#c0392b', linewidth=2)
    ax.add_patch(wal)
    ax.text(3.5, 2.5, 'WAL', ha='center', va='center', fontsize=12,
            fontweight='bold', color='white')
    ax.text(3.5, 2.15, 'Append-only', ha='center', va='center', fontsize=9, color='white')
    ax.text(3.5, 1.85, 'fsync()', ha='center', va='center', fontsize=9, color='white')
    
    # Segmentos
    seg = FancyBboxPatch((5.5, 2), 2, 1, boxstyle="round,pad=0.1",
                          facecolor='#27ae60', edgecolor='#1e8449', linewidth=2)
    ax.add_patch(seg)
    ax.text(6.5, 2.5, 'Segmentos', ha='center', va='center', fontsize=12,
            fontweight='bold', color='white')
    ax.text(6.5, 2.15, 'Indexados', ha='center', va='center', fontsize=9, color='white')
    
    # Checkpoint
    check = FancyBboxPatch((8.5, 2), 1.2, 1, boxstyle="round,pad=0.1",
                            facecolor='#9b59b6', edgecolor='#8e44ad', linewidth=2)
    ax.add_patch(check)
    ax.text(9.1, 2.5, 'Check-\npoint', ha='center', va='center', fontsize=9,
            fontweight='bold', color='white')
    
    # Flechas
    ax.annotate('', xy=(2.5, 2.5), xytext=(1.7, 2.5),
                arrowprops=dict(arrowstyle='->', color='#2c3e50', lw=2))
    ax.annotate('', xy=(5.5, 2.5), xytext=(4.5, 2.5),
                arrowprops=dict(arrowstyle='->', color='#2c3e50', lw=2))
    ax.annotate('', xy=(8.5, 2.5), xytext=(7.5, 2.5),
                arrowprops=dict(arrowstyle='->', color='#2c3e50', lw=2))
    
    # Labels de tiempo
    ax.text(1, 1.5, '1. Request', ha='center', fontsize=9)
    ax.text(3.5, 1.5, '2. Log', ha='center', fontsize=9)
    ax.text(6.5, 1.5, '3. Apply', ha='center', fontsize=9)
    ax.text(9.1, 1.5, '4. Sync', ha='center', fontsize=9)
    
    # Flecha de truncado (punteada)
    ax.annotate('', xy=(3.5, 3.2), xytext=(8.5, 3.2),
                arrowprops=dict(arrowstyle='->', color='#27ae60', lw=1.5,
                                linestyle='dashed'))
    ax.text(6, 3.4, 'Truncar WAL', ha='center', fontsize=9, color='#27ae60')
    
    # Paso de recuperación
    rec_box = FancyBboxPatch((2, 0.3), 6, 0.8, boxstyle="round,pad=0.1",
                              facecolor='#f39c12', edgecolor='#d68910', linewidth=1.5,
                              alpha=0.8)
    ax.add_patch(rec_box)
    ax.text(5, 0.7, 'Recuperación: Leer WAL → Reconstruir estado → Aplicar ops pendientes',
            ha='center', va='center', fontsize=9, color='white')
    
    plt.tight_layout()
    plt.savefig('informe/images/fig2_wal_flow.png', dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close()
    print("✓ Figura 2: Flujo WAL")

def crear_concurrencia():
    """Diagrama del modelo de concurrencia"""
    fig, ax = plt.subplots(1, 1, figsize=(10, 6))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 6)
    ax.axis('off')
    
    ax.text(5, 5.5, 'Modelo de Concurrencia de Qdrant', ha='center',
            fontsize=14, fontweight='bold')
    
    # Thread pool
    pool = FancyBboxPatch((0.5, 4), 2.5, 1.2, boxstyle="round,pad=0.1",
                           facecolor='#3498db', edgecolor='#2980b9', linewidth=2)
    ax.add_patch(pool)
    ax.text(1.75, 4.6, 'API Thread Pool', ha='center', va='center', fontsize=10,
            fontweight='bold', color='white')
    ax.text(1.75, 4.25, '(Múltiples requests)', ha='center', va='center', fontsize=9, 
            color='white')
    
    # Write queue
    write = FancyBboxPatch((3.5, 4), 2, 1.2, boxstyle="round,pad=0.1",
                            facecolor='#e74c3c', edgecolor='#c0392b', linewidth=2)
    ax.add_patch(write)
    ax.text(4.5, 4.6, 'Write Queue', ha='center', va='center', fontsize=10,
            fontweight='bold', color='white')
    ax.text(4.5, 4.25, '(Secuencial)', ha='center', va='center', fontsize=9, color='white')
    
    # Read workers
    read = FancyBboxPatch((6, 4), 3.5, 1.2, boxstyle="round,pad=0.1",
                           facecolor='#27ae60', edgecolor='#1e8449', linewidth=2)
    ax.add_patch(read)
    ax.text(7.75, 4.6, 'Read Workers (Paralelo)', ha='center', va='center', fontsize=10,
            fontweight='bold', color='white')
    ax.text(7.75, 4.25, '(Sin bloqueo)', ha='center', va='center', fontsize=9, color='white')
    
    # Flechas de flujo
    ax.annotate('', xy=(3.5, 4.6), xytext=(3, 4.6),
                arrowprops=dict(arrowstyle='->', color='#2c3e50', lw=2))
    ax.annotate('', xy=(6, 4.6), xytext=(5.5, 4.6),
                arrowprops=dict(arrowstyle='->', color='#2c3e50', lw=2))
    
    # Segmentos (abajo)
    seg1 = FancyBboxPatch((0.5, 1.5), 2.8, 1.5, boxstyle="round,pad=0.1",
                           facecolor='#9b59b6', edgecolor='#8e44ad', linewidth=1.5)
    ax.add_patch(seg1)
    ax.text(1.9, 2.25, 'Segment 1\n(Appendable)', ha='center', va='center',
            fontsize=9, fontweight='bold', color='white')
    
    seg2 = FancyBboxPatch((3.8, 1.5), 2.8, 1.5, boxstyle="round,pad=0.1",
                           facecolor='#9b59b6', edgecolor='#8e44ad', linewidth=1.5)
    ax.add_patch(seg2)
    ax.text(5.2, 2.25, 'Segment 2\n(Index)', ha='center', va='center',
            fontsize=9, fontweight='bold', color='white')
    
    seg3 = FancyBboxPatch((7.1, 1.5), 2.4, 1.5, boxstyle="round,pad=0.1",
                           facecolor='#9b59b6', edgecolor='#8e44ad', linewidth=1.5)
    ax.add_patch(seg3)
    ax.text(8.3, 2.25, 'Segment N\n(Index)', ha='center', va='center',
            fontsize=9, fontweight='bold', color='white')
    
    # Flechas a segmentos (Write)
    ax.annotate('', xy=(1.9, 3), xytext=(4.5, 4),
                arrowprops=dict(arrowstyle='->', color='#e74c3c', lw=1.5,
                                connectionstyle='arc3,rad=-0.2'))
    ax.text(2.5, 3.8, 'Escritura', fontsize=8, color='#e74c3c')
    
    # Flechas a segmentos (Read)
    ax.annotate('', xy=(1.9, 3), xytext=(7.75, 4),
                arrowprops=dict(arrowstyle='->', color='#27ae60', lw=1.5,
                                connectionstyle='arc3,rad=0.2'))
    ax.text(6, 3.5, 'Lectura', fontsize=8, color='#27ae60')
    
    # Lock indicator
    lock = FancyBboxPatch((0.8, 0.3), 2.2, 0.8, boxstyle="round,pad=0.05",
                           facecolor='#f39c12', edgecolor='#d68910', linewidth=1)
    ax.add_patch(lock)
    ax.text(1.9, 0.7, 'Lock exclusivo', ha='center', va='center', fontsize=8,
            color='white')
    
    plt.tight_layout()
    plt.savefig('informe/images/fig3_concurrencia.png', dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close()
    print("✓ Figura 3: Modelo de Concurrencia")

def crear_raft():
    """Diagrama de consenso Raft"""
    fig, ax = plt.subplots(1, 1, figsize=(10, 5))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 5)
    ax.axis('off')
    
    ax.text(5, 4.5, 'Consenso Raft en Qdrant Distribuido', ha='center',
            fontsize=14, fontweight='bold')
    
    # Nodo Leader
    leader = FancyBboxPatch((3.5, 2.5), 3, 1.5, boxstyle="round,pad=0.1",
                             facecolor='#e74c3c', edgecolor='#c0392b', linewidth=3)
    ax.add_patch(leader)
    ax.text(5, 3.25, 'LEADER', ha='center', va='center', fontsize=12,
            fontweight='bold', color='white')
    ax.text(5, 2.85, '(Acepta escrituras)', ha='center', va='center', fontsize=9, 
            color='white')
    
    # Nodo Follower 1
    f1 = FancyBboxPatch((0.3, 2.5), 2.5, 1.5, boxstyle="round,pad=0.1",
                          facecolor='#3498db', edgecolor='#2980b9', linewidth=2)
    ax.add_patch(f1)
    ax.text(1.55, 3.25, 'FOLLOWER 1', ha='center', va='center', fontsize=10,
            fontweight='bold', color='white')
    ax.text(1.55, 2.85, '(Réplica)', ha='center', va='center', fontsize=9, color='white')
    
    # Nodo Follower 2
    f2 = FancyBboxPatch((7.2, 2.5), 2.5, 1.5, boxstyle="round,pad=0.1",
                          facecolor='#3498db', edgecolor='#2980b9', linewidth=2)
    ax.add_patch(f2)
    ax.text(8.45, 3.25, 'FOLLOWER 2', ha='center', va='center', fontsize=10,
            fontweight='bold', color='white')
    ax.text(8.45, 2.85, '(Réplica)', ha='center', va='center', fontsize=9, color='white')
    
    # Flechas de replicación
    ax.annotate('', xy=(3.5, 3.25), xytext=(2.8, 3.25),
                arrowprops=dict(arrowstyle='<->', color='#27ae60', lw=2))
    ax.annotate('', xy=(7.2, 3.25), xytext=(6.5, 3.25),
                arrowprops=dict(arrowstyle='<->', color='#27ae60', lw=2))
    
    # Label replicación
    ax.text(5, 3.55, 'Replicación', ha='center', fontsize=8, color='#27ae60')
    
    # Cliente
    client = FancyBboxPatch((4, 1), 2, 0.8, boxstyle="round,pad=0.05",
                             facecolor='#9b59b6', edgecolor='#8e44ad', linewidth=1.5)
    ax.add_patch(client)
    ax.text(5, 1.4, 'Cliente', ha='center', va='center', fontsize=9, 
            fontweight='bold', color='white')
    
    # Flecha cliente -> leader
    ax.annotate('', xy=(5, 2.5), xytext=(5, 1.8),
                arrowprops=dict(arrowstyle='->', color='#2c3e50', lw=1.5))
    
    # Label
    ax.text(5.5, 1.55, 'Write', fontsize=8, color='#2c3e50')
    
    # Notas
    ax.text(0.5, 0.7, '• Leader: procesa todas las escrituras', fontsize=8)
    ax.text(0.5, 0.45, '• Followers: replican en mismo orden', fontsize=8)
    ax.text(0.5, 0.2, '• Failover: elección automática si líder cae', fontsize=8)
    
    plt.tight_layout()
    plt.savefig('informe/images/fig4_raft.png', dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close()
    print("✓ Figura 4: Consenso Raft")

def crear_hnsw():
    """Diagrama simplificado del algoritmo HNSW"""
    fig, ax = plt.subplots(1, 1, figsize=(10, 6))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 6)
    ax.axis('off')
    
    ax.text(5, 5.5, 'Estructura del Índice HNSW', ha='center',
            fontsize=14, fontweight='bold')
    
    # Capas
    # Capa 2 (más alta)
    ax.add_patch(FancyBboxPatch((0.5, 4), 9, 0.8, boxstyle="round,pad=0.05",
                                 facecolor='#3498db', edgecolor='#2980b9', alpha=0.3))
    ax.text(5, 4.4, 'Capa 2 (menos nodos)', ha='center', fontsize=9)
    ax.plot([1.5, 2.5, 5, 7, 8.5], [4.4, 4.4, 4.4, 4.4, 4.4], 'ko', markersize=8)
    
    # Capa 1
    ax.add_patch(FancyBboxPatch((0.5, 3), 9, 0.8, boxstyle="round,pad=0.05",
                                 facecolor='#3498db', edgecolor='#2980b9', alpha=0.5))
    ax.text(5, 3.4, 'Capa 1', ha='center', fontsize=9)
    ax.plot([1, 2.5, 4, 5.5, 7, 8, 9], [3.4, 3.4, 3.4, 3.4, 3.4, 3.4, 3.4], 'ko', markersize=8)
    
    # Capa 0 (más baja, todos los nodos)
    ax.add_patch(FancyBboxPatch((0.5, 1.8), 9, 0.9, boxstyle="round,pad=0.05",
                                 facecolor='#3498db', edgecolor='#2980b9', alpha=0.7))
    ax.text(5, 2.55, 'Capa 0 (todos los nodos, máximo detalle)', ha='center', fontsize=9)
    
    # Nodos capa 0
    np.random.seed(42)
    x_pos = [1.2, 2, 2.8, 3.6, 4.5, 5.3, 6.2, 7, 7.8, 8.5]
    y_pos = [2.1, 2.3, 2.0, 2.4, 2.1, 2.35, 2.05, 2.25, 2.1, 2.3]
    ax.plot(x_pos, y_pos, 'ko', markersize=10)
    
    # Entry point
    ax.plot([5.5], [2.25], 'r*', markersize=15, label='Entry Point')
    
    # Flechas de conexión (simplificado)
    for i in range(len(x_pos)-1):
        ax.annotate('', xy=(x_pos[i+1], y_pos[i+1]), xytext=(x_pos[i], y_pos[i]),
                    arrowprops=dict(arrowstyle='-', color='#e74c3c', lw=0.5, alpha=0.5))
    
    # Búsqueda descendente
    ax.annotate('', xy=(5.5, 4.4), xytext=(5.5, 2.25),
                arrowprops=dict(arrowstyle='->', color='#27ae60', lw=2))
    ax.text(6, 3.5, 'Búsqueda\ndescendente', fontsize=8, color='#27ae60')
    
    # Labels
    ax.text(0.8, 4.7, 'L = 2', fontsize=8, fontweight='bold')
    ax.text(0.8, 3.7, 'L = 1', fontsize=8, fontweight='bold')
    ax.text(0.8, 2.5, 'L = 0', fontsize=8, fontweight='bold')
    
    # Leyenda
    ax.plot([], [], 'ko', markersize=8, label='Nodo')
    ax.plot([], [], 'r*', markersize=12, label='Entry Point')
    ax.legend(loc='lower right', fontsize=9)
    
    plt.tight_layout()
    plt.savefig('informe/images/fig5_hnsw.png', dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close()
    print("✓ Figura 5: Estructura HNSW")

if __name__ == '__main__':
    print("Generando diagramas para el informe...")
    crear_arquitectura()
    crear_wal_flow()
    crear_concurrencia()
    crear_raft()
    crear_hnsw()
    print("\n✓ Todos los diagramas generados en informe/images/")