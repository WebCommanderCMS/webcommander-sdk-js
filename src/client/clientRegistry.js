import {WebCommanderClient} from './webCommanderClient.js';
import {AuthConfig} from '../config/authConfig.js';
import {SdkConfig, readClientName} from '../config/sdkConfig.js';
import {SdkError, SdkUsageError} from '../errors.js';

const INDEX_LABEL_PATTERN = /^<index \d+>$/;

/** @param {unknown} credentials @param {string} entryPoint @returns {unknown[]} */
function readInstanceBlocks(credentials, entryPoint) {
    if (
        credentials == null ||
        typeof credentials === 'string' ||
        (typeof credentials === 'object' && !Array.isArray(credentials))
    ) {
        throw new SdkUsageError(
            `${entryPoint} takes a list of instances, not a single block; wrap it in a list: ${entryPoint}([block])`,
        );
    }
    if (!Array.isArray(credentials)) {
        throw new SdkUsageError(`${entryPoint} takes a list of instances; ${typeof credentials} is not a list`);
    }
    if (!credentials.length) throw new SdkUsageError(`${entryPoint} needs at least one credentials block`);
    return [...credentials];
}

/** Name what was passed where a client was expected, without invoking its `toString`. @param {unknown} value @returns {string} */
function describeClient(value) {
    if (value === null) return 'null';
    if (typeof value !== 'object') return typeof value;
    const name = /** @type {any} */ (value).constructor?.name;
    return typeof name === 'string' && name ? `a ${name}` : 'an object';
}

/** The message for two instances sharing a `clientName`. @param {string} name @param {number} first @param {number} second */
function describeNameCollision(name, first, second) {
    return `two instances share clientName ${JSON.stringify(name)} (positions ${first} and ${second}); names must be unique so one can be told from the other`;
}

/** @param {unknown[]} blocks @returns {Map<string, number>} */
function indexDeclaredNames(blocks) {
    /** @type {Map<string, number>} */
    const declared = new Map();
    blocks.forEach((block, index) => {
        // Left unindexed: `AuthConfig` rejects a nameless block with a better error.
        const name = readClientName(block);
        if (name == null) return;
        if (declared.has(name)) throw new SdkUsageError(describeNameCollision(name, declared.get(name), index));
        declared.set(name, index);
    });
    return declared;
}

/**
 * Snapshot the blocks, so a caller mutating what they passed cannot change the registry.
 * @param {unknown[]} blocks @returns {unknown[]}
 */
function copyBlocks(blocks) {
    return blocks.map((block) =>
        block && typeof block === 'object' && !(block instanceof SdkConfig) && !(block instanceof AuthConfig)
            ? structuredClone(block)
            : block,
    );
}

/** A collection of clients, one per instance, built on first use from blocks snapshotted at construction. */
export class ClientRegistry {
    /** @param {unknown[]} credentials */
    constructor(credentials) {
        const blocks = copyBlocks(readInstanceBlocks(credentials, 'ClientRegistry'));
        /** @private */
        this._credentials = blocks;
        /** @private */
        this._names = indexDeclaredNames(blocks);
        /** @private */
        this._labels = blocks.map((block, index) => readClientName(block) || `<index ${index}>`);
        /** @type {Map<number, WebCommanderClient>} @private */
        this._clients = new Map();
        /** @type {Set<number>} @private */
        this._supplied = new Set();
    }

    /** The position a name or index selects. @param {number | string | null} [name] @returns {number} */
    resolveIndex(name = null) {
        if (name === null || name === undefined) return 0;
        if (typeof name === 'number' && Number.isInteger(name)) {
            const length = this._credentials.length;
            if (-length <= name && name < length) return ((name % length) + length) % length;
            throw new SdkUsageError(`no instance at index ${name}; ${length} registered (0-${length - 1})`);
        }
        if (this._names.has(/** @type {string} */ (name))) return this._names.get(/** @type {string} */ (name));
        throw new SdkUsageError(
            `unknown instance ${JSON.stringify(name)}; registered: ${this.listClientNames().join(', ')}`,
        );
    }

    /** The client for one instance, built on first use. @param {number | string | null} [name] @returns {WebCommanderClient} */
    getClient(name = null) {
        const index = this.resolveIndex(name);
        let client = this._clients.get(index);
        if (!client) {
            client = new WebCommanderClient(SdkConfig.fromCredentials(this._credentials, {instance: index}));
            this._clients.set(index, client);
        }
        return client;
    }

    /** Add an already-built client under a new name. @param {string} name @param {WebCommanderClient} client */
    addClient(name, client) {
        if (typeof name !== 'string' || !name.trim()) {
            throw new SdkUsageError(`addClient needs a non-blank string name; got ${JSON.stringify(name)}`);
        }
        if (!(client instanceof WebCommanderClient)) {
            throw new SdkUsageError(
                `addClient(${JSON.stringify(name)}) needs a WebCommanderClient; got ${describeClient(client)} — ` +
                    'build one with buildClient() or new WebCommanderClient(config)',
            );
        }
        if (!(client.config instanceof SdkConfig)) {
            throw new SdkUsageError(
                `addClient(${JSON.stringify(name)}): the client's config is not an SdkConfig, so the registry could ` +
                    'not build a second client from this instance',
            );
        }
        if (INDEX_LABEL_PATTERN.test(name)) {
            throw new SdkUsageError(
                `${JSON.stringify(name)} is the label an entry with no clientName already carries; pick a name that cannot collide with a position`,
            );
        }
        if (this._names.has(name) || this._labels.includes(name)) {
            throw new SdkUsageError(`instance ${JSON.stringify(name)} is already registered`);
        }
        this._credentials.push(client.config);
        const index = this._credentials.length - 1;
        this._names.set(name, index);
        this._labels.push(name);
        this._clients.set(index, client);
        this._supplied.add(index);
    }

    /** Every instance label, in selection order. @returns {string[]} */
    listClientNames() {
        return [...this._labels];
    }

    /** Close every client this registry built, dropping all of them even on failure. */
    async closeAllClients() {
        const built = [...this._clients.keys()].filter((index) => !this._supplied.has(index)).sort((a, b) => a - b);
        const failures = [];
        let first = null;
        try {
            for (const index of built) {
                try {
                    await this._clients.get(index).closeClient();
                } catch (failure) {
                    failures.push(
                        `${this._labels[index]}: ${failure instanceof Error ? failure.message : String(failure)}`,
                    );
                    if (first === null) first = failure;
                }
            }
        } finally {
            for (const index of built) this._clients.delete(index);
        }
        if (first !== null) {
            throw new SdkError(
                `${failures.length} of ${built.length} clients failed to close (${failures.join('; ')}); all of them were attempted and dropped, so the registry is usable again`,
            );
        }
    }
}

/** @type {unknown[]} */
let registeredInstances = [];

/**
 * Register the credential blocks `buildClient()` selects from; the first is the default, a later call replaces all.
 * @param {unknown[]} credentials
 */
export function registerInstances(credentials) {
    const blocks = readInstanceBlocks(credentials, 'registerInstances');
    indexDeclaredNames(blocks);
    registeredInstances = copyBlocks(blocks);
}

/** The registered blocks, as a copy; throws if nothing has been registered yet. @returns {unknown[]} */
export function getRegisteredInstances() {
    if (!registeredInstances.length) {
        throw new SdkUsageError(
            'no instances registered — call registerInstances([...]) first, or pass credentials to buildClient()',
        );
    }
    return copyBlocks(registeredInstances);
}
