/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { localize } from '../../../nls';
import { createDecorator } from '../../instantiation/common/instantiation';
import { Extensions } from '../../configuration/common/configurationRegistry';
import { Registry } from '../../registry/common/platform';
export var IRequestService = createDecorator('requestService2');
Registry.as(Extensions.Configuration)
    .registerConfiguration({
    id: 'http',
    order: 15,
    title: localize('httpConfigurationTitle', "HTTP"),
    type: 'object',
    properties: {
        'http.proxy': {
            type: 'string',
            pattern: '^https?://([^:]*(:[^@]*)?@)?([^:]+)(:\\d+)?/?$|^$',
            description: localize('proxy', "The proxy setting to use. If not set will be taken from the http_proxy and https_proxy environment variables.")
        },
        'http.proxyStrictSSL': {
            type: 'boolean',
            default: true,
            description: localize('strictSSL', "Controls whether the proxy server certificate should be verified against the list of supplied CAs.")
        },
        'http.proxyAuthorization': {
            type: ['null', 'string'],
            default: null,
            description: localize('proxyAuthorization', "The value to send as the 'Proxy-Authorization' header for every network request.")
        }
    }
});
