import { NextRequest, NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth-utils';
import { HTTP_STATUS } from '@/lib/http-status';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { CreateProductData } from '@/types/products';

/**
 * Helper function per normalizzare category_id da string | number a string
 */
function normalizeCategoryId(
  categoryId: string | number | undefined
): string | undefined {
  if (categoryId === undefined || categoryId === null) return undefined;
  return typeof categoryId === 'number' ? String(categoryId) : categoryId;
}

/**
 * Interfaccia TypeScript per i parametri dinamici della route
 */
interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/products/[id]
 *
 * Recupera un singolo prodotto dal database usando il suo ID.
 * Include le informazioni della categoria associata.
 *
 * @param {NextRequest} request - Oggetto richiesta HTTP
 * @param {RouteParams} { params } - Parametri dinamici estratti dall'URL
 *
 * @returns {Promise<NextResponse>} Response JSON con prodotto singolo
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID prodotto richiesto' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const { data: product, error } = await supabase
      .from('products')
      .select(
        `
        *,
        categories (
          id,
          name
        )
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);

      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Prodotto non trovato' },
          { status: HTTP_STATUS.NOT_FOUND }
        );
      }

      return NextResponse.json(
        { error: 'Errore nel recuperare il prodotto' },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Prodotto non trovato' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

/**
 * PUT /api/products/[id]
 *
 * Aggiorna completamente un prodotto esistente.
 * Richiede autenticazione admin.
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

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID prodotto richiesto' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Parsing del body JSON
    const body: CreateProductData = await request.json();
    const { name, description, price } = body;
    const category_id = normalizeCategoryId(body.category_id);

    // Validazione dati
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Nome del prodotto obbligatorio' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Descrizione è opzionale
    const trimmedDescription = description?.trim();

    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json(
        { error: 'Prezzo deve essere un numero positivo' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    if (
      !category_id ||
      typeof category_id !== 'string' ||
      !category_id.trim()
    ) {
      return NextResponse.json(
        { error: 'Categoria obbligatoria' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Verifica che la categoria esista
    const { data: categoryExists, error: categoryError } = await supabaseAdmin
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

    // Aggiornamento prodotto
    const updateData: {
      name: string;
      price: number;
      category_id: string;
      description?: string;
    } = {
      name: name.trim(),
      price,
      category_id,
    };

    // Aggiungi descrizione se fornita
    if (description?.trim()) {
      updateData.description = description.trim();
    }

    const { data: updatedProduct, error: updateError } = await supabaseAdmin
      .from('products')
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
      console.error('Update error:', updateError);

      if (updateError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Prodotto non trovato' },
          { status: HTTP_STATUS.NOT_FOUND }
        );
      }

      return NextResponse.json(
        { error: "Errore durante l'aggiornamento del prodotto" },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Prodotto non trovato' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct,
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
 * PATCH /api/products/[id]
 *
 * Aggiorna parzialmente un prodotto esistente.
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

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID prodotto richiesto' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Parsing del body JSON
    const body: Partial<CreateProductData> = await request.json();
    const { name, description, price } = body;
    const category_id = normalizeCategoryId(body.category_id);

    // Validazione: almeno un campo deve essere presente
    if (!name && !description && price === undefined && !category_id) {
      return NextResponse.json(
        { error: 'Almeno un campo da aggiornare è richiesto' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Costruisci oggetto update dinamicamente
    const updateData: Partial<CreateProductData> = {};

    if (name?.trim()) updateData.name = name.trim();
    if (description !== undefined) {
      // Se description è una stringa vuota, la manteniamo per permettere di rimuovere la descrizione
      updateData.description = description.trim() || undefined;
    }
    if (typeof price === 'number' && price >= 0) updateData.price = price;

    if (category_id?.trim()) {
      // Verifica che la categoria esista
      const { data: categoryExists, error: categoryError } = await supabaseAdmin
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
    const { data: updatedProduct, error: updateError } = await supabaseAdmin
      .from('products')
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
          { error: 'Prodotto non trovato' },
          { status: HTTP_STATUS.NOT_FOUND }
        );
      }

      return NextResponse.json(
        { error: "Errore durante l'aggiornamento del prodotto" },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Prodotto non trovato' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct,
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
 * DELETE /api/products/[id]
 *
 * Elimina definitivamente un prodotto dal database.
 * Richiede autenticazione admin.
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

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID prodotto richiesto' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Elimina il prodotto
    const { error: deleteError, count } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json(
        { error: "Errore durante l'eliminazione del prodotto" },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    // Verifica se è stata effettivamente eliminata una riga
    if (count === 0) {
      return NextResponse.json(
        { error: 'Prodotto non trovato' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Prodotto eliminato con successo',
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
