export interface Pote {
  id: string;
  nome: string;
  categoria: 'Clássicos' | 'Premium' | 'Artesanais';
  descricao: string;
  preco: number;
  peso: string;
  sku: string;
  rating: number;
  reviews_count: number;
  imagem_url: string;
  origem: string;
  estoque: number;
  ativo: boolean;
}

export const POTES_MASTER_MAX: Pote[] = [
  { id: 'ana-maria', nome: 'Ana Maria', categoria: 'Clássicos', descricao: 'Tempero clássico mineiro', preco: 24.90, peso: '100g', sku: 'TZ-ANA-100', rating: 4.8, reviews_count: 45, imagem_url: '/potes/ana-maria-master-max.jpg', origem: 'Belo Horizonte, MG', estoque: 150, ativo: true },
  { id: 'temperaflix-tradicional', nome: 'Temperaflix Tradicional', categoria: 'Clássicos', descricao: 'Tempero versátil clássico', preco: 28.90, peso: '110g', sku: 'TZ-TEX-TRAD-110', rating: 4.8, reviews_count: 71, imagem_url: '/potes/temperaflix-tradicional-master-max.jpg', origem: 'Belo Horizonte, MG', estoque: 145, ativo: true }
];

export const getTotalPotes = (): number => {
  return POTES_MASTER_MAX.length;
};
