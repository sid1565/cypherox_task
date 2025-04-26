import messages from '../config/message.json' assert { type: 'json' };

 export async function errors(res, msg, language) {
    let response = {
      code: 0,
      status: 'FAIL',
      message: getMessage(msg, language) || msg,
    };
    let status_code = 200;

    switch (msg) {
      case 'INVALID_TOKEN':
        response.code = 403;
        status_code = 403;
        break;
      case 'USER_BANNED':
      case 'USER_BLOCKED':
      case 'USER_DELETED':
        response.code = 403; 
        status_code = 403;
        break;
      case 'TOKEN_EXPIRED':
        response.code = 401;
        status_code = 401;
        break;
      default:
        break;
    }

    console.log('\n\n\n============================= FAIL RESPONSE=====================================');
    console.log(response);
    console.log('================================================================================\n\n\n');

    res.status(status_code).json(response);
  }

  export async function success(res, msg, language, data = {}) {
    let response = {
      code: 1,
      status: 'SUCCESS',
      message: getMessage(msg, language),
      data: data || {}, 
    };

    console.log('\n\n\n============================= SUCCESS RESPONSE==================================');
    console.log(response);
    console.log('================================================================================\n\n\n');

    res.status(200).json(response);
  }

  function getMessage(msg, language) {
    const lang = language || 'en';

    if (msg.param && msg.type) {
      if (msg.type.includes('required')) {
        return messages[lang]['PARAM_REQUIRED'].replace('PARAM', msg.param);
      } else if (msg.type.includes('min')) {
        return msg.message;
      } else {
        return messages[lang]['INVALID_PARAM'].replace('PARAM', msg.param);
      }
    } else if (msg.toString().includes('ReferenceError:')) {
      return messages[lang]['INTERNAL_SERVER_ERROR'];
    } else {
      return messages[lang][msg] || msg; // Return the original msg if not found
    }
  }
