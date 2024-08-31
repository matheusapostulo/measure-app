export default interface GeminiAiServiceProtocol {
    getMeasureValue(image: string): Promise<number>;
}