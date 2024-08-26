interface RequestOptions {
  url: string // 请求的 URL，必填项
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' // 请求方法，选填，默认为 'GET'
  data?: any // 请求的主体数据，可以是对象、数组等
  header?: Record<string, string> // 请求头，键值对形式
  timeout?: number // 请求超时时间，单位毫秒，选填
}

interface ResponseData<T = any> {
  code: number // 服务器返回的状态码，用于判断请求是否成功
  data: T // 响应数据的具体内容，类型由调用者决定
  message: string // 服务器返回的消息，一般用于提示错误信息或成功状态
}

type RequestInterceptor = (
  options: RequestOptions
) => RequestOptions | Promise<RequestOptions>
type ResponseInterceptor<T = any> = (
  response: ResponseData<T>
) => ResponseData<T> | Promise<ResponseData<T>>

class Request {
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []

  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor)
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor)
  }

  private async applyRequestInterceptors(
    options: RequestOptions
  ): Promise<RequestOptions> {
    let interceptedOptions = options
    for (const interceptor of this.requestInterceptors) {
      interceptedOptions = await interceptor(interceptedOptions)
    }
    return interceptedOptions
  }

  private async applyResponseInterceptors<T>(
    response: ResponseData<T>
  ): Promise<ResponseData<T>> {
    let interceptedResponse = response
    for (const interceptor of this.responseInterceptors) {
      interceptedResponse = await interceptor(interceptedResponse)
    }
    return interceptedResponse
  }

  request<T = any>(options: RequestOptions): Promise<ResponseData<T>> {
    return new Promise(async (resolve, reject) => {
      try {
        const interceptedOptions = await this.applyRequestInterceptors(options)
        wx.request({
          ...interceptedOptions,
          success: async (res) => {
            let response: ResponseData<T> = res.data
            response = await this.applyResponseInterceptors(response)
            if (response.code === 200) {
              resolve(response)
            } else {
              reject(response)
            }
          },
          fail: (err) => {
            reject(err)
          }
        })
      } catch (err) {
        reject(err)
      }
    })
  }
}

export const httpClient = new Request()
