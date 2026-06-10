import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import type {
  DeliveryType,
  ICategory,
  IProduct,
  IResponse,
  Platform,
} from "@/commons/types";
import { Toast } from "primereact/toast";
import CategoryService from "@/services/category-service";
import ProductService from "@/services/product-service";

interface ProductFormValues {
  name: string;
  description: string;
  image: string;
  category?: ICategory;
  variantLabel: string;
  variantPrice: number;
  deliveryType: DeliveryType;
  platform: Platform;
}

const DELIVERY_OPTIONS = [
  { label: "Entrega física", value: "PHYSICAL" as DeliveryType },
  { label: "Entrega digital (código)", value: "DIGITAL" as DeliveryType },
];

const PLATFORM_OPTIONS = [
  { label: "Universal", value: "UNIVERSAL" as Platform },
  { label: "PlayStation 5", value: "PS5" as Platform },
  { label: "Xbox Series X|S", value: "XBOX_SERIES" as Platform },
  { label: "Steam (PC)", value: "STEAM" as Platform },
  { label: "Epic Games (PC)", value: "EPIC" as Platform },
];

export const ProductFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<IProduct | undefined>(undefined);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      description: "",
      image: "",
      category: undefined,
      variantLabel: "Padrão",
      variantPrice: 0,
      deliveryType: "PHYSICAL",
      platform: "UNIVERSAL",
    },
  });

  const { findAll } = CategoryService;
  const { findById, save } = ProductService;
  const isEdit = !!id;

  useEffect(() => {
    const loadCategories = async () => {
      const response = await findAll();
      if (response.data && Array.isArray(response.data)) {
        setCategories(response.data as ICategory[]);
      } else {
        setCategories([]);
      }
    };
    loadCategories();
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProduct = async () => {
    if (!isEdit) return;

    setLoading(true);
    const response = (await findById(parseInt(id!))) as IResponse;
    try {
      if (response.status === 200) {
        const loaded = response.data as IProduct;
        setProduct(loaded);
        const firstVariant = loaded.variants?.[0];
        reset({
          name: loaded.name,
          description: loaded.description,
          image: loaded.image ?? "",
          category: loaded.category,
          variantLabel: firstVariant?.label ?? "Padrão",
          variantPrice: firstVariant?.price ?? 0,
          deliveryType: firstVariant?.deliveryType ?? "PHYSICAL",
          platform: firstVariant?.platform ?? "UNIVERSAL",
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao carregar o registro.",
          life: 3000,
        });
      }
    } catch {
      setProduct(undefined);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    try {
      const firstVariant = product?.variants?.[0];
      const payload: IProduct = {
        id: product?.id,
        name: data.name,
        description: data.description,
        image: data.image,
        category: data.category!,
        adultOnly: product?.adultOnly ?? false,
        variants:
          isEdit && product?.variants && product.variants.length > 0
            ? product.variants.map((variant, index) =>
                index === 0
                  ? {
                      ...variant,
                      label: data.variantLabel,
                      price: data.variantPrice,
                      deliveryType: data.deliveryType,
                      platform: data.platform,
                    }
                  : variant,
              )
            : [
                {
                  label: data.variantLabel,
                  sku: `SKU-${Date.now()}`,
                  price: data.variantPrice,
                  deliveryType: data.deliveryType,
                  platform: data.platform,
                  itemCondition: "NEW",
                  active: true,
                },
              ],
      };

      if (isEdit && firstVariant && payload.variants?.[0]) {
        payload.variants[0] = {
          ...payload.variants[0],
          id: firstVariant.id,
          sku: firstVariant.sku,
        };
      }

      const response = await save(payload);
      if (
        (response.status === 201 || response.status === 200) &&
        response.data
      ) {
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Registro salvo com sucesso.",
          life: 3000,
        });
        setTimeout(() => navigate("/products"), 1000);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Não foi possível salvar o registro.",
          life: 3000,
        });
      }
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível salvar o registro.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 max-w-2xl">
      <Toast ref={toast} />

      <h2 className="text-2xl font-bold mb-4">
        {isEdit ? "Editar Produto" : "Cadastrar Produto"}
      </h2>
      {!isEdit || product ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1">Nome</label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Nome é obrigatório" }}
              render={({ field }) => (
                <InputText {...field} className="w-full" />
              )}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Descrição</label>
            <Controller
              name="description"
              control={control}
              rules={{ required: "Descrição é obrigatória" }}
              render={({ field }) => (
                <InputText {...field} className="w-full" />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1">URL da imagem</label>
            <Controller
              name="image"
              control={control}
              rules={{ required: "Imagem é obrigatória" }}
              render={({ field }) => (
                <InputText {...field} className="w-full" />
              )}
            />
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Categoria</label>
            <Controller
              name="category"
              control={control}
              rules={{ required: "Categoria é obrigatória" }}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  options={categories}
                  optionLabel="name"
                  placeholder="Selecione uma categoria"
                  className="w-full"
                />
              )}
            />
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          <fieldset className="border border-gray-200 rounded-lg p-4 space-y-4">
            <legend className="px-2 text-sm font-semibold text-gray-700">
              {isEdit && (product?.variants?.length ?? 0) > 1
                ? "Primeira variação (edição simplificada)"
                : "Variação inicial"}
            </legend>

            {isEdit && product?.variants && product.variants.length > 1 && (
              <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                {product.variants.map((variant) => (
                  <li key={variant.id}>
                    {variant.label} — {variant.platform} — R${" "}
                    {Number(variant.price).toFixed(2)}
                  </li>
                ))}
              </ul>
            )}

            <div>
              <label className="block mb-1">Rótulo da variação</label>
              <Controller
                name="variantLabel"
                control={control}
                rules={{ required: "Rótulo é obrigatório" }}
                render={({ field }) => (
                  <InputText {...field} className="w-full" />
                )}
              />
            </div>

            <div>
              <label className="block mb-1">Preço</label>
              <Controller
                name="variantPrice"
                control={control}
                rules={{ required: "Preço é obrigatório" }}
                render={({ field }) => (
                  <InputNumber
                    value={field.value}
                    onValueChange={(e) => field.onChange(e.value ?? 0)}
                    className="w-full"
                    mode="currency"
                    currency="BRL"
                    locale="pt-BR"
                  />
                )}
              />
            </div>

            <div>
              <label className="block mb-1">Tipo de entrega</label>
              <Controller
                name="deliveryType"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    options={DELIVERY_OPTIONS}
                    optionLabel="label"
                    optionValue="value"
                    className="w-full"
                  />
                )}
              />
            </div>

            <div>
              <label className="block mb-1">Plataforma</label>
              <Controller
                name="platform"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    options={PLATFORM_OPTIONS}
                    optionLabel="label"
                    optionValue="value"
                    className="w-full"
                  />
                )}
              />
            </div>
          </fieldset>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              label="Cancelar"
              className="p-button-secondary"
              onClick={() => navigate("/products")}
              loading={loading || isSubmitting}
              disabled={loading || isSubmitting}
            />
            <Button
              type="submit"
              label={isEdit ? "Atualizar" : "Salvar"}
              loading={loading || isSubmitting}
              disabled={loading || isSubmitting}
            />
          </div>
        </form>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
};
