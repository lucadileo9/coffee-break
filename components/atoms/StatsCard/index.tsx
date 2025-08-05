'use client';
import React, { useState, useEffect } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import StatsCardProps from './index.types';

/**
 * StatsCard - Componente atomico per mostrare statistiche
 * 
 * Features:
 * - Caricamento automatico dati da endpoint
 * - Loading state con skeleton
 * - Gestione errori
 * - Conteggio automatico array/oggetti
 */
export default function StatsCard({ title, description, endpoint }: StatsCardProps) {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        
        if (data.success && data.data) {
          setCount(Array.isArray(data.data) ? data.data.length : 1);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [endpoint]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? (
            <div className="animate-pulse bg-muted h-8 w-16 rounded"></div>
          ) : (
            count !== null ? count : '—'
          )}
        </div>
      </CardContent>
    </Card>
  );
}
