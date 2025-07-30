import { NextRequest, NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

/**
 * Interfaccia TypeScript per i parametri dinamici della route
 * Next.js estrae automaticamente i parametri dalle parentesi quadre [id]
 */
interface RouteParams {
  params: {
    id: string;  // Corrisponde al nome del file [id]
  };
}

/**
 * GET /api/guides/[id]
 * 
 * Recupera una singola guida specifica dal database usando il suo ID univoco.
 * Include le informazioni della categoria associata tramite JOIN.
 * 
 * @param {NextRequest} request - Oggetto richiesta HTTP
 * @param {RouteParams} { params } - Parametri dinamici estratti dall'URL
 * 
 * Route Parameters:
 * @param {string} id - ID univoco della guida (UUID)
 * 
 * @returns {Promise<NextResponse>} Response JSON con:
 *   - success: boolean - Indica se l'operazione è riuscita
 *   - data: GuideWithCategory - Oggetto singola guida con info categoria
 *   - error?: string - Messaggio di errore (solo in caso di fallimento)
 * 
 * Status Codes:
 * - 200: Guida trovata e restituita con successo
 * - 400: ID mancante o malformato
 * - 404: Guida non trovata con quell'ID
 * - 500: Errore interno del server o database
 * 
 * @example
 * // Richiesta
 * GET /api/guides/abc-123-def-456
 * 
 * // Risposta di successo (200)
 * {
 *   "success": true,
 *   "data": {
 *     "id": "abc-123-def-456",
 *     "title": "Come macinare i chicchi di caffè",
 *     "content": "Il contenuto completo della guida...",
 *     "category_id": "cat-uuid-789",
 *     "created_at": "2024-01-20T14:30:00Z",
 *     "published": true,
 *     "categories": {
 *       "id": "cat-uuid-789",
 *       "name": "Preparazione"
 *     }
 *   }
 * }
 * 
 * // Risposta guida non trovata (404)
 * {
 *   "error": "Guida non trovata"
 * }
 * 
 * // Risposta ID mancante (400)
 * {
 *   "error": "ID guida richiesto"
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Estrazione dell'ID dai parametri dinamici dell'URL
    const { id } = params;
    // URL: /api/guides/abc-123 → id = "abc-123"

    // Validazione presenza ID (controllo difensivo)
    if (!id) {
      return NextResponse.json(
        { error: 'ID guida richiesto' },
        { status: 400 }  // Bad Request - richiesta malformata
      );
    }

    // Query per singola guida con JOIN categoria
    const { data: guide, error } = await supabase
      .from('guides')                        // Tabella principale
      .select(`
        *,                                   
        categories (                         
          id,                                
          name
        )
      `)
      .eq('id', id)                         // WHERE id = 'parametro-url'
      .single();                            // Ritorna oggetto singolo, non array

    // Gestione errori Supabase con codici specifici
    if (error) {
      console.error('Supabase error:', error);
      
      // Gestione specifica per "record non trovato"
      if (error.code === 'PGRST116') {
        // PGRST116 = PostgREST error code per "nessuna riga trovata"
        return NextResponse.json(
          { error: 'Guida non trovata' },
          { status: 404 }  // Not Found - risorsa inesistente
        );
      }
      
      // Altri errori Supabase (connessione, permessi, etc.)
      return NextResponse.json(
        { error: 'Errore nel recuperare la guida' },
        { status: 500 }  // Internal Server Error
      );
    }

    // Controllo aggiuntivo: data potrebbe essere null anche senza error
    if (!guide) {
      return NextResponse.json(
        { error: 'Guida non trovata' },
        { status: 404 }
      );
    }

    // Risposta di successo con guida singola
    return NextResponse.json({ 
      success: true, 
      data: guide  // Oggetto singolo, non array come in /api/guides
    });

  } catch (error) {
    // Gestione errori JavaScript imprevisti
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}