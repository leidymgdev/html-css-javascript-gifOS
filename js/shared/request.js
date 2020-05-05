class Request {
  /**
   *Creates an instance of Request.
   * @memberof Request
   */
  constructor() {}

  /**
   * Options for request fetch
   * @param {string} method
   * @param {object} data
   * @returns
   */
  getOptionsFetch = (method, data) => {
    return {
      method: method,
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: data ? data : null
    };
  };

  get = (url) => {
    const result = fetch(url, this.getOptionsFetch('GET'))
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.error('error', error);
      });
    return result;
  };

  post = (url, data) => {
    const result = fetch(url, this.getOptionsFetch('POST', data))
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.error('error', error);
      });
    return result;
  };
}
