import { BACKEND_BASE_URL } from "@/constants";
import { GetOneResponse, ListResponse } from "@/types";
import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,
    mapResponse: async (response) => {
      const payload: ListResponse = await response.json();

      return payload.data ?? [];
    },
    getTotalCount: async (response) => {
      const payload: ListResponse = await response.json();

      return payload.pagination.toal ?? payload.data.length ?? 0;
    },
  },
  getOne: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,
    mapResponse: async (response) => {
      const json: GetOneResponse = await response.json();

      return json.data ?? {};
    },
  },
};

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };
