export interface CategoryDefinition {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subcategories: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export const CATEGORIES_CATALOG: CategoryDefinition[] = [
  {
    id: 'moda_feminina',
    name: 'Moda Feminina',
    slug: 'moda-feminina',
    description: 'Vestuário feminino casual, formal e tradicional angolano',
    subcategories: [
      { id: 'vestidos', name: 'Vestidos & Macacões', slug: 'vestidos' },
      { id: 'blusas_camisas', name: 'Blusas, Tops & Camisas', slug: 'blusas-camisas' },
      { id: 'saias_calcas', name: 'Saias & Calças', slug: 'saias-calcas' },
      { id: 'samakaka_tradicional', name: 'Trajes Tradicionais & Samakaka', slug: 'samakaka-tradicional' },
      { id: 'lingerie_praia', name: 'Lingerie & Moda Praia', slug: 'lingerie-praia' },
      { id: 'agasalhos_casacos', name: 'Casacos & Blazers', slug: 'casacos-blazers' },
    ],
  },
  {
    id: 'moda_masculina',
    name: 'Moda Masculina',
    slug: 'moda-masculina',
    description: 'Vestuário masculino do casual ao executivo',
    subcategories: [
      { id: 'camisas_polos', name: 'Camisas Linho & Polos', slug: 'camisas-polos' },
      { id: 'camisetas_tshirts', name: 'T-Shirts & Básicas', slug: 't-shirts' },
      { id: 'calcas_jeans', name: 'Calças Alfaiataria & Jeans', slug: 'calcas-jeans' },
      { id: 'fatos_blazers', name: 'Fatos Executivos & Blazers', slug: 'fatos-blazers' },
      { id: 'tradicional_africano', name: 'Camisas Tradicionais & Étnicas', slug: 'tradicional-africano' },
      { id: 'bermudas_shorts', name: 'Bermudas & Calções', slug: 'bermudas-shorts' },
    ],
  },
  {
    id: 'calcado',
    name: 'Calçado',
    slug: 'calcado',
    description: 'Calçado urbano, social, desportivo e casual',
    subcategories: [
      { id: 'sneakers_tenis', name: 'Sapatilhas & Sneakers', slug: 'sneakers-tenis' },
      { id: 'sapatos_sociais', name: 'Sapatos Sociais em Couro', slug: 'sapatos-sociais' },
      { id: 'sandalias_chinelos', name: 'Sandálias, Chinelos & Mules', slug: 'sandalias-chinelos' },
      { id: 'saltos_altos', name: 'Saltos Altos & Scarpins', slug: 'saltos-altos' },
      { id: 'botas_botins', name: 'Botas & Botins', slug: 'botas-botins' },
    ],
  },
  {
    id: 'acessorios_joalharia',
    name: 'Acessórios & Joalharia',
    slug: 'acessorios-joalharia',
    description: 'Relógios, joias, bolsas, óculos e marroquinaria',
    subcategories: [
      { id: 'relogios_homem_mulher', name: 'Relógios Masculinos & Femininos', slug: 'relogios' },
      { id: 'oculos_sol', name: 'Óculos de Sol Proteção UV', slug: 'oculos-sol' },
      { id: 'bolsas_mochilas', name: 'Bolsas de Mão & Mochilas', slug: 'bolsas-mochilas' },
      { id: 'carteiras_cintos', name: 'Carteiras & Cintos em Couro', slug: 'carteiras-cintos' },
      { id: 'joias_bijuteria', name: 'Colares, Pulseiras & Brincos', slug: 'joias-bijuteria' },
    ],
  },
  {
    id: 'beleza_perfumaria',
    name: 'Beleza & Perfumaria',
    slug: 'beleza-perfumaria',
    description: 'Perfumaria internacional, maquilhagem e cuidados corporais',
    subcategories: [
      { id: 'perfumes_originais', name: 'Perfumes Masculinos & Femininos', slug: 'perfumes' },
      { id: 'cuidados_pele', name: 'Skincare & Protetores Solares', slug: 'cuidados-pele' },
      { id: 'maquilhagem', name: 'Maquilhagem & Acessórios', slug: 'maquilhagem' },
      { id: 'cabelos_tratamento', name: 'Tratamentos Capilares & Óleos', slug: 'cabelos' },
    ],
  },
  {
    id: 'eletronica_gadgets',
    name: 'Eletrónica & Gadgets',
    slug: 'eletronica-gadgets',
    description: 'Acessórios de smartphones, áudio e wearables',
    subcategories: [
      { id: 'smartphones_tablets', name: 'Smartphones & Tablets', slug: 'smartphones' },
      { id: 'audio_fones', name: 'Auriculares Bluetooth & Colunas', slug: 'audio' },
      { id: 'smartwatches_bands', name: 'Smartwatches & Fitbands', slug: 'smartwatches' },
      { id: 'cabos_carregadores', name: 'Powerbanks & Carregadores Rápidos', slug: 'carregadores' },
    ],
  },
  {
    id: 'casa_decoracao',
    name: 'Casa & Decoração',
    slug: 'casa-decoracao',
    description: 'Artigos para o lar, têxteis e pequenas utilidades',
    subcategories: [
      { id: 'texteis_cama_banho', name: 'Lençóis, Almofadas & Toalhas', slug: 'texteis-lar' },
      { id: 'decoracao_artesanato', name: 'Quadros, Velas & Peças de Arte', slug: 'decoracao' },
      { id: 'utensilios_cozinha', name: 'Copos, Talheres & Cafeteiras', slug: 'cozinha' },
    ],
  },
];
