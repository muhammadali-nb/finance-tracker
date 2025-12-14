import { DebtType, DebtStatus } from '../types';

export interface DebtTypeFilterOption {
    label: string;
    value: DebtType | 'all';
}

export interface DebtStatusFilterOption {
    label: string;
    value: DebtStatus | 'all';
}

export const DEBT_TYPE_FILTER_OPTIONS: DebtTypeFilterOption[] = [
    { label: 'Все', value: 'all' },
    { label: 'Я занял(а)', value: DebtType.I_OWE },
    { label: 'Мне должны', value: DebtType.OWE_ME },
];

export const DEBT_STATUS_FILTER_OPTIONS: DebtStatusFilterOption[] = [
    { label: 'Все', value: 'all' },
    { label: 'Открытые', value: DebtStatus.OPEN },
    { label: 'Просрочено', value: DebtStatus.OVERDUE },
    { label: 'Погашено', value: DebtStatus.PAID },
];
