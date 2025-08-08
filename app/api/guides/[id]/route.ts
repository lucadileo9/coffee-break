import { NextRequest, NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth-utils';
import { HTTP_STATUS } from '@/lib/http-status';
import { supabase } from '@/lib/supabase';
import { CreateGuideData } from '@/types/guides';

/**
 * Interfaccia TypeScript per i parametri dinamici della route
 * Next.js estrae automaticamente i parametri dalle parentesi quadre [id]
 */
interface RouteParams {
  params: {
    id: string; // Corrisponde al nome del file [id]
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
 *     "id": "cat-uuid-789",
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
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Estrazione dell'ID dai parametri dinamici dell'URL
    const { id } = params;
    // URL: /api/guides/abc-123 → id = "abc-123"

    // Validazione presenza ID (controllo difensivo)
    if (!id) {
      return NextResponse.json(
        { error: 'ID guida richiesto' },
        { status: 400 } // Bad Request - richiesta malformata
      );
    }

    // Query per singola guida con JOIN categoria
    const { data: guide, error } = await supabase
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
      .eq('id', id) // WHERE id = 'parametro-url'
      .single(); // Ritorna oggetto singolo, non array

    // Gestione errori Supabase con codici specifici
    if (error) {
      console.error('Supabase error:', error);

      // Gestione specifica per "record non trovato"
      if (error.code === 'PGRST116') {
        // PGRST116 = PostgREST error code per "nessuna riga trovata"
        return NextResponse.json(
          { error: 'Guida non trovata' },
          { status: 404 } // Not Found - risorsa inesistente
        );
      }

      // Altri errori Supabase (connessione, permessi, etc.)
      return NextResponse.json(
        { error: 'Errore nel recuperare la guida' },
        { status: 500 } // Internal Server Error
      );
    }

    // Controllo aggiuntivo: data potrebbe essere null anche senza error
    if (!guide) {
      return NextResponse.json({ error: 'Guida non trovata' }, { status: 404 });
    }

    // Risposta di successo con guida singola
    return NextResponse.json({
      success: true,
      data: guide, // Oggetto singolo, non array come in /api/guides
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

/**
 * PUT /api/guides/[id]
 *
 * Modifica completamente una guida esistente.
 * Richiede autenticazione admin.
 *
 * @param {NextRequest} request - Oggetto richiesta HTTP con body JSON
 * @param {RouteParams} { params } - Parametri dinamici estratti dall'URL
 *
 * Route Parameters:
 * @param {string} id - ID univoco della guida da modificare
 *
 * Body Parameters richiesti:
 * @param {string} title - Nuovo titolo della guida
 * @param {string} content - Nuovo contenuto della guida
 * @param {string} category_id - ID della nuova categoria associata
 * @param {boolean} [published] - Se la guida è pubblicata
 *
 * @returns {Promise<NextResponse>} Response JSON con guida aggiornata
 *
 * @example
 * // Richiesta
 * PUT /api/guides/abc-123-def-456
 * {
 *   "title": "Titolo aggiornato",
 *   "content": "Contenuto aggiornato",
 *   "category_id": "new-category-uuid"
 * }
 *
 * // Risposta (200)
 * {
 *   "success": true,
 *   "data": { ... } // Guida aggiornata con categoria
 * }
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Authentication check - admin required
    const authError = await requireAuth(request, true);
    if (authError) {
      return NextResponse.json(
        { error: authError.error || 'Non autorizzato' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID guida richiesto' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Parsing del body JSON
    const body: CreateGuideData = await request.json();
    const { title, content, category_id } = body;

    // Validazione dati
    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Titolo obbligatorio' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Contenuto obbligatorio' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    if (!category_id?.trim()) {
      return NextResponse.json(
        { error: 'Categoria obbligatoria' },
        { status: HTTP_STATUS.BAD_REQUEST }
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
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Aggiornamento guida
    const { data: updatedGuide, error: updateError } = await supabase
      .from('guides')
      .update({
        title: title.trim(),
        content: content.trim(),
        category_id,
        // published, // Se hai questo campo
      })
      .eq('id', id)
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

    if (updateError) {
      console.error('Update error:', updateError);

      // Gestione specifica per "guida non trovata"
      if (updateError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Guida non trovata' },
          { status: HTTP_STATUS.NOT_FOUND }
        );
      }

      return NextResponse.json(
        { error: "Errore durante l'aggiornamento della guida" },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    if (!updatedGuide) {
      return NextResponse.json({ error: 'Guida non trovata' }, { status: HTTP_STATUS.NOT_FOUND });
    }

    return NextResponse.json({
      success: true,
      data: updatedGuide,
    });
  } catch (error) {
    console.error('API error:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Body JSON malformato' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

/**
 * PATCH /api/guides/[id]
 *
 * Modifica parzialmente una guida esistente.
 * Simile a PUT ma permette aggiornamenti parziali.
 * Richiede autenticazione admin.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Authentication check - admin required
    const authError = await requireAuth(request, true);
    if (authError) {
      return NextResponse.json(
        { error: authError.error || 'Non autorizzato' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID guida richiesto' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Parsing del body JSON
    const body: Partial<CreateGuideData> = await request.json();
    const { title, content, category_id } = body;

    // Validazione: almeno un campo deve essere presente
    if (!title && !content && !category_id) {
      return NextResponse.json(
        { error: 'Almeno un campo da aggiornare è richiesto' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Costruisci oggetto update dinamicamente
    const updateData: Partial<CreateGuideData> = {};

    if (title?.trim()) updateData.title = title.trim();
    if (content?.trim()) updateData.content = content.trim();
    if (category_id?.trim()) {
      // Verifica che la categoria esista
      const { data: categoryExists, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('id', category_id)
        .single();

      if (categoryError || !categoryExists) {
        return NextResponse.json(
          { error: 'Categoria non trovata' },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }

      updateData.category_id = category_id.trim();
    }

    // Aggiornamento parziale
    const { data: updatedGuide, error: updateError } = await supabase
      .from('guides')
      .update(updateData)
      .eq('id', id)
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

    if (updateError) {
      console.error('Patch error:', updateError);

      if (updateError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Guida non trovata' },
          { status: HTTP_STATUS.NOT_FOUND }
        );
      }

      return NextResponse.json(
        { error: "Errore durante l'aggiornamento della guida" },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    if (!updatedGuide) {
      return NextResponse.json({ error: 'Guida non trovata' }, { status: HTTP_STATUS.NOT_FOUND });
    }

    return NextResponse.json({
      success: true,
      data: updatedGuide,
    });
  } catch (error) {
    console.error('API error:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Body JSON malformato' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

/**
 * DELETE /api/guides/[id]
 *
 * Elimina definitivamente una guida dal database.
 * Richiede autenticazione admin.
 *
 * @param {NextRequest} request - Oggetto richiesta HTTP
 * @param {RouteParams} { params } - Parametri dinamici estratti dall'URL
 *
 * Route Parameters:
 * @param {string} id - ID univoco della guida da eliminare
 *
 * @returns {Promise<NextResponse>} Response JSON con conferma eliminazione
 *
 * @example
 * // Richiesta
 * DELETE /api/guides/abc-123-def-456
 *
 * // Risposta successo (200)
 * {
 *   "success": true,
 *   "message": "Guida eliminata con successo"
 * }
 *
 * // Risposta guida non trovata (404)
 * {
 *   "error": "Guida non trovata"
 * }
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Authentication check - admin required
    const authError = await requireAuth(request, true);
    if (authError) {
      return NextResponse.json(
        { error: authError.error || 'Non autorizzato' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID guida richiesto' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Elimina la guida
    const { error: deleteError, count } = await supabase
      .from('guides')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json(
        { error: "Errore durante l'eliminazione della guida" },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    // Verifica se è stata effettivamente eliminata una riga
    // Se count è 0, significa che l'ID non esisteva
    if (count === 0) {
      return NextResponse.json({ error: 'Guida non trovata' }, { status: HTTP_STATUS.NOT_FOUND });
    }

    return NextResponse.json({
      success: true,
      message: 'Guida eliminata con successo',
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
