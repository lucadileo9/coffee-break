import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

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
