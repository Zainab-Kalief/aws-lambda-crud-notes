export function success(body) {
    body.status = true;
    return buildResponse(200, body);
}

export function failure(body, statusCode = 500) {
    body.status = false;
    return buildResponse(statusCode, body);
}

function buildResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(body)
    };
}