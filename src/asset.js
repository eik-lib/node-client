export default class Asset {
    constructor({
        value = '',
    } = {}) {
        this.integrity = null;
        this.value = value;
    }
}
