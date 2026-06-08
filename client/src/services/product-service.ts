import type {
  DeliveryType,
  IPage,
  IProduct,
  IResponse,
  ItemCondition,
  Platform,
} from "@/commons/types";
import { api } from "@/lib/axios";

const productsURL = "/products";

/**
 * Função para salvar um produto
 * @param product - Dados do produto que será salvo
 * @returns - Retorna uma Promise com a resposta da API
 **/
const save = async (product: IProduct): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.post(productsURL, product);
    response = {
      status: 200,
      success: true,
      message: "Produto salvo com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status ?? 0,
      success: false,
      message: "Falha ao salvar produto",
      data: err.response?.data,
    };
  }
  return response;
};

/**
 * Função para buscar todos os produtos
 * @returns - Retorna uma Promise com a resposta da API
 * com a lista de produtos
 **/
const findAll = async (): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const { status, data } = await api.get(productsURL);
    response = {
      status,
      success: true,
      message: "Lista de produtos carregada com sucesso!",
      data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status ?? 0,
      success: false,
      message: "Falha ao carregar a lista de produtos",
      data: err.response?.data,
    };
  }
  return response;
};

/**
 * Função para remover um produto
 * @param id - Recebe o id do produto que será removido
 * @returns - Retorna uma Promise com a resposta da API
 */
const remove = async (id: number): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.delete(`${productsURL}/${id}`);
    response = {
      status: 200,
      success: true,
      message: "Produto removido com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status ?? 0,
      success: false,
      message: "Falha ao remover o produto",
      data: err.response?.data,
    };
  }
  return response;
};

/**
 * Função para buscar um produto pelo id
 * @param id - Recebe o id do produto que será buscado
 * @returns - Retorna uma Promise com a resposta da API
 */
const findById = async (id: number): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.get(`${productsURL}/${id}`);
    response = {
      status: 200,
      success: true,
      message: "Produto carregado com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status ?? 0,
      success: false,
      message: "Falha ao carregar o produto",
      data: err.response?.data,
    };
  }
  return response;
};

/**
 * Busca produtos filtrados por categoria
 * @param categoryId - ID da categoria
 */
const findByCategory = async (categoryId: number): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.get(`${productsURL}/by-category/${categoryId}`);
    response = {
      status: 200,
      success: true,
      message: "Produtos da categoria carregados com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status ?? 0,
      success: false,
      message: "Falha ao carregar produtos da categoria",
      data: err.response?.data,
    };
  }
  return response;
};

export interface CatalogParams {
  page?: number;
  size?: number;
  categoryIds?: number[];
  deliveryTypes?: DeliveryType[];
  platforms?: Platform[];
  itemConditions?: ItemCondition[];
  q?: string;
}

const findCatalog = async ({
  page = 0,
  size = 9,
  categoryIds,
  deliveryTypes,
  platforms,
  itemConditions,
  q,
}: CatalogParams): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    });
    categoryIds?.forEach((id) => params.append("categoryIds", String(id)));
    deliveryTypes?.forEach((type) => params.append("deliveryTypes", type));
    platforms?.forEach((platform) => params.append("platforms", platform));
    itemConditions?.forEach((condition) =>
      params.append("itemConditions", condition),
    );
    if (q?.trim()) {
      params.set("q", q.trim());
    }

    const { status, data } = await api.get(`${productsURL}/catalog?${params}`);
    response = {
      status,
      success: true,
      message: "Catálogo carregado com sucesso!",
      data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status ?? 0,
      success: false,
      message: "Falha ao carregar o catálogo",
      data: err.response?.data,
    };
  }
  return response;
};

// Objeto que exporta todas as funções
const ProductService = {
  save,
  findAll,
  findCatalog,
  findByCategory,
  remove,
  findById,
};

export default ProductService;
