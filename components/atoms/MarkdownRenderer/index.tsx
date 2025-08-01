import React, { FC } from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * MarkdownRenderer - Componente per il rendering del contenuto markdown
 * 
 * Features:
 * - Rendering completo del markdown
 * - Stili personalizzati per elementi HTML
 * - Supporto per codice, link, liste, headers
 * - Responsive design
 * 
 * @param content - Contenuto markdown da renderizzare
 * @param className - Classi CSS aggiuntive
 */
const MarkdownRenderer: FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose prose-slate dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          // Personalizzazione degli headers
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mb-6 text-foreground border-b border-border pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mb-4 mt-8 text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground">
              {children}
            </h3>
          ),
          
          // Personalizzazione dei paragrafi
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-foreground">
              {children}
            </p>
          ),
          
          // Personalizzazione delle liste
          ul: ({ children }) => (
            <ul className="mb-4 ml-6 list-disc space-y-2 text-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-6 list-decimal space-y-2 text-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),
          
          // Personalizzazione dei link
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          
          // Personalizzazione del codice
          code: ({ children, className }) => {
            const isBlock = className?.includes('language-');
            
            if (isBlock) {
              return (
                <code className="block bg-muted p-4 rounded-lg text-sm overflow-x-auto border">
                  {children}
                </code>
              );
            }
            
            return (
              <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                {children}
              </code>
            );
          },
          
          // Personalizzazione delle citazioni
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          
          // Personalizzazione delle tabelle
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-border rounded-lg">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border px-4 py-2 bg-muted font-semibold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-2">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
