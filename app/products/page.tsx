'use client';


import ProductItem from '@/components/molecules/ProductItem';
import ProductsList from '@/components/organisms/ProductsList';
import { ProductWithCategory } from '@/types/products';

/**
 * Products Page - Pagina per visualizzare tutti i prodotti
 *
 * Features:
 * - Lista di tutti i prodotti
 * - Filtro per categoria
 * - Ricerca per nome
 * - Cards responsive
 * - Loading states
 * - Gestione errori
 */
// export default function ProductsPage() {
//   const [selectedCategory, setSelectedCategory] = useState<string>('');
//   const [searchTerm, setSearchTerm] = useState('');

//   // Hooks per dati
//   const { categories, loading: categoriesLoading } = useCategories();
//   const { products, loading: productsLoading, error } = useProducts(true, selectedCategory || undefined);

//   // Filtra prodotti per ricerca
//   const filteredProducts = products.filter(product =>
//     product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     product.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const isLoading = productsLoading || categoriesLoading;

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <SimpleTitle level="h1" className="text-center">
//             I Nostri Prodotti
//           </SimpleTitle>
//           <p className="text-center text-muted-foreground mt-2">
//             Scopri la nostra selezione di caffè e accessori
//           </p>
//         </div>

//         {/* Filtri */}
//         <div className="mb-8 flex flex-col sm:flex-row gap-4">
//           {/* Filtro categoria */}
//           <div className="w-full sm:w-64">
//             <Select
//               value={selectedCategory}
//               onValueChange={setSelectedCategory}
//               disabled={categoriesLoading}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Tutte le categorie" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="">Tutte le categorie</SelectItem>
//                 {categories.map((category) => (
//                   <SelectItem key={category.id} value={String(category.id)}>
//                     {category.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Ricerca */}
//           <div className="flex-1">
//             <input
//               type="text"
//               placeholder="Cerca prodotti..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full rounded-md border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
//             />
//           </div>
//         </div>

//         {/* Contenuto */}
//         {error ? (
//           <ErrorMessage
//             message={error}
//             variant="error"
//             showIcon={true}
//           />
//         ) : isLoading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {Array.from({ length: 6 }).map((_, index) => (
//               <LoadingSkeleton key={index} className="h-64" />
//             ))}
//           </div>
//         ) : filteredProducts.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-muted-foreground text-lg">
//               {searchTerm || selectedCategory
//                 ? 'Nessun prodotto trovato con i filtri selezionati'
//                 : 'Nessun prodotto disponibile'}
//             </p>
//           </div>
//         ) : (
//           <>
//             {/* Risultati */}
//             <div className="mb-4">
//               <p className="text-muted-foreground">
//                 {filteredProducts.length} prodotto{filteredProducts.length !== 1 ? 'i' : ''} 
//                 {searchTerm && ` per "${searchTerm}"`}
//                 {selectedCategory && ` nella categoria selezionata`}
//               </p>
//             </div>

//             {/* Grid prodotti */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredProducts.map((product) => (
//                 <ProductCard
//                   key={product.id}
//                   product={product}
//                   onClick={(product) => {
//                     console.warn('Clicked product:', product.name);
//                     // TODO: Navigate to product detail page
//                   }}
//                   showCategory={!selectedCategory} // Hide category if filtering by category
//                 />
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

export default function ProductsPage() {
  const products: ProductWithCategory[] = [
    {
      id: '1',
      name: 'Caffè Espresso',
      description: 'Un caffè espresso intenso e aromatico',
      price: 250,
      categories: {
        id: '1',
        name: 'Caffè',
        created_at: ''
      },
      created_at: String(new Date()),
      category_id: '1'
    },
    {
      id: '2',
      name: 'Caffè Americano',
      description: 'Un caffè lungo e delicato',
      price: 300,
      categories: {
        id: '1',
        name: 'Caffè',
        created_at: ''
      },
      created_at: String(new Date()),
      category_id: '1'
    },
    {
      id: '3',
      name: 'Moka',
      description: 'La classica moka italiana per un caffè perfetto',
      price: 2500,
      categories: {
        id: '2',
        name: 'Accessori',
        created_at: ''
      },
      created_at: String(new Date()),
      category_id: '2'
    }
  ];

  return (
    <div className="p-8">
      <h1>I Nostri Prodotti</h1>
      <ProductsList products={products} loading={true} error={null} onProductClick={function (product: ProductWithCategory): void {
        throw new Error('Function not implemented.');
      } } />
    </div>
  );
}

