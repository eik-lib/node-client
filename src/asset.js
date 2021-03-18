const inspect = Symbol.for('nodejs.util.inspect.custom');

export default class Asset {
    #integrity;
    #value;

    constructor({
        value = '',
    } = {}) {
        this.#integrity = null;
        this.#value = value;
    }
    
    get integrity() {
        return this.#integrity;
    }

    set integrity(value) {
        this.#integrity = value;
    }

    get value() {
        return this.#value;
    }

    set value(value) {
        this.#value = value;
    }

    toJSON() {
        return {
            integrity: this.#integrity,
            value: this.#value,
        }
    }

    [inspect]() {
        return this.toJSON();
    }
}
