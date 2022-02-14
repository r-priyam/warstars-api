import type { NamingStrategyInterface } from 'typeorm';
import { DefaultNamingStrategy, Table } from 'typeorm';

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
    primaryKeyName(tableOrName: Table | string, columnNames: string[]) {
        const table = tableOrName instanceof Table ? tableOrName.name : tableOrName;
        const columnsSnakeCase = columnNames.join('_');

        return `${table}_${columnsSnakeCase}_pkey`.replace('public.', '');
    }
}
