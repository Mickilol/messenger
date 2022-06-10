enum Methods {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE',
}

type NestedObject = Record<string, number | string | string[] | number[] | object>;

function queryStringify(data: NestedObject): string {
  const result = Object.keys(data).map(key => `${key}=${data[key].toString()}`);
  
  return result.length ? '?' + result.join('&') : '';
}

type Options = {
  headers?: Record<string, string>;
  timeout?: number;
  data?: NestedObject;
};

export class HTTPTransport {
  get = (url: string, options: Options = {}) => {
    return this.request(url, Methods.GET, options, options.timeout);
  };
  
  put = (url: string, options: Options = {}) => {
    return this.request(url, Methods.PUT, options, options.timeout);
  };
  
  post = (url: string, options: Options = {}) => {
    return this.request(url, Methods.POST, options, options.timeout);
  };
  
  delete = (url: string, options: Options = {}) => {
    return this.request(url, Methods.DELETE, options, options.timeout);
  };

  private request = (url: string, method: Methods, options: Options, timeout: number = 5000) => {
    const { data, headers } = options;
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      if (method === Methods.GET && data) {
        xhr.open(method, url + queryStringify(data));
      } else {
        xhr.open(method, url);
      }
      
      if (headers) {
        Object.keys(headers).forEach(key => {
          xhr.setRequestHeader(key, headers[key]);
        });
      }

      xhr.onload = () => {
        resolve(xhr);
      };
      
      xhr.timeout = timeout;

      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.ontimeout = reject;

      if (method === Methods.GET || !data) {
        xhr.send();
      } else {
        xhr.send(JSON.stringify(data));
      }
    });
  };
}