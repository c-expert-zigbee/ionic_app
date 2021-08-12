import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {
  constructor() {}

  validateResponse(res: any, rules: Array<any>) {
    let result = { status: false, message: '' };
    if (res['status'] == 200) {
      result.status = true;
      rules.forEach(function (data) {
        if (result.status) {
          if (data.required == false || (res.data.hasOwnProperty(data.key) && res.data[data.key] != null)) {
            if (typeof res.data[data.key] === data.type) {
              if (data.hasOwnProperty('value')) {
                if (data.value == res.data[data.key]) {
                  result.status = true;
                  result.message = res['message'] || 'success';
                } else {
                  result.status = false;
                  result.message = 'missing key ' + data.key;
                }
              } else {
                result.status = true;
                result.message = res['message'] || 'success';
              }
            } else {
              result.status = false;
              result.message = 'type mismatch';
            }
          } else {
            result.status = false;
            result.message = 'missing key ' + data.key;
          }
        }
      });
    } else if (res['status'] == 422) {
      result.message = res['message'] || 'Required field error.';
      if (res['data'] && res['data']['error']) {
        result.message = res['data']['error'];
      }
    } else {
      result.message = 'Server error.';
    }
    return result;
  }

  errorDialogContent(data: any, status: number) {
    let errorData = {
      error: data.error,
      status: status,
      error_code: data.error_code
    };
    if (status == 404) {
      errorData.error = 'Not Found';
      errorData.error_code = 'E0010';
    }
    return errorData;
  }

  parseErrorContent(error: any, status: number) {
    const errorMsg = 'Unable to connect to expatriates.com. Please check your internet connection.';
    let errorData = {
      data: {
        status: status
      },
      hasError: true,
      error: error
    };
    switch (status) {
      case 0:
        errorData.data['errorMessage'] = errorMsg;
        errorData.data['errorCode'] = '0';
        break;
      case 500:
        errorData.data['errorMessage'] = errorMsg;
        errorData.data['errorCode'] = '500';
        break;
      case 404:
        errorData.data['errorMessage'] = 'Not Found';
        errorData.data['errorCode'] = 'E0010';
        break;
      default:
        errorData;
    }
    return errorData;
  }
}
