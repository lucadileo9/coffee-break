import { NextRequest, NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

/**
 * Interfaccia TypeScript per i parametri dinamici della route
 */
interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * Interfaccia per i dati di aggiornamento categoria
 */
interface UpdateCategoryData {
  name: string;
}

/**
 * GET /api/categories/[id]
 *
 * Recupera una singola categoria specifica dal database usando il suo ID.
 * Include anche il conteggio delle guide associate a questa categoria.
 *
 * @param {NextRequest} request - Oggetto richiesta HTTP
 * @param {RouteParams} { params } - Parametri dinamici estratti dall'URL
 *
 * @returns {Promise<NextResponse>} Response JSON con categoria singola
 *
 * @example
 * GET /api/categories/abc-123
 * 
 * // Risposta (200)
 * {
 *   "success": true,
 *   "data": {
 *     "id": "abc-123",
 *     "name": "Preparazione Caffè",
 *     "created_at": "2024-01-15T10:30:00Z",
 *     "guides_count": 5
 *   }
 * }
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID categoria richiesto' },
        { status: 400 }
      );
    }

    // Query per singola categoria
    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Categoria non trovata' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: 'Errore nel recuperare la categoria' },
        { status: 500 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: 'Categoria non trovata' },
        { status: 404 }
      );
    }

    // Opzionale: conteggio guide associate
    const { count: guidesCount } = await supabase
      .from('guides')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id);

    return NextResponse.json({
      success: true,
      data: {
        ...category,
        guides_count: guidesCount || 0,
      },
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/categories/[id]
 *
 * Modifica completamente una categoria esistente.
 * Richiede autenticazione admin.
 *
 * @param {NextRequest} request - Oggetto richiesta HTTP con body JSON
 * @param {RouteParams} { params } - Parametri dinamici estratti dall'URL
 *
 * @example
 * PUT /api/categories/abc-123
 * {
 *   "name": "Nuovo Nome Categoria"
 * }
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // TODO: Aggiungere controllo autenticazione admin
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID categoria richiesto' },
        { status: 400 }
      );
    }

    const body: UpdateCategoryData = await request.json();
    const { name } = body;
    
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Nome categoria obbligatorio' },
        { status: 400 }
      );
    }

    // Verifica unicità del nome (escludendo la categoria corrente)
    const { data: existingCategory, error: checkError } = await supabase
      .from('categories')
      .select('id')
      .ilike('name', name.trim())
      .neq('id', id) // Escludi la categoria che stiamo modificando
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Check error:', checkError);
      return NextResponse.json(
        { error: 'Errore durante la verifica duplicati' },
        { status: 500 }
      );
    }

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Categoria con questo nome già esistente' },
        { status: 409 }
      );
    }

    // Aggiornamento categoria
    const { data: updatedCategory, error: updateError } = await supabase
      .from('categories')
      .update({ name: name.trim() })
      .eq('id', id)
      .select('*')
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      
      if (updateError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Categoria non trovata' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: 'Errore durante l\'aggiornamento della categoria' },
        { status: 500 }
      );
    }

    if (!updatedCategory) {
      return NextResponse.json(
        { error: 'Categoria non trovata' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedCategory,
    });

  } catch (error) {
    console.error('API error:', error);
    
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

/**
 * PATCH /api/categories/[id]
 *
 * Modifica parzialmente una categoria esistente.
 * Alias per PUT in questo caso, dato che abbiamo solo il campo 'name'.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  // Per le categorie, PATCH è identico a PUT dato che abbiamo solo il campo 'name'
  return PUT(request, { params });
}

/**
 * DELETE /api/categories/[id]
 *
 * Elimina una categoria dal database.
 * ATTENZIONE: Verifica prima che non ci siano guide associate.
 * Richiede autenticazione admin.
 *
 * @param {NextRequest} request - Oggetto richiesta HTTP
 * @param {RouteParams} { params } - Parametri dinamici estratti dall'URL
 *
 * @example
 * DELETE /api/categories/abc-123
 * 
 * // Risposta successo (200)
 * {
 *   "success": true,
 *   "message": "Categoria eliminata con successo"
 * }
 * 
 * // Risposta categoria con guide associate (409)
 * {
 *   "error": "Impossibile eliminare categoria con guide associate",
 *   "guides_count": 3
 * }
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // TODO: Aggiungere controllo autenticazione admin
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID categoria richiesto' },
        { status: 400 }
      );
    }

    // Verifica se ci sono guide associate a questa categoria
    const { count: guidesCount, error: countError } = await supabase
      .from('guides')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id);

    if (countError) {
      console.error('Count error:', countError);
      return NextResponse.json(
        { error: 'Errore durante la verifica delle guide associate' },
        { status: 500 }
      );
    }

    // Se ci sono guide associate, impedisci l'eliminazione
    if (guidesCount && guidesCount > 0) {
      return NextResponse.json(
        { 
          error: 'Impossibile eliminare categoria con guide associate',
          guides_count: guidesCount,
          suggestion: 'Elimina prima tutte le guide associate o assegna loro una categoria diversa'
        },
        { status: 409 } // Conflict
      );
    }

    // Elimina la categoria
    const { error: deleteError, count } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json(
        { error: 'Errore durante l\'eliminazione della categoria' },
        { status: 500 }
      );
    }

    if (count === 0) {
      return NextResponse.json(
        { error: 'Categoria non trovata' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Categoria eliminata con successo',
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
