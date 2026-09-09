'use client';

import React, { useState } from 'react';
import { AlertTriangle, FolderOutput, ArrowRight } from 'lucide-react';
import { Category } from '@/types/product';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  allCategories: Category[];
  onConfirmDelete: (categoryId: number, reassignToCategoryId?: number) => Promise<void>;
}

export const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  allCategories,
  onConfirmDelete,
}) => {
  const [destinationId, setDestinationId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!category) return null;

  const otherCategories = allCategories.filter((c) => c.id !== category.id);
  const productCount = category.productCount || 0;
  const isEmpty = productCount === 0;

  const handleDelete = async () => {
    setError(null);
    if (!isEmpty && !destinationId) {
      setError('Please select a destination category to reassign these cakes.');
      return;
    }

    setIsSubmitting(true);
    try {
      const destId = !isEmpty && destinationId ? Number(destinationId) : undefined;
      await onConfirmDelete(category.id, destId);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isSubmitting) onClose();
      }}
      title={isEmpty ? 'Delete Category' : 'Reassign Cakes & Delete Category'}
      maxWidth="md"
    >
      <div className="space-y-4">
        {isEmpty ? (
          <div>
            <p className="text-sm text-brand-espresso">
              Are you sure you want to delete <span className="font-semibold text-brand-plum">&ldquo;{category.name}&rdquo;</span>?
            </p>
            <p className="text-xs text-brand-muted mt-2">
              This category has no products assigned and can be removed immediately.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <p className="font-bold text-amber-950">
                  &ldquo;{category.name}&rdquo; currently contains {productCount} {productCount === 1 ? 'cake' : 'cakes'}.
                </p>
                <p className="mt-0.5 text-amber-800">
                  To prevent cakes from becoming orphaned, choose another category to safely move these creations to before deleting.
                </p>
              </div>
            </div>

            {otherCategories.length === 0 ? (
              <div className="p-4 rounded-2xl bg-owner-canvas border border-owner-border text-center space-y-2">
                <p className="text-xs text-owner-muted">
                  You do not have any other categories. Please create another category first, or edit the cakes to be Uncategorized before deleting &ldquo;{category.name}&rdquo;.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-brand-espresso">
                  Move {productCount} {productCount === 1 ? 'cake' : 'cakes'} to: <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={destinationId}
                    onChange={(e) => setDestinationId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-brand-border text-brand-espresso text-xs focus:outline-none focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum appearance-none"
                  >
                    <option value="">-- Select Destination Category --</option>
                    {otherCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.productCount || 0} existing cakes)
                      </option>
                    ))}
                  </select>
                  <FolderOutput className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Modal Actions */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-brand-border/60">
          <Button
            variant="ghost"
            type="button"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          {isEmpty ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white border-none"
            >
              Delete Category
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              disabled={otherCategories.length === 0 || !destinationId}
              onClick={handleDelete}
              className="bg-brand-plum hover:bg-brand-plum-hover text-white shadow-2xs"
            >
              <span>Reassign & Delete</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
