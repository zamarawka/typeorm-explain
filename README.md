[![Ci Status](https://github.com/zamarawka/typeorm-explain/workflows/CI/badge.svg)](https://github.com/zamarawka/typeorm-explain/actions)
[![Npm version](https://img.shields.io/npm/v/typeorm-explain.svg?style=flat&logo=npm)](https://www.npmjs.com/package/typeorm-explain)

# typeorm-explain

Tiny helper to wrap TypeORM's query builder queries into `EXPLAIN`.

# Install

```sh
npm install typeorm-explain
```

# Usage

> Currently supports only Postgres driver. Feel free to open PR and add more drivers.

```ts
import explain from 'typeorm-explain';

import { getConnection } from 'typeorm';

const userQuery = getConnection()
  .createQueryBuilder()
  .select('user')
  .from(User, 'user')
  .where('user.id = :id', { id: 1 });

console.log(await explain(userQuery)); // Print explain in console

const user = await userQuery.getOne();
```

# Development

```sh
npm run format # code fomatting
npm run lint # linting
npm run build # build
```

Active maintenance with care and ❤️.

Feel free to send a PR.
