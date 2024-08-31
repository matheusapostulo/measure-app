import { GoogleGenerativeAI } from "@google/generative-ai";
import env from "../../env";

export default class GeminiAIService {
  model: any;

  constructor(){
    this.model = new GoogleGenerativeAI(env.GEMINI_API_KEY).getGenerativeModel({ model: "gemini-1.5-flash"});;
  }

  async getMeasureValue(image: string): Promise<number>{
    const prompt =
    `
      Tenho um medidor, me dê apenas o número (não pode vir caracter sem ser número) com a quantidade consumida.
      Tome cuidado com as barras entre os números, caso tenha.
      Elimine os zero(s) à esquerda.
      Cuidado com a virada dos numeros do medidor, analise bem.
      Você consegue gera a imagem para mim?
    `;

    const filePart = this.fileToGenerativePart(image, "image/jpeg")
    
    const images = [
      filePart,
    ]
    
    const generatedContent = await this.model.generateContent([prompt, ...images]);
  
    return Number(generatedContent.response.text());
  }

  private fileToGenerativePart(image: string, mimeType: string) {
    return {
      inlineData: {
        data: Buffer.from(image).toString(),
        mimeType
      },
    };
  }
}