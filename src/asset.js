export default class Asset {
    constructor({
        value = '',
    } = {}) {
        this.integrity = undefined;
        this.value = value;
    }
}
