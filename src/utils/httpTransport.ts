import { queryStringify } from './mydash/queryStringify';

enum Method {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE',
}

function getQueryString(data: PlainObject): string {
  const queryString = queryStringify(data);

  return queryString.length ? '?' + queryString : '';
}

type Options = {
  headers?: Record<string, string>;
  timeout?: number;
  data?: PlainObject;
};

export class HTTPTransport {
  private baseUrl = '';

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  get = <T>(url: string, options: Options = {}): Promise<T> => {
    return this.request(url, Method.GET, options) as Promise<T>;
  };

  put = <T>(url: string, options: Options = {}): Promise<T> => {
    return this.request(
      url, Method.PUT,
      options
    ) as Promise<T>;
  };

  post = <T>(url: string, options: Options = {}): Promise<T> => {
    return this.request(
      url, Method.POST,
      {
        ...options,
        headers: { 'content-type': 'application/json', ...options.headers },
      }
    ) as Promise<T>;
  };

  delete = <T>(url: string, options: Options = {}): Promise<T> => {
    return this.request(url, Method.DELETE, options) as Promise<T>;
  };

  private request = (url: string, method: Method, options: Options) => {
    const { data, headers, timeout = 5000 } = options;

    const fullUrl = this.baseUrl + url;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      if (method === Method.GET && data) {
        xhr.open(method, fullUrl + getQueryString(data));
      } else {
        xhr.open(method, fullUrl);
      }

      if (headers) {
        Object.keys(headers).forEach(key => {
          xhr.setRequestHeader(key, headers[key]);
        });
      }

      xhr.withCredentials = true;

      xhr.onload = () => {
        let response: Nullable<PlainObject> = null;

        if (xhr.status >= 500 && xhr.status < 600) {
          reject(response);
        }

        try {
          response = JSON.parse(xhr.response);
        } catch {
          response = null;
        }

        resolve(response);
      };

      xhr.timeout = timeout;

      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.ontimeout = reject;

      if (method === Method.GET || !data) {
        xhr.send();
      } else {
        xhr.send(data instanceof FormData ? data : JSON.stringify(data));
      }
    });
  };
}