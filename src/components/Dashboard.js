import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import TransactionTable from './TransactionTable';

function Dashboard() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/transactions`);
                setTransactions(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError('Failed to fetch transactions. Please try again later.');
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    if (loading) return <div aria-live="polite">Loading...</div>;
    if (error) return <div aria-live="assertive" role="alert">{error}</div>;

    return (
        <main>
            <h1>Dashboard</h1>
            {transactions.length === 0 ? (
                <p>No transactions found.</p>
            ) : (
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle}>Description</th>
                            <th style={tableHeaderStyle}>Amount</th>
                            <th style={tableHeaderStyle}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.id}>
                                <td style={tableCellStyle}>{transaction.description}</td>
                                <td style={tableCellStyle}>${transaction.amount.toFixed(2)}</td>
                                <td style={tableCellStyle}>{new Date(transaction.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </main>
    );
}

const tableHeaderStyle = {
    backgroundColor: '#f2f2f2',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd'
};

const tableCellStyle = {
    padding: '12px',
    borderBottom: '1px solid #ddd'
};

export default Dashboard;
