import { NextRequest, NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth-utils';
import { supabase } from '@/lib/supabase';
import { CreateGuideData } from '@/types/guides';

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

/**
 * POST /api/guides
 *
 * Crea una nuova guida nel database.
 * Richiede autenticazione admin.
 *
 * @param {NextRequest} request - Oggetto richiesta HTTP con body JSON
 *
 * Body Parameters richiesti:
 * @param {string} title - Titolo della guida
 * @param {string} content - Contenuto della guida (markdown supportato)
 * @param {string} category_id - ID della categoria associata
 * @param {boolean} [published=true] - Se la guida è pubblicata (default: true)
 *
 * @returns {Promise<NextResponse>} Response JSON con:
 *   - success: boolean - Indica se l'operazione è riuscita
 *   - data: Guide - Guida creata con informazioni categoria
 *   - error?: string - Messaggio di errore (solo in caso di fallimento)
 *
 * @example
 * // Richiesta
 * POST /api/guides
 * Content-Type: application/json
 * {
 *   "title": "Come preparare un cappuccino perfetto",
 *   "content": "# Preparazione\n\nPer preparare...",
 *   "category_id": "uuid-123",
 *   "published": true
 * }
 *
 * // Risposta di successo (201)
 * {
 *   "success": true,
 *   "data": {
 *     "id": "new-uuid-456",
 *     "title": "Come preparare un cappuccino perfetto",
 *     "content": "# Preparazione\n\nPer preparare...",
 *     "category_id": "uuid-123",
 *     "created_at": "2024-08-04T10:30:00Z",
 *     "categories": {
 *       "id": "uuid-123",
 *       "name": "Preparazione"
 *     }
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Authentication check - admin required
    const authError = await requireAuth(request, true);
    if (authError) {
      return NextResponse.json(
        { error: authError.error || 'Non autorizzato' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    // Parsing del body JSON
    const body: CreateGuideData = await request.json();

    // Validazione dati richiesti
    const { title, content, category_id, published = true } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Titolo obbligatorio' },
        { status: 400 }
      );
    }

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Contenuto obbligatorio' },
        { status: 400 }
      );
    }

    if (!category_id?.trim()) {
      return NextResponse.json(
        { error: 'Categoria obbligatoria' },
        { status: 400 }
      );
    }

    // Verifica che la categoria esista
    const { data: categoryExists, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', category_id)
      .single();

    if (categoryError || !categoryExists) {
      return NextResponse.json(
        { error: 'Categoria non trovata' },
        { status: 400 }
      );
    }

    // Inserimento nuova guida
    const { data: newGuide, error: insertError } = await supabase
      .from('guides')
      .insert([
        {
          title: title.trim(),
          content: content.trim(),
          category_id,
          // published, // Se hai questo campo nel DB
        },
      ])
      .select(
        `
        *,
        categories (
          id,
          name
        )
      `
      )
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: 'Errore durante la creazione della guida' },
        { status: 500 }
      );
    }

    // Risposta di successo con la nuova guida
    return NextResponse.json(
      {
        success: true,
        data: newGuide,
      },
      { status: 201 } // Created
    );
  } catch (error) {
    console.error('API error:', error);

    // Gestione errori di parsing JSON
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Body JSON malformato' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
