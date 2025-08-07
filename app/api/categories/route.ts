import { NextRequest, NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

/**
 * Interfaccia per i dati di creazione categoria
 */
interface CreateCategoryData {
  name: string;
}

/**
 * GET /api/categories
 *
 * Recupera tutte le categorie dal database Supabase.
 * Le categorie vengono ordinate alfabeticamente per nome.
 *
 * @returns {Promise<NextResponse>} Response JSON con:
 *   - success: boolean - Indica se l'operazione è riuscita
 *   - data: Category[] - Array delle categorie
 *   - error?: string - Messaggio di errore (solo in caso di fallimento)
 *
 * */
export async function GET() {
  try {
    // Destructuring: estrae 'data' e lo rinomina 'categories', più 'error'
    // await: aspetta che la query finisca prima di continuare
    const { data: categories, error } = await supabase
      .from('categories') // Seleziona tabella 'categories'
      .select('*') // Prendi tutti i campi (*)
      .order('name', { ascending: true }); // Ordina per nome A-Z

    // Se c'è un errore, logga e ritorna un errore 500
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Errore nel recuperare le categorie', details: error.message },
        { status: 500 }
      );
    }

    // Ritorna le categorie come risposta JSON
    return NextResponse.json({
      success: true,
      data: categories,
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
 * POST /api/categories
 *
 * Crea una nuova categoria nel database.
 * Richiede autenticazione admin.
 *
 * @param {NextRequest} request - Oggetto richiesta HTTP con body JSON
 *
 * Body Parameters richiesti:
 * @param {string} name - Nome della categoria (deve essere univoco)
 *
 * @returns {Promise<NextResponse>} Response JSON con categoria creata
 *
 * @example
 * // Richiesta
 * POST /api/categories
 * {
 *   "name": "Attrezzature per Caffè"
 * }
 *
 * // Risposta di successo (201)
 * {
 *   "success": true,
 *   "data": {
 *     "id": "new-uuid-789",
 *     "name": "Attrezzature per Caffè",
 *     "created_at": "2024-08-04T15:20:00Z"
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Aggiungere controllo autenticazione admin
    // const session = await getServerSession();
    // if (!session || !isAdmin(session.user)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Parsing del body JSON
    const body: CreateCategoryData = await request.json();
    const { name } = body;

    // Validazione nome richiesto
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Nome categoria obbligatorio' },
        { status: 400 }
      );
    }

    // Verifica unicità del nome (case-insensitive)
    const { data: existingCategory, error: checkError } = await supabase
      .from('categories')
      .select('id')
      .ilike('name', name.trim()) // Case-insensitive like
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // Se errore diverso da "nessuna riga trovata"
      console.error('Check error:', checkError);
      return NextResponse.json(
        { error: 'Errore durante la verifica duplicati' },
        { status: 500 }
      );
    }

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Categoria con questo nome già esistente' },
        { status: 409 } // Conflict
      );
    }

    // Inserimento nuova categoria
    const { data: newCategory, error: insertError } = await supabase
      .from('categories')
      .insert([{ name: name.trim() }])
      .select('*')
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: 'Errore durante la creazione della categoria' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: newCategory,
      },
      { status: 201 } // Created
    );
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
