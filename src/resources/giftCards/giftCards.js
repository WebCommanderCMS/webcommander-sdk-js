import {clientCheck, readCallOptions} from '../callArguments.js';
import * as giftCardsUrls from './giftCardsUrls.js';
import {GiftCardPage} from './giftCardsDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */

const requireClient = clientCheck(
    'giftCards.listGiftCards(client, {limit: 5})',
    'client.giftCards.listGiftCards({limit: 5})',
);

/**
 * `GET /admin/gift_cards` — List gift cards, newest first. `code` matches a whole code and `email` a whole address, in any case; `is_active` takes `true`, `false`, `1` or `0`, and `limit` caps at 20 with `offset` or `page` to move on. Any other name is `400` `unknown_parameter`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<GiftCardPage>>}
 */
export function listGiftCards(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(giftCardsUrls.GIFT_CARDS, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: GiftCardPage,
    });
}
