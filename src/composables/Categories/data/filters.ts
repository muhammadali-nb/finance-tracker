import { CategoryType } from '../types';

export interface CategoryTypeFilterOption {
    label: string;
    value: CategoryType | 'all';
}

export const CATEGORY_TYPE_FILTER_OPTIONS: CategoryTypeFilterOption[] = [
    { label: 'Все', value: 'all' },
    { label: 'Доходы', value: CategoryType.INCOME },
    { label: 'Расходы', value: CategoryType.EXPENSE },
];
