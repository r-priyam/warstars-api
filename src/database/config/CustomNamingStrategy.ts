import { DefaultNamingStrategy, NamingStrategyInterface, Table } from 'typeorm';

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
	primaryKeyName(tableOrName: Table | string) {
		const table = tableOrName instanceof Table ? tableOrName.name : tableOrName;

		return `${table}_pkey`;
	}
}
