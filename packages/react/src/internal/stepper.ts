export function quantity(raw: string, min: number | undefined, max: number | undefined, step: number, base: number) {
    const value = raw === '' ? NaN : Number(raw);
    const units = (value - base) / step;
    const valid = Number.isFinite(value) && (min === undefined || value >= min) && (max === undefined || value <= max) && Math.abs(units - Math.round(units)) <= Math.min(1e-7, Number.EPSILON * 8 * Math.max(1, Math.abs(units)));
    return { valid, minimum: valid && min !== undefined && value === min, maximum: valid && max !== undefined && value === max };
}
export function initialQuantity(raw: unknown, min: number | undefined, max: number | undefined, step: number) {
    if (typeof raw !== 'string')
        throw new Error('OwlA11y: Stepper values must be raw strings.');
    if (raw !== '' && (!/^-?(?:\d+(?:\.\d+)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(raw) || !quantity(raw, min, max, step, min ?? Number(raw)).valid))
        throw new Error('OwlA11y: Stepper initial value must be finite, within range and step-aligned.');
}
