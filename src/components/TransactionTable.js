import React, { useState } from 'react';

function TransactionTable({ transactions }) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const sortedTransactions = React.useMemo(() => {
        let sortableTransactions = [...transactions];
        if (sortConfig.key) {
            sortableTransactions.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableTransactions;
    }, [transactions, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <table>
            <thead>
                <tr>
                    <th onClick={() => requestSort('description')}>Description</th>
                    <th onClick={() => requestSort('amount')}>Amount</th>
                    <th onClick={() => requestSort('date')}>Date</th>
                </tr>
            </thead>
            <tbody>
                {sortedTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                        <td>{transaction.description}</td>
                        <td>${transaction.amount.toFixed(2)}</td>
                        <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default TransactionTable;
