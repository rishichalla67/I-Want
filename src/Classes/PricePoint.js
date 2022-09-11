export const PricePoint = (date, price) => {
    return {
        date: date,
        value: parseFloat(price)
    }
}