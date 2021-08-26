import Base from './base'
import axios from 'axios'
import objectPath from 'object-path'

const HTTP_METHOD = {
  1: 'get',
  2: 'post',
  3: 'delete',
  4: 'put',
  5: 'head',
  6: 'patch',
  get: 1,
  post: 2,
  delete: 3,
  put: 4,
  head: 5,
  patch: 6,
}

const HTTP_PROTOCOL = {
  1: 'http',
  2: 'https',
  http: 1,
  https: 2,
}

const FuncComp = Base.extend({
  props: {
    apis: Array,
  },
  methods: {
    apiUrl(api) {
      if (!api) return ''
      const protocol = isNaN(api.protocol) ? api.protocol : HTTP_PROTOCOL[api.protocol]
      return `${protocol}://${api.prodDomain}${api.path}`
    },
    request(apiId, data) {
      const apiOption = this.apis.find((item) => item.id === apiId)
      const method = HTTP_METHOD[apiOption.method]
      return axios
        .request({
          url: this.apiUrl(apiOption),
          method,
          headers: apiOption.headers || {},
          params: apiOption.method === HTTP_METHOD.get ? data : {},
          data: apiOption.method !== HTTP_METHOD.get ? data : {},
        })
        .then((res) => {
          const { resultPath } = apiOption.resultSchema || {}
          return resultPath ? objectPath.get(res, resultPath) : res.data.result
        })
    },
  },
})

export default function(apis) {
  const comp = new FuncComp()
  comp.apis = apis
  return comp
}
