export default interface UsecaseProtocol {
    execute(input: any): Promise<any>;
}