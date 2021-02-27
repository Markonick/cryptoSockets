import apiProvider from './Provider'

export default class ApiCore {
  constructor(options) {
    
    if (options.getAll) {
      this.getAll = () => {
        return apiProvider.getAll(options.url)
      };
    }

    if (options.getSingle) {
      this.getSingle = (id) => {
        return apiProvider.getSingle(options.url, id)
      }
    }
  }
}