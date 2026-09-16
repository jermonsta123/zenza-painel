import React, { useState, useEffect, useMemo } from 'react';
import { Product, ProductFormErrors, GalleryImage, ProductSpec, ProductColor, SizeCategory, ProductStatus, ProductDimensions } from '../types/product';
import { useCategories } from '../context/CategoriesContext';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { FormField } from '../components/ui/FormField';
import { Input } from '../components/ui/Input';
import { Textarea, Switch } from '../components/ui/FormControls';
import { Modal, ConfirmDialog } from '../components/ui/Modal';
import { useToast } from '../context/ToastContext';
import { CategorySelector } from '../components/products/CategorySelector';
import { PricingDiscountCalculator } from '../components/products/PricingDiscountCalculator';
import { ImageGalleryManager } from '../components/products/ImageGalleryManager';
import { DimensionsEditor } from '../components/products/DimensionsEditor';
import { SpecsKeyValEditor } from '../components/products/SpecsKeyValEditor';
import { BoxItemsEditor } from '../components/products/BoxItemsEditor';
import { VariantsEditor } from '../components/products/VariantsEditor';
import { PublicProductPreview } from '../components/products/PublicProductPreview';
import { formatKz } from '../theme/tokens';
import { 
  ArrowLeft, 
  Save, 
  Globe, 
  Eye, 
  AlertCircle, 
  CheckCircle2, 
  Boxes, 
  Sparkles, 
  Tag, 
  DollarSign, 
  Image as ImageIcon, 
  FileText, 
  Sliders, 
  Share2, 
  HelpCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Box,
  Ruler,
  Wand2
} from 'lucide-react';

interface ProductFormViewProps {
  initialProduct?: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const DEFAULT_EMPTY_PRODUCT: Product = {
  id: '',
  title: '',
  subtitle: '',
  slug: '',
  sku: '',
  category: '',
  categoryName: '',
  subcategory: '',
  subcategoryName: '',
  price: 0,
  originalPrice: undefined,
  discountPct: 0,
  costPrice: undefined,
  image: '',
  galleryImages: [],
  stockCount: 10,
  inStock: true,
  lowStockThreshold: 5,
  trackInventory: true,
  description: '',
  specs: [],
  boxItems: [],
  dimensions: {
    weightKg: 0.5,
    lengthCm: 30,
    widthCm: 20,
    heightCm: 8,
    packageType: 'Caixa Standard Zenza',
  },
  colors: [],
  hasSizeGuide: false,
  sizeCategory: 'none',
  sizes: [],
  status: 'draft',
  rating: 5.0,
  reviewCount: 0,
  affiliateCommission: 8,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};


export const ProductFormView: React.FC<ProductFormViewProps> = ({
  initialProduct,
  onSave,
  onCancel,
}) => {
  const { success, warning, error: toastError, info } = useToast();
  const { categories } = useCategories();
  const isEditMode = Boolean(initialProduct && initialProduct.id);

  // Core Product State
  const [formData, setFormData] = useState<Product>(() => {
    if (initialProduct) {
      return { ...initialProduct };
    }
    return {
      ...DEFAULT_EMPTY_PRODUCT,
      id: `prod-${Date.now()}`,
      sku: `ZNZ-${Math.floor(100 + Math.random() * 900)}`,
    };
  });

  // Active section tab for scrolling or navigation
  const [activeSection, setActiveSection] = useState<string>('basic');
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Modals
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [showZeroStockConfirmModal, setShowZeroStockConfirmModal] = useState(false);
  const [showUnpublishConfirmModal, setShowUnpublishConfirmModal] = useState(false);

  // Auto-generate slug and SKU if in creation mode
  useEffect(() => {
    if (!isEditMode && formData.title && !formData.slug) {
      const generatedSlug = formData.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, isEditMode, formData.slug]);

  // Track field changes
  const updateField = <K extends keyof Product>(field: K, value: Product[K]) => {
    setIsDirty(true);
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // If stock changes, auto update inStock
      if (field === 'stockCount') {
        const count = typeof value === 'number' ? value : 0;
        updated.inStock = count > 0;
      }
      return updated;
    });

    // Clear field-level error if present
    if (errors[field as keyof ProductFormErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof ProductFormErrors];
        return next;
      });
    }
  };

  // Validation Matrix
  const validateForm = (isPublishing: boolean): boolean => {
    const newErrors: ProductFormErrors = {};

    // 1. Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'O título do produto é obrigatório.';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'O título deve ter pelo menos 3 caracteres descritivos.';
    }

    // 2. Category & Subcategory validation
    if (!formData.category) {
      newErrors.category = 'A categoria principal é obrigatória.';
    } else {
      const catObj = categories.find((c) => c.id === formData.category);
      if (catObj && catObj.subcategories.length > 0 && !formData.subcategory) {
        newErrors.subcategory = `Selecione uma subcategoria de ${catObj.name}.`;
      }
    }

    // 3. Price validation
    if (formData.price <= 0) {
      newErrors.price = 'O preço de venda em Kwanza deve ser superior a zero.';
    }
    if (formData.originalPrice !== undefined && formData.originalPrice <= formData.price) {
      newErrors.originalPrice = 'O preço anterior riscado deve ser maior que o preço de venda.';
    }

    // 4. SKU validation
    if (!formData.sku.trim()) {
      newErrors.sku = 'O código SKU é obrigatório para controlo de inventário.';
    }

    // 5. Strict Publishing Requirements
    if (isPublishing) {
      if (!formData.image.trim()) {
        newErrors.image = 'Uma imagem principal de capa é obrigatória para publicar o produto na loja.';
      }
      if (!formData.description.trim()) {
        newErrors.description = 'A descrição do produto é recomendada antes da publicação.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSaveProduct = (targetStatus: ProductStatus) => {
    const isPublishing = targetStatus === 'published';
    const isValid = validateForm(isPublishing);

    if (!isValid) {
      toastError(
        'Erros no Formulário',
        'Por favor, corrija os campos assinalados a vermelho antes de avançar.'
      );
      return;
    }

    // Check if publishing with zero stock
    if (isPublishing && formData.stockCount === 0) {
      setShowZeroStockConfirmModal(true);
      return;
    }

    executeSave(targetStatus);
  };

  const executeSave = (targetStatus: ProductStatus) => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const updatedProduct: Product = {
        ...formData,
        status: targetStatus,
        inStock: formData.stockCount > 0,
        updatedAt: new Date().toISOString(),
        publishedAt:
          targetStatus === 'published' && !formData.publishedAt
            ? new Date().toISOString()
            : formData.publishedAt,
      };

      onSave(updatedProduct);
      setIsDirty(false);

      if (targetStatus === 'published') {
        success('Produto Publicado!', `"${formData.title}" está agora visível na Zenza Shop.`);
      } else if (targetStatus === 'draft') {
        info('Rascunho Guardado', `"${formData.title}" foi guardado como rascunho com sucesso.`);
      } else {
        warning('Produto Despublicado', `"${formData.title}" foi arquivado e ocultado do catálogo.`);
      }
    }, 450);
  };

  // Handle Unpublish
  const handleUnpublish = () => {
    setShowUnpublishConfirmModal(false);
    executeSave('archived');
  };

  // Unsaved Changes Navigation Protection
  const handleCancelClick = () => {
    if (isDirty) {
      setShowUnsavedChangesModal(true);
    } else {
      onCancel();
    }
  };

  // Test Server Error Simulation (Proving state preservation and resilience)
  const handleSimulateServerError = (statusCode: number) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (statusCode === 403) {
        toastError('Erro 403: Permissão Negada', 'O teu perfil de operador não tem permissão para alterar preços acima de 1.000.000 Kz. Os teus dados foram preservados no formulário.');
      } else {
        toastError('Erro 500: Falha no Servidor', 'Falha temporária de comunicação com a base de dados. Todos os dados inseridos continuam intactos para nova tentativa.');
      }
    }, 400);
  };

  const sectionsList = [
    { id: 'basic', label: '1. Informações Básicas', icon: FileText },
    { id: 'category', label: '2. Categoria & Taxonomia', icon: Tag },
    { id: 'pricing', label: '3. Preços & Descontos', icon: DollarSign },
    { id: 'media', label: '4. Imagens & Galeria', icon: ImageIcon },
    { id: 'stock', label: '5. Stock & Armazém', icon: Boxes },
    { id: 'description', label: '6. Descrição do Produto', icon: FileText },
    { id: 'dimensions', label: '7. Dimensões & Logística', icon: Box },
    { id: 'specs', label: '8. Ficha Técnica & Caixa', icon: Sliders },
    { id: 'variants', label: '9. Cores & Tamanhos', icon: Sparkles },
    { id: 'preview', label: '10. Pré-visualização Loja', icon: Eye },
  ];

  const handleApplyDescriptionTemplate = (type: 'moda' | 'calcado' | 'relogio' | 'gadget' | 'clear') => {
    if (type === 'clear') {
      updateField('description', '');
      return;
    }
    const templates: Record<string, string> = {
      moda: `[Visão Geral do Produto]
Peça confeccionada com tecidos nobres e acabamentos de alfaiataria para garantir frescura, mobilidade e elegância nos dias quentes e noites de Angola.

[Destaques e Características]
- Corte estruturado com caimento impecável
- Fibras respiráveis com toque suave na pele
- Costuras duplas reforçadas para máxima durabilidade

[Ocasiões Recomendadas]
Ideal para reuniões executivas, saídas sociais ao fim de semana ou cerimónias formais.`,
      calcado: `[Design & Conforto Ergonómico]
Calçado concebido para aliar estética contemporânea e absorção de impacto em pisos urbanos.

[Materiais e Construção]
- Cabedal resistente com acabamento premium
- Palmilha acolchoada anatómica com amortecimento
- Sola em borracha vulcanizada antiderrapante de alta tração

[Cuidados de Conservação]
Limpar com pano macio levemente humedecido e sabão neutro; secar à sombra.`,
      relogio: `[Precisão & Distinção Zenza]
Acessório de alta precisão com acabamento sofisticado para complementar qualquer composição com classe.

[Especificações Notáveis]
- Mostrador protegido com cristal temperado resistente a riscos
- Fecho seguro em aço inoxidável
- Pulseira confortável e ajustável

[Acompanhamento]
Entregue em estojo acolchoado Zenza Shop com cartão de autenticidade.`,
      gadget: `[Tecnologia & Desempenho]
Equipamento desenvolvido com tecnologia atual para otimizar o seu dia a dia com fiabilidade e autonomia.

[Recursos Principais]
- Bateria de longa duração com recarga rápida
- Estrutura leve, portátil e resistente
- Operação simples e compatibilidade imediata`,
    };

    updateField('description', templates[type] || '');
    info('Esqueleto Carregado', 'Estrutura de descrição inserida. Pode agora personalizar com os dados deste produto.');
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Sticky Top Bar with Product Status and Core Actions */}
      <div className="sticky top-14 z-20 bg-white/95 backdrop-blur-md border border-[rgba(25,28,29,0.12)] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancelClick}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Voltar
          </Button>

          <div className="h-5 w-px bg-[rgba(25,28,29,0.12)]" />

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#191c1d] truncate max-w-xs sm:max-w-md">
                {formData.title || (isEditMode ? 'Editar Produto' : 'Novo Produto Zenza Shop')}
              </h2>
              <Badge
                variant={
                  formData.status === 'published'
                    ? 'emerald'
                    : formData.status === 'draft'
                    ? 'amber'
                    : 'neutral'
                }
                size="sm"
                withDot
              >
                {formData.status === 'published'
                  ? 'Publicado'
                  : formData.status === 'draft'
                  ? 'Rascunho'
                  : 'Despublicado'}
              </Badge>
            </div>
            {isDirty && (
              <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" /> Alterações por guardar
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Draft Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSaveProduct('draft')}
            isLoading={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Guardar Rascunho
          </Button>

          {/* Unpublish Button (if published) */}
          {formData.status === 'published' && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setShowUnpublishConfirmModal(true)}
              disabled={isSubmitting}
            >
              Despublicar
            </Button>
          )}

          {/* Publish / Update Button */}
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => handleSaveProduct('published')}
            isLoading={isSubmitting}
            leftIcon={<Globe className="w-4 h-4" />}
          >
            {formData.status === 'published' ? 'Atualizar na Loja' : 'Publicar Produto'}
          </Button>
        </div>
      </div>

      {/* Global Validation Error Summary Banner */}
      {Object.keys(errors).length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-red-700">
            <AlertTriangle className="w-4 h-4" />
            <span>Existem {Object.keys(errors).length} pendências que impedem a gravação:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-red-800/90 pl-1">
            {Object.entries(errors).map(([key, msg]) => (
              <li key={key}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Layout Split: Sticky Navigation Rail (Left) + Form Sections (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Rail / Section Jump Links */}
        <div className="lg:col-span-3 space-y-3 sticky top-36">
          <Card padding="none" className="p-2">
            <div className="p-2 border-b border-[rgba(25,28,29,0.06)]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#191c1d]/50">
                Seções do Formulário
              </span>
            </div>
            <nav className="space-y-1 p-1">
              {sectionsList.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => {
                      setActiveSection(sec.id);
                      document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                      isActive
                        ? 'bg-[#fff3ef] text-[#a63500] font-bold shadow-2xs'
                        : 'text-[#191c1d]/75 hover:bg-[#f8f9fa] hover:text-[#191c1d]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#a63500]' : 'text-[#191c1d]/50'}`} />
                    <span>{sec.label}</span>
                  </button>
                );
              })}
            </nav>
          </Card>

          {/* Controlled / Audit Metadata Box */}
          <Card className="space-y-2.5 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#191c1d]/50 block">
              Controlo & Auditoria
            </span>
            <div className="space-y-1.5 text-[11px] text-[#191c1d]/70">
              <div className="flex justify-between">
                <span>Avaliação Média:</span>
                <span className="font-bold text-amber-600">{formData.rating} ★ ({formData.reviewCount} avaliações)</span>
              </div>
              <div className="flex justify-between">
                <span>Comissão Afiliados:</span>
                <span className="font-semibold text-emerald-700">{formData.affiliateCommission}% (Zenza Partners)</span>
              </div>
              <div className="flex justify-between">
                <span>Criado em:</span>
                <span>{new Date(formData.createdAt).toLocaleDateString('pt-AO')}</span>
              </div>
            </div>

            {/* Simulated Server Error Test Buttons for Quality Assurance */}
            <div className="pt-2 border-t border-[rgba(25,28,29,0.06)] space-y-1.5">
              <span className="text-[10px] text-[#191c1d]/40 block">Teste de Resiliência:</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSimulateServerError(403)}
                  className="text-[10px] bg-red-50 text-red-700 hover:bg-red-100 p-1 rounded font-medium text-center"
                >
                  Testar Erro 403
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateServerError(500)}
                  className="text-[10px] bg-gray-100 text-gray-700 hover:bg-gray-200 p-1 rounded font-medium text-center"
                >
                  Testar Erro 500
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Form Fields Container (Right 9 Cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* SECTION 1: INFORMAÇÕES BÁSICAS */}
          <Card id="basic">
            <CardHeader>
              <CardTitle>1. Informações Básicas do Produto</CardTitle>
              <CardDescription>
                Identificação principal exibida nas pesquisas e títulos da Zenza Shop.
              </CardDescription>
            </CardHeader>

            <div className="space-y-4">
              <FormField
                id="product-title"
                label="Título do Produto"
                required
                error={errors.title}
                hint="Nome claro e descritivo (ex: Camisa Linho Luanda Slim Fit)"
              >
                <Input
                  id="product-title"
                  placeholder="Ex: Camisa Linho Luanda Slim Fit"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  error={errors.title}
                />
              </FormField>

              <FormField
                id="product-subtitle"
                label="Subtítulo / Destaque Curto (Opcional)"
                hint="Frase de impacto que aparece logo abaixo do título na página do produto"
              >
                <Input
                  id="product-subtitle"
                  placeholder="Ex: 100% Linho puro respirável com corte contemporâneo para o clima tropical"
                  value={formData.subtitle || ''}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  id="product-sku"
                  label="Código SKU"
                  required
                  error={errors.sku}
                  hint="Identificador único para gestão de armazém"
                >
                  <Input
                    id="product-sku"
                    placeholder="ZNZ-000-XXX"
                    value={formData.sku}
                    onChange={(e) => updateField('sku', e.target.value.toUpperCase())}
                    error={errors.sku}
                    className="font-mono uppercase"
                  />
                </FormField>

                <FormField
                  id="product-slug"
                  label="Slug da URL (SEO)"
                  hint="Caminho amigável da página na loja"
                >
                  <Input
                    id="product-slug"
                    placeholder="camisa-linho-luanda"
                    value={formData.slug}
                    onChange={(e) => updateField('slug', e.target.value)}
                    className="font-mono text-xs text-[#191c1d]/70"
                  />
                </FormField>
              </div>
            </div>
          </Card>

          {/* SECTION 2: CATEGORIA & CLASSIFICAÇÃO */}
          <Card id="category">
            <CardHeader>
              <CardTitle>2. Categoria e Classificação Oficial</CardTitle>
              <CardDescription>
                Enquadramento do produto na taxonomia oficial do catálogo Zenza Shop.
              </CardDescription>
            </CardHeader>

            <CategorySelector
              category={formData.category}
              subcategory={formData.subcategory}
              onChangeCategory={(catId, catName) => {
                setIsDirty(true);
                setFormData((prev) => ({
                  ...prev,
                  category: catId,
                  categoryName: catName,
                }));
              }}
              onChangeSubcategory={(subId, subName) => {
                setIsDirty(true);
                setFormData((prev) => ({
                  ...prev,
                  subcategory: subId,
                  subcategoryName: subName,
                }));
              }}
              errors={{
                category: errors.category,
                subcategory: errors.subcategory,
              }}
            />
          </Card>

          {/* SECTION 3: PREÇO & PROMOÇÃO */}
          <Card id="pricing">
            <CardHeader>
              <CardTitle>3. Preço e Promoção em Kwanza (AOA)</CardTitle>
              <CardDescription>
                Configuração de valor de venda, promoções com preço riscado e margens operacionais.
              </CardDescription>
            </CardHeader>

            <PricingDiscountCalculator
              price={formData.price}
              originalPrice={formData.originalPrice}
              costPrice={formData.costPrice}
              onChangePrice={(val) => updateField('price', val)}
              onChangeOriginalPrice={(val) => updateField('originalPrice', val)}
              onChangeCostPrice={(val) => updateField('costPrice', val)}
              errors={{
                price: errors.price,
                originalPrice: errors.originalPrice,
              }}
            />
          </Card>

          {/* SECTION 4: IMAGENS & GALERIA */}
          <Card id="media">
            <CardHeader>
              <CardTitle>4. Imagens e Galeria Multimédia</CardTitle>
              <CardDescription>
                Foto de capa obrigatória para publicação e galeria de ângulos adicionais com pré-visualização.
              </CardDescription>
            </CardHeader>

            <ImageGalleryManager
              mainImage={formData.image}
              galleryImages={formData.galleryImages}
              onChangeMainImage={(url) => updateField('image', url)}
              onChangeGalleryImages={(images) => updateField('galleryImages', images)}
              error={errors.image}
            />
          </Card>

          {/* SECTION 5: STOCK & INVENTÁRIO */}
          <Card id="stock">
            <CardHeader>
              <CardTitle>5. Gestão de Stock e Armazém</CardTitle>
              <CardDescription>
                Controlo de unidades físicas disponíveis para entrega em Luanda e províncias.
              </CardDescription>
            </CardHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  id="product-stock"
                  label="Quantidade em Stock"
                  required
                  error={errors.stockCount}
                  hint="Unidades físicas disponíveis no armazém"
                >
                  <Input
                    id="product-stock"
                    type="number"
                    min={0}
                    step={1}
                    value={formData.stockCount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      updateField('stockCount', isNaN(val) ? 0 : Math.max(0, val));
                    }}
                    rightElement={<span className="text-xs font-semibold text-[#191c1d]/60">unidades</span>}
                  />
                </FormField>

                <FormField
                  id="product-low-stock-threshold"
                  label="Alerta de Stock Baixo"
                  hint="Dispara notificação quando o stock atingir este limite"
                >
                  <Input
                    id="product-low-stock-threshold"
                    type="number"
                    min={1}
                    value={formData.lowStockThreshold}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      updateField('lowStockThreshold', isNaN(val) ? 5 : Math.max(1, val));
                    }}
                    rightElement={<span className="text-xs font-semibold text-[#191c1d]/60">unid. mínimas</span>}
                  />
                </FormField>
              </div>

              {/* Zero stock alert pill */}
              {formData.stockCount === 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Produto com Stock Zero (Esgotado)</span>
                    <p className="text-amber-800/80 mt-0.5">
                      O produto será exibido na loja com o badge "Esgotado" e o botão de compra ficará desativado até nova reposição de stock.
                    </p>
                  </div>
                </div>
              )}

              {/* Track Inventory Switch */}
              <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[rgba(25,28,29,0.08)]">
                <Switch
                  id="track-inventory-switch"
                  label="Controlo Estrito de Inventário"
                  description="Deduz automaticamente uma unidade a cada pedido pago com Multicaixa Express ou BAI Directo."
                  checked={formData.trackInventory}
                  onChange={(e) => updateField('trackInventory', e.target.checked)}
                />
              </div>
            </div>
          </Card>

          {/* SECTION 6: DESCRIÇÃO INDIVIDUAL DO PRODUTO */}
          <Card id="description">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle>6. Descrição Individual do Produto</CardTitle>
                  <CardDescription>
                    Cada produto tem a sua própria descrição detalhada sobre corte, materiais, estilo e ocasiões de uso.
                  </CardDescription>
                </div>
                {/* Assistant template pills */}
                <div className="flex flex-wrap items-center gap-1.5 bg-[#f8f9fa] p-1.5 rounded-xl border border-[rgba(25,28,29,0.08)]">
                  <span className="text-[10px] font-bold text-[#a63500] flex items-center gap-1 px-1">
                    <Wand2 className="w-3 h-3" />
                    Modelos Rápidos:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleApplyDescriptionTemplate('moda')}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[rgba(25,28,29,0.10)] font-medium hover:text-[#a63500]"
                  >
                    Moda
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyDescriptionTemplate('calcado')}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[rgba(25,28,29,0.10)] font-medium hover:text-[#a63500]"
                  >
                    Calçado
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyDescriptionTemplate('relogio')}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[rgba(25,28,29,0.10)] font-medium hover:text-[#a63500]"
                  >
                    Acessórios
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyDescriptionTemplate('gadget')}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[rgba(25,28,29,0.10)] font-medium hover:text-[#a63500]"
                  >
                    Eletrónica
                  </button>
                  {formData.description && (
                    <button
                      type="button"
                      onClick={() => handleApplyDescriptionTemplate('clear')}
                      className="text-[10px] px-1.5 py-0.5 rounded-md text-red-600 hover:bg-red-50 font-semibold ml-1"
                    >
                      Limpar
                    </button>
                  )}
                </div>
              </div>
            </CardHeader>

            <div className="space-y-4">
              <FormField
                id="product-description"
                label="Texto Descritivo do Produto"
                error={errors.description}
                hint={`${formData.description.length} caracteres • Escreva um texto específico e persuasivo para este produto`}
              >
                <Textarea
                  id="product-description"
                  rows={6}
                  placeholder="Descreva detalhadamente a qualidade deste produto, caimento, tecidos ou materiais, sensações ao vestir ou usar e recomendações específicas..."
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  error={errors.description}
                />
              </FormField>
            </div>
          </Card>

          {/* SECTION 7: DIMENSÕES & LOGÍSTICA DE ENTREGA */}
          <Card id="dimensions">
            <CardHeader>
              <CardTitle>7. Dimensões Físicas & Peso (Logística Zenza Express)</CardTitle>
              <CardDescription>
                Cada produto possui as suas próprias medidas e peso para cálculo de frete, etiquetas de despacho e manuseio no armazém.
              </CardDescription>
            </CardHeader>

            <DimensionsEditor
              dimensions={formData.dimensions}
              onChange={(updatedDims) => updateField('dimensions', updatedDims)}
              error={errors.dimensions}
            />
          </Card>

          {/* SECTION 8: FICHA TÉCNICA & ITENS DA CAIXA */}
          <Card id="specs">
            <CardHeader>
              <CardTitle>8. Especificações Técnicas e Conteúdo da Embalagem</CardTitle>
              <CardDescription>
                Tabela de especificações chave-valor e lista de itens que acompanham o artigo na caixa.
              </CardDescription>
            </CardHeader>

            <div className="space-y-6">
              {/* Technical Specifications */}
              <SpecsKeyValEditor
                specs={formData.specs}
                onChange={(updatedSpecs) => updateField('specs', updatedSpecs)}
              />

              {/* Box Items */}
              <div className="pt-2">
                <BoxItemsEditor
                  boxItems={formData.boxItems}
                  onChange={(updatedBox) => updateField('boxItems', updatedBox)}
                />
              </div>
            </div>
          </Card>

          {/* SECTION 9: VARIANTES */}
          <Card id="variants">
            <CardHeader>
              <CardTitle>9. Variantes de Cor e Tamanho</CardTitle>
              <CardDescription>
                Amostras visuais de cores (*swatches*) e tabela de medidas para seleção do cliente.
              </CardDescription>
            </CardHeader>

            <VariantsEditor
              colors={formData.colors}
              onChangeColors={(cols) => updateField('colors', cols)}
              sizes={formData.sizes}
              onChangeSizes={(s) => updateField('sizes', s)}
              sizeCategory={formData.sizeCategory}
              onChangeSizeCategory={(cat) => updateField('sizeCategory', cat)}
              hasSizeGuide={formData.hasSizeGuide}
              onChangeHasSizeGuide={(has) => updateField('hasSizeGuide', has)}
            />
          </Card>

          {/* SECTION 10: PRÉ-VISUALIZAÇÃO PÚBLICA EM TEMPO REAL */}
          <Card id="preview">
            <CardHeader>
              <CardTitle>10. Pré-visualização na Loja Zenza Shop</CardTitle>
              <CardDescription>
                Veja exatamente como este produto, com a sua descrição própria e dimensões, será renderizado para os clientes da loja.
              </CardDescription>
            </CardHeader>

            <PublicProductPreview product={formData} />
          </Card>
        </div>
      </div>

      {/* MODAL 1: Confirm Unsaved Changes on Navigation */}
      <ConfirmDialog
        isOpen={showUnsavedChangesModal}
        onClose={() => setShowUnsavedChangesModal(false)}
        onConfirm={() => {
          setShowUnsavedChangesModal(false);
          onCancel();
        }}
        title="Descartar Alterações Não Guardadas?"
        description="Tens alterações por guardar neste produto. Se saíres agora, todas as modificações recentes serão perdidas."
        confirmLabel="Sim, Descartar e Sair"
        cancelLabel="Continuar a Editar"
        variant="destructive"
      />

      {/* MODAL 2: Confirm Publishing with 0 Stock */}
      <ConfirmDialog
        isOpen={showZeroStockConfirmModal}
        onClose={() => setShowZeroStockConfirmModal(false)}
        onConfirm={() => {
          setShowZeroStockConfirmModal(false);
          executeSave('published');
        }}
        title="Publicar Produto Sem Stock?"
        description="Este produto tem 0 unidades em armazém. Será publicado na Zenza Shop com o estado 'Esgotado', não permitindo pagamentos imediatos. Desejas prosseguir?"
        confirmLabel="Publicar como Esgotado"
        cancelLabel="Rever Stock"
        variant="warning"
      />

      {/* MODAL 3: Confirm Unpublishing */}
      <ConfirmDialog
        isOpen={showUnpublishConfirmModal}
        onClose={() => setShowUnpublishConfirmModal(false)}
        onConfirm={handleUnpublish}
        title="Despublicar Produto?"
        description={`"${formData.title}" deixará de aparecer na loja e nas pesquisas dos clientes. Poderás reativá-lo a qualquer momento.`}
        confirmLabel="Sim, Despublicar"
        cancelLabel="Cancelar"
        variant="warning"
      />
    </div>
  );
};
