type BundleOffer = {
    isBundle: boolean;
    requiredQty: number;
    price: number;        // bundle price
    offerTitle?: string;  // optional
};
type BundleCalcInput = {
    quantity: number;
    unitPrice: number;
    bundle?: BundleOffer;
};

export function getBundleCalculation({
    quantity,
    unitPrice,
    bundle
}: BundleCalcInput) {
    if (!bundle?.isBundle) {
        return {
            total: quantity * unitPrice,
            discount: 0
        };
    }

    const { requiredQty, price: bundlePrice } = bundle;

    const bundlesCount = Math.floor(quantity / requiredQty);
    const remainingCount = quantity % requiredQty;

    const original = quantity * unitPrice;
    const offer = bundlesCount * bundlePrice + remainingCount * unitPrice;

    return {
        total: offer,
        discount: original - offer
    };
}
