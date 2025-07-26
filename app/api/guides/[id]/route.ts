import { NextRequest, NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    // Valida che l'ID sia presente
    if (!id) {
      return NextResponse.json(
        { error: 'ID guida richiesto' },
        { status: 400 }
      );
    }

    const { data: guide, error } = await supabase
      .from('guides')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .eq('id', id)
      .single(); // .single() per ottenere un singolo oggetto invece di array

    if (error) {
      console.error('Supabase error:', error);
      
      // Se l'errore è "not found", ritorna 404
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Guida non trovata' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: 'Errore nel recuperare la guida' },
        { status: 500 }
      );
    }

    if (!guide) {
      return NextResponse.json(
        { error: 'Guida non trovata' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: guide 
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}