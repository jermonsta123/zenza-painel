import React, { useState } from 'react';
import { Product } from '../../types/product';
import { formatKz } from '../../theme/tokens';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  ShoppingBag, 
  Star, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  Package, 
  Ruler, 
  MapPin, 
  CheckCircle2, 
  Eye, 
  Layers, 
  Sparkles,
  Heart
} from 'lucide-react';

interface PublicProductPreviewProps {
  product: Partial<Product>;
  viewMode?: 'card' | 'detail';
}

export const PublicProductPreview: React.FC<PublicProductPreviewProps> = ({
  product,
  viewMode: initialViewMode = 'card',
}) => {
  const [viewMode, setViewMode] = useState<'card' | 'detail'>(initialViewMode);
  const [selectedImage, setSelectedImage] = useState<string>(product.image || '');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');

  // Keep selected image in sync if product.image changes
  React.useEffect(() => {
    if (product.image && !selectedImage) {
      setSelectedImage(product.image);
    }
  }, [product.image, selectedImage]);

  const price = product.price || 0;
  const originalPrice = product.originalPrice;
  const discountPct =
    originalPrice && originalPrice > price && price > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const inStock = (product.stockCount ?? 0) > 0;
  const mainImg = selectedImage || product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="space-y-4">
      {/* Top Preview Control Switcher */}
      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[rgba(25,28,29,0.10)] shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-[#191c1d]">
            Pré-visualização da Loja Zenza Shop (Cliente)
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#f8f9fa] p-1 rounded-lg border border-[rgba(25,28,29,0.08)]">
          <button
            type="button"
            onClick={() => setViewMode('card')}
            className={`text-xs px-3 py-1 rounded-md font-semibold transition-all ${
              viewMode === 'card'
                ? 'bg-white text-[#a63500] shadow-xs'
                : 'text-[#191c1d]/60 hover:text-[#191c1d]'
            }`}
          >
            Vista Catálogo (Card)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('detail')}
            className={`text-xs px-3 py-1 rounded-md font-semibold transition-all ${
              viewMode === 'detail'
                ? 'bg-white text-[#a63500] shadow-xs'
                : 'text-[#191c1d]/60 hover:text-[#191c1d]'
            }`}
          >
            Página Completa (Detalhe)
          </button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="bg-[#f8f9fa] rounded-2xl p-4 sm:p-6 border border-[rgba(25,28,29,0.10)] flex justify-center">
        {viewMode === 'card' ? (
          /* ============================================================ */
          /* 1. PUBLIC PRODUCT CARD PREVIEW (CATALOG GRID VIEW)           */
          /* ============================================================ */
          <div className="w-full max-w-xs bg-white rounded-2xl border border-[rgba(25,28,29,0.12)] overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
            {/* Image & Badges */}
            <div className="relative aspect-square w-full bg-[#f4f4f5] overflow-hidden group">
              <img
                src={mainImg}
                alt={product.title || 'Produto Zenza'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Discount Tag */}
              {discountPct > 0 && (
                <div className="absolute top-2.5 left-2.5 bg-[#a63500] text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                  -{discountPct}%
                </div>
              )}

              {/* Stock Status Tag */}
              {!inStock && (
                <div className="absolute top-2.5 right-2.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  Esgotado
                </div>
              )}

              {/* Wishlist Icon */}
              <button
                type="button"
                className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 text-[#191c1d]/70 hover:text-[#a63500] flex items-center justify-center shadow-xs"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>

            {/* Card Content */}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#191c1d]/60">
                <span className="font-semibold text-[#a63500]">
                  {product.categoryName || 'Categoria'}
                </span>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{product.rating || 5.0}</span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-[#191c1d] line-clamp-2 leading-snug">
                {product.title || 'Nome do Produto'}
              </h4>

              {/* Pricing in Kwanza */}
              <div className="pt-1 flex items-baseline gap-2">
                <span className="text-base font-extrabold text-[#191c1d]">
                  {formatKz(price)}
                </span>
                {originalPrice && originalPrice > price && (
                  <span className="text-xs line-through text-[#191c1d]/40 font-medium">
                    {formatKz(originalPrice)}
                  </span>
                )}
              </div>

              {/* Add to Cart button */}
              <button
                type="button"
                disabled={!inStock}
                className={`w-full mt-2 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  inStock
                    ? 'bg-[#a63500] hover:bg-[#d04400] text-white shadow-xs'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                {inStock ? 'Adicionar ao Carrinho' : 'Indisponível'}
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* 2. PUBLIC PRODUCT DETAIL PAGE PREVIEW                        */
          /* ============================================================ */
          <div className="w-full max-w-4xl bg-white rounded-2xl border border-[rgba(25,28,29,0.12)] p-6 sm:p-8 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Visual Media & Thumbnails */}
              <div className="space-y-3">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#f4f4f5] border border-[rgba(25,28,29,0.1)]">
                  <img
                    src={mainImg}
                    alt={product.title || 'Foto do produto'}
                    className="w-full h-full object-cover"
                  />
                  {discountPct > 0 && (
                    <div className="absolute top-3 left-3 bg-[#a63500] text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-xs">
                      PROMOÇÃO -{discountPct}%
                    </div>
                  )}
                </div>

                {/* Thumbnails Gallery */}
                {((product.galleryImages && product.galleryImages.length > 0) || product.image) && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {product.image && (
                      <button
                        type="button"
                        onClick={() => setSelectedImage(product.image || '')}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                          selectedImage === product.image ? 'border-[#a63500]' : 'border-transparent opacity-70'
                        }`}
                      >
                        <img src={product.image} alt="Capa" className="w-full h-full object-cover" />
                      </button>
                    )}
                    {product.galleryImages?.map((img) => (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => setSelectedImage(img.url)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                          selectedImage === img.url ? 'border-[#a63500]' : 'border-transparent opacity-70'
                        }`}
                      >
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Title, Pricing, Selectors & CTAs */}
              <div className="space-y-5">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#a63500]">
                    {product.categoryName || 'Categoria'} {product.subcategoryName ? `• ${product.subcategoryName}` : ''}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#191c1d] tracking-tight">
                    {product.title || 'Título do Produto na Zenza Shop'}
                  </h2>
                  {product.subtitle && (
                    <p className="text-xs text-[#191c1d]/70 leading-relaxed">
                      {product.subtitle}
                    </p>
                  )}

                  {/* Rating summary */}
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="font-bold text-[#191c1d]">{product.rating || 5.0}</span>
                    <span className="text-[#191c1d]/50">({product.reviewCount || 0} avaliações)</span>
                    <span className="text-[#191c1d]/30">•</span>
                    <span className="text-xs text-[#191c1d]/60 font-mono">SKU: {product.sku || 'ZNZ-000'}</span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="p-4 bg-[#fff3ef] rounded-2xl border border-[#ffb59c]/50 flex items-baseline justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs text-[#a63500] font-semibold block">Preço Especial Zenza</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#191c1d]">
                        {formatKz(price)}
                      </span>
                      {originalPrice && originalPrice > price && (
                        <span className="text-sm line-through text-[#191c1d]/40 font-semibold">
                          {formatKz(originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {inStock ? (
                    <Badge variant="emerald" withDot>
                      {product.stockCount} em stock Luanda
                    </Badge>
                  ) : (
                    <Badge variant="red" withDot>
                      Esgotado
                    </Badge>
                  )}
                </div>

                {/* Color Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#191c1d]">
                        Cor Selecionada: <strong className="text-[#a63500]">{selectedColor || product.colors[0].name}</strong>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setSelectedColor(c.name)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                            (selectedColor || product.colors?.[0]?.name) === c.name
                              ? 'border-[#a63500] bg-[#fff3ef] text-[#a63500] ring-1 ring-[#a63500]'
                              : 'border-[rgba(25,28,29,0.12)] bg-white text-[#191c1d]'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20"
                            style={{ backgroundColor: c.hex }}
                          />
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && product.sizeCategory !== 'none' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#191c1d]">Tamanho</span>
                      {product.hasSizeGuide && (
                        <span className="text-[#a63500] hover:underline cursor-pointer flex items-center gap-1 font-semibold">
                          <Ruler className="w-3.5 h-3.5" />
                          Guia de Medidas
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSelectedSize(s)}
                          className={`min-w-10 px-3 py-2 rounded-xl border text-xs font-bold text-center transition-all ${
                            (selectedSize || product.sizes?.[0]) === s
                              ? 'border-[#a63500] bg-[#a63500] text-white'
                              : 'border-[rgba(25,28,29,0.15)] bg-white text-[#191c1d] hover:border-[#a63500]'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button: Multicaixa Express CTA */}
                <div className="space-y-2 pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={!inStock}
                    leftIcon={<CreditCard className="w-4 h-4" />}
                    className="text-sm font-bold"
                  >
                    {inStock ? 'Pagar com Multicaixa Express' : 'Produto Esgotado'}
                  </Button>
                  <p className="text-[11px] text-center text-[#191c1d]/60 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Pagamento 100% seguro via rede EMIS Angola e BAI Directo.
                  </p>
                </div>

                {/* Delivery Guarantee Info */}
                <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[rgba(25,28,29,0.08)] space-y-1.5 text-xs text-[#191c1d]/80">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#a63500]" />
                    <span className="font-bold text-[#191c1d]">Entrega Express em Luanda (24h - 48h)</span>
                  </div>
                  <p className="text-[11px] text-[#191c1d]/60">
                    Envios para Benguela, Huambo, Lubango e restantes províncias em 3-5 dias úteis.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Tabs / Description / Specs / Box Items */}
            <div className="pt-6 border-t border-[rgba(25,28,29,0.10)] space-y-6">
              {/* Description */}
              {product.description && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-[#191c1d] uppercase tracking-wider">
                    Descrição Detalhada
                  </h3>
                  <div className="text-xs text-[#191c1d]/80 leading-relaxed whitespace-pre-line bg-[#f8f9fa] p-4 rounded-xl border border-[rgba(25,28,29,0.06)]">
                    {product.description}
                  </div>
                </div>
              )}

              {/* Technical Specifications */}
              {product.specs && product.specs.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-[#191c1d] uppercase tracking-wider">
                    Ficha Técnica
                  </h3>
                  <div className="border border-[rgba(25,28,29,0.10)] rounded-xl overflow-hidden divide-y divide-[rgba(25,28,29,0.06)] text-xs">
                    {product.specs.map((spec) => (
                      <div key={spec.id} className="grid grid-cols-3 p-3 bg-white">
                        <span className="font-bold text-[#191c1d]">{spec.key}</span>
                        <span className="col-span-2 text-[#191c1d]/80">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Package Content */}
              {product.boxItems && product.boxItems.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-[#191c1d] uppercase tracking-wider">
                    O Que Está Incluído na Caixa
                  </h3>
                  <ul className="space-y-1 text-xs">
                    {product.boxItems.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-[#191c1d]/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#a63500]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
