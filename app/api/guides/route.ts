import { NextRequest, NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

/**
 * GET /api/guides
 *
 * Recupera tutte le guide dal database con le informazioni delle categorie associate.
 * Supporta filtri opzionali tramite query parameters.
 * Le guide vengono ordinate per data di creazione (più recenti per prime).
 *
 * @param {NextRequest} request - Oggetto richiesta HTTP che contiene URL e parametri
 *
 * Query Parameters supportati:
 * @param {string} [id] - Filtra guide per ID categoria specifica (filtra su category_id)
 *
 * @returns {Promise<NextResponse>} Response JSON con:
 *   - success: boolean - Indica se l'operazione è riuscita
 *   - data: GuideWithCategory[] - Array delle guide con info categoria
 *   - error?: string - Messaggio di errore (solo in caso di fallimento)
 *
 * @example
 * Richiesta: tutte le guide
 * GET /api/guides?id=all
 *
 * Richiesta: guide di una categoria specifica
 * GET /api/guides?id=uuid-123
 *
 * Risposta di successo (200)
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "guide-uuid-456",
 *       "title": "Come preparare un espresso perfetto",
 *       "content": "Testo della guida...",
 *       "id": "uuid-123",
 *       "created_at": "2024-01-15T10:30:00Z",
 *       "published": true,
 *       "categories": {
 *         "id": "uuid-123",
 *         "name": "Preparazione Caffè"
 *       }
 *     }
 *   ]
 * }
 *
 * Risposta di errore (500)
 * {
 *   "error": "Errore nel recuperare le guide",
 *   "details": "connection failed"
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Estrazione dei query parameters dall'URL
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('id');

    // Costruzione della query base con JOIN
    let query = supabase
      .from('guides') // Tabella principale
      .select(
        `
        *,                                   
        categories (                         
          id,                                
          name
        )
      `
      )
      .order('created_at', { ascending: false }); // Ordinamento: più recenti per prime

    // Applicazione filtro condizionale per categoria
    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId);
      // SQL equivalente: WHERE category_id = 'categoryId'
    }

    // Esecuzione della query
    const { data: guides, error } = await query;

    // Gestione errori Supabase
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        {
          error: 'Errore nel recuperare le guide',
          details: error.message,
        },
        { status: 500 }
      );
    }

    // Risposta di successo
    return NextResponse.json({
      success: true,
      data: guides || [], // Fallback array vuoto se guides è null
    });
  } catch (error) {
    // Gestione errori JavaScript generici
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
