import React, { FC } from "react";

import CategoryBadge from "@/components/atoms/CategoryBadge";
import DateBadge from "@/components/atoms/DateBadge";
import MarkdownRenderer from "@/components/atoms/MarkdownRenderer";

import GuideCardProps from "./index.types";

/**
 * GuideCard - Componente per mostrare una card completa di una guida
 * 
 * Features:
 * - Rendering completo del contenuto markdown
 * - Badge categoria e data
 * - Effetti hover
 * - Layout responsive
 * 
 * @param guide - Oggetto guida con tutti i campi
 */
const GuideCard: FC<GuideCardProps> = ({ guide }) => {

  return (
    <div className="group cursor-pointer rounded-lg border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20">
      {/* Header con categoria e data */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex-1">
          {guide.categories && (
            <div className="mb-3">
              <CategoryBadge name={guide.categories.name} />
            </div>
          )}
          
          {/* Titolo */}
          <h3 className="mb-4 text-xl font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
            {guide.title}
          </h3>
        </div>
        
        <div className="ml-4 flex-shrink-0">
          <DateBadge date={guide.created_at} />
        </div>
      </div>

      {/* Contenuto markdown completo */}
      <div className="mb-6">
        <MarkdownRenderer 
          content={guide.content} 
          className="text-sm"
        />
      </div>

    </div>
  );
};

export default GuideCard;