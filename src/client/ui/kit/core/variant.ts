type VariantOptions = Record<string, Record<string, object>>;

type SelectedVariants<TVariants extends VariantOptions> = {
	[K in keyof TVariants]?: keyof TVariants[K];
};

interface VariantConfig<TVariants extends VariantOptions, TBase extends object> {
	base?: TBase;
	variants: TVariants;
	defaults?: SelectedVariants<TVariants>;
}

export function variant<TVariants extends VariantOptions, TBase extends object>(
	config: VariantConfig<TVariants, TBase>,
) {
	return (selected?: SelectedVariants<TVariants>): TBase & object => {
		const merged: Record<string, unknown> = { ...(config.base as object) };
		const final = { ...config.defaults, ...selected } as Record<string, string | number | undefined>;

		for (const [groupName, group] of pairs(config.variants)) {
			const key = final[groupName as string];
			if (key === undefined) continue;
			const variantProps = (group as Record<string, object>)[key as string];
			if (variantProps === undefined) continue;
			for (const [propName, propValue] of pairs(variantProps as Record<string, unknown>)) {
				merged[propName] = propValue;
			}
		}

		return merged as TBase & object;
	};
}

export type VariantProps<T extends (selected?: SelectedVariants<VariantOptions>) => unknown> = Parameters<T>[0];
