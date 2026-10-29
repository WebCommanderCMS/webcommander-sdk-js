import {clientCheck, readCallOptions, requirePayload} from '../../callArguments.js';
import * as animationEffectsUrls from './animationEffectsUrls.js';
import {AnimationEffects} from './animationEffectsDto.js';

/** @typedef {import('../../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} AnimationEffectsPayload */

const requireClient = clientCheck(
    'animationEffects.getAnimationEffects(client)',
    'client.animationEffects.getAnimationEffects()',
);

/**
 * `GET /admin/settings/animation_effects` — the whole area, with `group_meta`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<AnimationEffects>>}
 */
export function getAnimationEffects(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(animationEffectsUrls.ANIMATION_EFFECTS, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: AnimationEffects,
    });
}

/**
 * `PATCH /admin/settings/animation_effects` — partial write of one or more sections, wrapped as
 * `{animation_effects: {<section>: {...}}}` and only so.
 * @param {Client} client @param {AnimationEffectsPayload} payload @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<AnimationEffects>>}
 */
export function patchAnimationEffects(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(animationEffectsUrls.ANIMATION_EFFECTS, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: AnimationEffects,
    });
}

/**
 * `HEAD /admin/settings/animation_effects` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headAnimationEffects(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', animationEffectsUrls.ANIMATION_EFFECTS, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/settings/animation_effects/{section}` — one section, under its own key.
 * @param {Client} client @param {string} section @param {Record<string, unknown>} [queryParams]
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<AnimationEffects>>}
 */
export function getAnimationEffectsSection(client, section, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(animationEffectsUrls.ANIMATION_EFFECTS_SECTION, {
        pathParams: {section},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: AnimationEffects,
    });
}

/**
 * `PATCH /admin/settings/animation_effects/{section}` — partial write of one section, wrapped in its own key
 * and only so.
 * @param {Client} client @param {string} section @param {AnimationEffectsPayload} payload
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<AnimationEffects>>}
 */
export function patchAnimationEffectsSection(client, section, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(animationEffectsUrls.ANIMATION_EFFECTS_SECTION, {
        pathParams: {section},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: AnimationEffects,
    });
}
