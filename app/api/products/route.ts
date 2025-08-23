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
 * GET /api/products
 *
 * Recupera tutti i prodotti dal database con le informazioni delle categorie associate.
 * Endpoint pubblico per visualizzazione sul sito.
 *
 * @param {NextRequest} request - Oggetto richiesta HTTP
 *
 * Query Parameters opzionali:
 * @param {string} category_id - Filtra per categoria specifica
 *
 * @returns {Promise<NextResponse>} Response JSON con:
 *   - success: boolean - Indica se l'operazione è riuscita
 *   - data: ProductWithCategory[] - Array di prodotti con info categoria
 *   - error?: string - Messaggio di errore (solo in caso di fallimento)
 *
 * Status Codes:
 * - 200: Prodotti recuperati con successo
 * - 500: Errore interno del server o database
 *
 * @example
 * // Richiesta
 * GET /api/products
 * GET /api/products?category_id=123
 *
 * // Risposta di successo (200)
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "product-uuid-123",
 *       "name": "Espresso Blend Premium",
 *       "description": "Miscela di caffè pregiata per espresso perfetto",
 *       "price": 1500,
 *       "category_id": "cat-uuid-456",
 *       "created_at": "2024-01-20T14:30:00Z",
 *       "categories": {
 *         "id": "cat-uuid-456",
 *         "name": "Caffè in Grani"
 *       }
 *     }
 *   ]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('id');

    // Costruisci query base
    let query = supabase
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
      .order('created_at', { ascending: false });

    // Applicazione filtro condizionale per categoria
    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId);
      // SQL equivalente: WHERE category_id = 'categoryId'
    }

    // Esegui query
    const { data: products, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Errore nel recuperare i prodotti' },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    return NextResponse.json({
      success: true,
      data: products || [],
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
 * POST /api/products
 *
 * Crea un nuovo prodotto nel database.
 * Richiede autenticazione admin.
 *
 * @param {NextRequest} request - Oggetto richiesta HTTP con body JSON
 *
 * Body Parameters richiesti:
 * @param {string} name - Nome del prodotto
 * @param {string} description - Descrizione del prodotto
 * @param {number} price - Prezzo in centesimi
 * @param {string|number} category_id - ID della categoria associata
 *
 * @returns {Promise<NextResponse>} Response JSON con prodotto creato
 *
 * @example
 * // Richiesta
 * POST /api/products
 * {
 *   "name": "Caffè Arabica Premium",
 *   "description": "Caffè 100% arabica di alta qualità",
 *   "price": 2500,
 *   "category_id": "cat-uuid-123"
 * }
 *
 * // Risposta (201)
 * {
 *   "success": true,
 *   "data": { ... } // Prodotto creato con categoria
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

    // Creazione prodotto
    const productData: {
      name: string;
      price: number;
      category_id: string;
      description?: string;
    } = {
      name: name.trim(),
      price,
      category_id,
    };

    // Aggiungi descrizione solo se fornita
    if (description?.trim()) {
      productData.description = description.trim();
    }

    const { data: newProduct, error: insertError } = await supabaseAdmin
      .from('products')
      .insert(productData)
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
        { error: 'Errore durante la creazione del prodotto' },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: newProduct,
      },
      { status: HTTP_STATUS.CREATED }
    );
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
