export const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;
export const rentalDays = (start: string, end: string) => Math.max(1, Math.ceil((new Date(`${end}T00:00:00`).getTime() - new Date(`${start}T00:00:00`).getTime()) / 86400000));
export const rentalTotal = (dailyPrice: number, days: number, deposit: number) => ({ rent: dailyPrice * days, deposit, total: dailyPrice * days + deposit });
export const today = () => new Date().toISOString().slice(0, 10);
export const dateAfter = (days: number) => new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
