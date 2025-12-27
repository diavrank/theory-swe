export abstract class ResponseDto {
    abstract build(...args: unknown[]): ResponseDto;

    protected send(): this {
        this.preserveNulls();
        return this;
    }

    /**
     * Method to return undefined values from dto with NULL values.
     * This helps to keep the original structure.
     * @private
     */
    private preserveNulls(): void {
        for (const [field, value] of Object.entries(this)) {
            this[field] = value ?? null;
        }
    }
}
