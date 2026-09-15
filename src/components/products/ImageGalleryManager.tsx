import React, { useState, useRef } from 'react';
import { GalleryImage } from '../../types/product';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { FormField } from '../ui/FormField';
import { Modal, ConfirmDialog } from '../ui/Modal';
import { useToast } from '../../context/ToastContext';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Trash2, 
  Star, 
  ArrowUp, 
  ArrowDown, 
  Link as LinkIcon, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  FileText,
  Eye,
  Sparkles
} from 'lucide-react';

interface ImageGalleryManagerProps {
  mainImage: string;
  galleryImages: GalleryImage[];
  onChangeMainImage: (url: string) => void;
  onChangeGalleryImages: (images: GalleryImage[]) => void;
  error?: string;
  disabled?: boolean;
}

export const ImageGalleryManager: React.FC<ImageGalleryManagerProps> = ({
  mainImage,
  galleryImages,
  onChangeMainImage,
  onChangeGalleryImages,
  error,
  disabled = false,
}) => {
  const { success, warning, error: toastError, info } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [targetSlot, setTargetSlot] = useState<'main' | 'gallery'>('main');

  // Image deletion confirmation
  const [imageToDelete, setImageToDelete] = useState<{ id: string; name: string } | null>(null);

  // Simulated upload with real progress intervals and storage validation
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toastError('Ficheiro Muito Grande', 'A imagem deve ter no máximo 5MB para otimizar o carregamento na loja.');
      return;
    }

    // Validate format
    const validFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!validFormats.includes(file.type)) {
      toastError('Formato Inválido', 'Formatos aceites: JPG, PNG, WEBP ou AVIF.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    // Create local object URL for instant preview
    const objectUrl = URL.createObjectURL(file);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);

            if (targetSlot === 'main') {
              onChangeMainImage(objectUrl);
              success('Imagem Principal Carregada', `${file.name} foi definida como destaque do produto.`);
            } else {
              const newGalleryItem: GalleryImage = {
                id: `img-${Date.now()}`,
                url: objectUrl,
                name: file.name,
                sizeBytes: file.size,
                order: galleryImages.length + 1,
              };
              onChangeGalleryImages([...galleryImages, newGalleryItem]);
              success('Imagem Adicionada à Galeria', `${file.name} guardada com sucesso.`);
            }
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const handleAddUrlImage = () => {
    if (!urlInput.trim()) return;
    try {
      new URL(urlInput);
    } catch {
      toastError('URL Inválido', 'Insira um endereço URL válido iniciando por https://');
      return;
    }

    if (targetSlot === 'main') {
      onChangeMainImage(urlInput.trim());
      success('Imagem Atualizada', 'URL da imagem principal atualizado.');
    } else {
      const newGalleryItem: GalleryImage = {
        id: `img-${Date.now()}`,
        url: urlInput.trim(),
        name: `imagem-galeria-${galleryImages.length + 1}.jpg`,
        sizeBytes: 350000,
        order: galleryImages.length + 1,
      };
      onChangeGalleryImages([...galleryImages, newGalleryItem]);
      success('Imagem Adicionada', 'Nova imagem adicionada à galeria.');
    }

    setUrlInput('');
    setIsUrlModalOpen(false);
  };

  const handleSetAsMain = (item: GalleryImage) => {
    const previousMain = mainImage;
    onChangeMainImage(item.url);

    // Replace the clicked item in the gallery with the previous main, if previous existed
    if (previousMain && previousMain !== item.url) {
      const updatedGallery = galleryImages.map((g) =>
        g.id === item.id ? { ...g, url: previousMain, name: 'imagem-anterior.jpg' } : g
      );
      onChangeGalleryImages(updatedGallery);
    }
    success('Imagem Principal Atualizada', 'Esta imagem agora é a capa do produto na loja.');
  };

  const handleConfirmDeleteImage = () => {
    if (!imageToDelete) return;
    const updated = galleryImages.filter((g) => g.id !== imageToDelete.id);
    onChangeGalleryImages(updated);
    success('Imagem Removida', `${imageToDelete.name} foi removida da galeria.`);
    setImageToDelete(null);
  };

  const handleMoveGalleryImage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= galleryImages.length) return;

    const list = [...galleryImages];
    const temp = list[index];
    list[index] = list[newIndex];
    list[newIndex] = temp;

    // re-index order
    const reordered = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    onChangeGalleryImages(reordered);
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files)}
      />

      {/* Main Image Banner & Upload Slot */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[#191c1d] flex items-center gap-1.5">
            Imagem Principal de Capa <span className="text-red-500 font-bold">*</span>
            <Badge variant="brand" size="sm">Obrigatória para publicar</Badge>
          </label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setTargetSlot('main');
                setIsUrlModalOpen(true);
              }}
              leftIcon={<LinkIcon className="w-3.5 h-3.5" />}
              disabled={disabled || isUploading}
            >
              Inserir por URL
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setTargetSlot('main');
                fileInputRef.current?.click();
              }}
              leftIcon={<UploadCloud className="w-3.5 h-3.5 text-[#a63500]" />}
              disabled={disabled || isUploading}
            >
              Fazer Upload
            </Button>
          </div>
        </div>

        {/* Upload Progress Bar if active */}
        {isUploading && (
          <div className="p-3 bg-[#fff3ef] border border-[#ffb59c] rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#a63500]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                A carregar imagem para o servidor de média...
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-[rgba(166,53,0,0.15)] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#a63500] h-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Main Image Box */}
        <div
          className={`relative border-2 border-dashed rounded-2xl overflow-hidden transition-all duration-200 ${
            error
              ? 'border-red-400 bg-red-50/40'
              : mainImage
              ? 'border-[rgba(25,28,29,0.18)] bg-white'
              : 'border-[rgba(25,28,29,0.18)] hover:border-[#a63500] bg-[#f8f9fa]'
          } p-4 sm:p-6 text-center`}
        >
          {mainImage ? (
            <div className="flex flex-col sm:flex-row items-center gap-6 text-left">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-xl overflow-hidden bg-white border border-[rgba(25,28,29,0.12)] shrink-0 group">
                <img
                  src={mainImage}
                  alt="Destaque do Produto"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback visual on load error
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute top-2 left-2 bg-[#a63500] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Capa Principal
                </div>
              </div>

              <div className="flex-1 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-[#191c1d]">Imagem Definida com Sucesso</span>
                </div>
                <p className="text-[#191c1d]/70 text-[11px] font-mono break-all line-clamp-2">
                  {mainImage}
                </p>
                <p className="text-[#191c1d]/60 text-[11px]">
                  Dimensões recomendadas: 1000x1000px (1:1) com fundo claro ou neutro.
                </p>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTargetSlot('main');
                      fileInputRef.current?.click();
                    }}
                    disabled={disabled}
                  >
                    Substituir Capa
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onChangeMainImage('')}
                    disabled={disabled}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Remover
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="cursor-pointer py-8 flex flex-col items-center justify-center space-y-3"
              onClick={() => {
                setTargetSlot('main');
                fileInputRef.current?.click();
              }}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#fff3ef] text-[#a63500] border border-[#ffb59c] flex items-center justify-center shadow-xs">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#191c1d]">
                  Arrasta e solta a imagem principal aqui, ou clica para navegar
                </p>
                <p className="text-xs text-[#191c1d]/60 mt-1">
                  Formatos suportados: JPG, PNG, WEBP até 5MB.
                </p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs font-semibold text-red-600 flex items-center gap-1.5" role="alert">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </p>
        )}
      </div>

      {/* Additional Gallery Images */}
      <div className="space-y-3 pt-4 border-t border-[rgba(25,28,29,0.08)]">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#191c1d]">
              Galeria de Imagens Adicionais ({galleryImages.length}/8)
            </h4>
            <p className="text-[11px] text-[#191c1d]/60">
              Ângulos de detalhe, fotos de contexto e variações de cor para a loja.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setTargetSlot('gallery');
                setIsUrlModalOpen(true);
              }}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              disabled={disabled || galleryImages.length >= 8}
            >
              Adicionar por URL
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setTargetSlot('gallery');
                fileInputRef.current?.click();
              }}
              leftIcon={<UploadCloud className="w-3.5 h-3.5 text-[#a63500]" />}
              disabled={disabled || galleryImages.length >= 8}
            >
              Upload para Galeria
            </Button>
          </div>
        </div>

        {/* Gallery Grid */}
        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {galleryImages.map((img, index) => (
              <div
                key={img.id}
                className="group relative bg-white border border-[rgba(25,28,29,0.12)] rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-all"
              >
                <div className="aspect-square w-full bg-[#f8f9fa] overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* Badge order */}
                <span className="absolute top-1.5 left-1.5 bg-black/65 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  #{index + 1}
                </span>

                {/* Action Overlays */}
                <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      title="Tornar imagem principal"
                      onClick={() => handleSetAsMain(img)}
                      className="p-1 rounded bg-white/90 text-[#a63500] hover:bg-white text-[10px] font-bold flex items-center gap-1"
                    >
                      <Star className="w-3 h-3 fill-current" />
                    </button>
                    <button
                      type="button"
                      title="Eliminar imagem"
                      onClick={() => setImageToDelete({ id: img.id, name: img.name })}
                      className="p-1 rounded bg-red-600/90 text-white hover:bg-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Reorder buttons */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveGalleryImage(index, 'up')}
                      className="p-1 rounded bg-white/80 text-[#191c1d] hover:bg-white disabled:opacity-30"
                      title="Mover para a esquerda/cima"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={index === galleryImages.length - 1}
                      onClick={() => handleMoveGalleryImage(index, 'down')}
                      className="p-1 rounded bg-white/80 text-[#191c1d] hover:bg-white disabled:opacity-30"
                      title="Mover para a direita/baixo"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[rgba(25,28,29,0.08)] text-center text-xs text-[#191c1d]/60">
            Nenhuma foto adicional na galeria. Podes adicionar até 8 fotos para enriquecer o produto.
          </div>
        )}
      </div>

      {/* URL Input Modal */}
      <Modal
        isOpen={isUrlModalOpen}
        onClose={() => setIsUrlModalOpen(false)}
        title={targetSlot === 'main' ? 'Inserir Imagem de Capa por URL' : 'Adicionar Imagem à Galeria por URL'}
        description="Introduz um link HTTPS direto para o ficheiro de imagem."
        size="md"
      >
        <div className="space-y-4">
          <FormField id="url-input" label="Endereço URL da Imagem" required>
            <Input
              id="url-input"
              placeholder="https://exemplo.com/fotos/produto.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              leftElement={<LinkIcon className="w-4 h-4 text-[#191c1d]/40" />}
            />
          </FormField>

          {urlInput && (
            <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[rgba(25,28,29,0.10)] flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg bg-white border border-[rgba(25,28,29,0.1)] overflow-hidden shrink-0">
                <img
                  src={urlInput}
                  alt="Pré-visualização"
                  className="w-full h-full object-cover"
                  onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                />
              </div>
              <p className="text-xs text-[#191c1d]/70">
                Pré-visualização do link introduzido.
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[rgba(25,28,29,0.08)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsUrlModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleAddUrlImage}
              disabled={!urlInput.trim()}
            >
              Confirmar Imagem
            </Button>
          </div>
        </div>
      </Modal>

      {/* Deletion Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(imageToDelete)}
        onClose={() => setImageToDelete(null)}
        onConfirm={handleConfirmDeleteImage}
        title="Remover Imagem da Galeria?"
        description={`Tem a certeza de que deseja eliminar "${imageToDelete?.name}" da galeria deste produto?`}
        confirmLabel="Sim, Eliminar Imagem"
        cancelLabel="Cancelar"
        variant="danger"
      />
    </div>
  );
};
