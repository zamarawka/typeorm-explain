import { getConnection, ObjectLiteral, QueryBuilder, Connection } from 'typeorm';

type PostgresExplainParameters = {
  analyze?: boolean;
  verbose?: boolean;
  costs?: boolean;
  buffers?: boolean;
  timing?: boolean;
};

type FormatTypes = 'text' | 'xml' | 'json' | 'yaml';

type ExplainParameters = undefined | PostgresExplainParameters;

type ExplainBuilder = (
  originalQuery: string,
  explainParameters: ExplainParameters,
  format: FormatTypes,
) => string;

const explains: { [key: string]: ExplainBuilder } = {
  postgres(
    originalQuery: string,
    explainParameters: PostgresExplainParameters = {
      analyze: true,
      verbose: true,
      buffers: true,
    },
    format: FormatTypes,
  ) {
    const boolParameters = Object.entries(explainParameters)
      .filter((argument): argument is [string, boolean] => typeof argument[1] === 'boolean')
      .map(([key, value]) => `${key} ${value}`);

    const explainParametersString = [...boolParameters, `FORMAT ${format.toUpperCase()}`]
      .join(', ')
      .toUpperCase();

    return `EXPLAIN (${explainParametersString}) ${originalQuery}`;
  },
};

export default async function explain<T extends ObjectLiteral>(
  qb: QueryBuilder<T>,
  explainParameters?: ExplainParameters,
  format: FormatTypes = 'text',
  connection: Connection = getConnection(),
) {
  const { type } = connection.driver.options;
  const [originalQuery, queryParameters] = qb.getQueryAndParameters();
  const explainBuilder: ExplainBuilder = explains[type];

  if (!explainBuilder) {
    const driversList = Object.keys(explains).join(',');

    throw new Error(
      `typeorm-explain currently support limited db drivers (${driversList}). Feel free open PR to support your driver: ${type}`,
    );
  }

  const query = explainBuilder(originalQuery, explainParameters, format);

  return connection.query(query, queryParameters);
}
