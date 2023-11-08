import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult } 
  from "aws-lambda/trigger/api-gateway-proxy";
import { PostgresDataSource } from "./database/config/app-data-source";
import jwt from 'jsonwebtoken';

const generateJwt = (id: string): string => {
  const sharedKey = process.env.SHARED_KEY || "";
  const algorithm = "HS256";
  return jwt.sign({ id }, sharedKey, { algorithm });
}

const getCpf = (event: any): string | null => {
  const requestBody = JSON.parse(event.body);
  const cpf = requestBody && requestBody.cpf;
  return cpf;
}

  export const lambdaHandler = async (
     event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> => {

    const cpf = getCpf(event);

    if (!cpf) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "O CPF deve ser informado" })
        };
    }

    const result = await PostgresDataSource.createQueryBuilder('customer').where('cpf = :cpf', { cpf });

    if (result.rows.length === 0) {
      return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Cliente não localizado' })
        };
    }

    const jwt = generateJwt(result.rows[0].id)

    return {
        statusCode: 200,
        body: JSON.stringify({jwt})
    };
  }