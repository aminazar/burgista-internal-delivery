const timeLimit = '22:00:00';

const delivery_ref_types = {
    COUNTING_TODAY: 1,
    COUNTED_BUT_NOT_DELIVERED: 2,
    NOT_COUNTED_BUT_DELIVERED_AND_FINALIZED: 3,
    NOT_COUNTED_AND_NOT_DELIVERED: 4,
    DELIVERED_LESS_THAN_MIN_STOCK: 5,
    CLOSED: 999
}

module.exports = {
    timeLimit,
    delivery_ref_types
}
